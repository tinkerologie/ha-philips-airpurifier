"""Coordinator for Philips AirPurifier integration."""

from __future__ import annotations

import asyncio
from collections.abc import Mapping
import contextlib
import logging
from typing import TYPE_CHECKING, Any

from philips_airctrl import CoAPClient

from homeassistant.exceptions import ConfigEntryNotReady, HomeAssistantError
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .client import async_create_client, async_fetch_status_with_nudge
from .const import DEFAULT_MISSED_PACKAGE_COUNT, DOMAIN
from .device_models import DEVICE_MODELS
from .model import ApiGeneration, DeviceInformation, DeviceModelConfig

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

    from . import PhilipsAirPurifierConfigEntry

_LOGGER = logging.getLogger(__name__)

MISSED_PACKAGE_COUNT = DEFAULT_MISSED_PACKAGE_COUNT
DEFAULT_TIMEOUT = 60
RECONNECT_INITIAL_DELAY = 5
RECONNECT_MAX_DELAY = 60

# Nudge-only devices push status on a real state change, so an idle device
# can legitimately send nothing for a long stretch -- the short
# `_timeout * MISSED_PACKAGE_COUNT` window used for regular devices would
# force needless reconnects on those. But a stream that hangs without
# erroring (socket alive, no data, no exception) still needs to be caught:
# `_async_observe_status` only reconnects when `observe_status()` raises, so
# a silent hang blocks forever otherwise. This longer window catches that
# stall while tolerating normal idle periods.
NUDGE_WATCHDOG_TIMEOUT = 1800

# Every CoAP call the coordinator makes is bounded. `get_status` awaits an
# aiocoap response built with `transport_tuning=Unreliable` and has no internal
# timeout, so a device that accepts a request and never answers leaves the
# await pending indefinitely. The helpers in client.py already bound their
# calls; these are the coordinator's own.
COAP_CALL_TIMEOUT = 30
SHUTDOWN_TIMEOUT = 10

# A reconnect older than this is treated as wedged rather than in progress.
# Without it, `_async_reconnect`'s duplicate guard turns one stuck await into a
# permanent stall: the task is never `done()`, so every later attempt returns
# immediately and neither the success nor the failure branch is ever reached.
RECONNECT_TASK_MAX = 120

# The deadline watchdog sleeps until the update window closes; this floor stops
# a window that has just closed from turning into a busy loop.
WATCHDOG_MIN_SLEEP = 1


class PhilipsAirPurifierCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """Coordinator to manage data from Philips AirPurifier via CoAP push."""

    def __init__(
        self,
        hass: HomeAssistant,
        client: CoAPClient,
        host: str,
        device_info: DeviceInformation,
        update_watchdog_enabled: bool = True,
        missed_package_count_override: int | None = None,
        missed_package_count: int | None = None,
        *,
        config_entry: PhilipsAirPurifierConfigEntry | None = None,
        last_nudge_values: Mapping[str, Any] | None = None,
    ) -> None:
        """Initialize the coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            config_entry=config_entry,
            name=DOMAIN,
        )
        self.client = client
        self.host = host
        # Must be set before model_config / _nudge_keys are read below.
        self.device_info = device_info

        if missed_package_count is not None and missed_package_count_override is None:
            missed_package_count_override = missed_package_count

        self._status_nudge_enabled = bool(getattr(self.model_config, "status_nudge", None))
        # Last resting value the device reported for each nudge key, persisted
        # across restarts so the first nudge restores the user's setting.
        self._nudge_resting_values: dict[str, Any] = {}
        if isinstance(last_nudge_values, Mapping):
            self._nudge_resting_values = {
                key: value for key, value in last_nudge_values.items() if key in self._nudge_keys and value is not None
            }
        self._missed_package_count_override = missed_package_count_override

        self._update_watchdog_enabled = update_watchdog_enabled
        self._observe_task: asyncio.Task[None] | None = None
        self._reconnect_task: asyncio.Task[None] | None = None
        self._reconnect_retry_task: asyncio.Task[None] | None = None
        self._timeout: int = DEFAULT_TIMEOUT
        self._watchdog_task: asyncio.Task[None] | None = None
        self._last_update: float = 0.0
        self._reconnect_delay: int = RECONNECT_INITIAL_DELAY
        # Event-loop time at which the current reconnect task started, so a
        # wedged reconnect can be told from a slow one. None when idle.
        self._reconnect_started: float | None = None
        self._device_available = True
        self._shutting_down: bool = False
        self._shutdown_complete = False
        self._shutdown_lock = asyncio.Lock()
        self._reconnect_dispatch_task: asyncio.Task[None] | None = None
        # Each observation session gets a generation. A cancelled or replaced
        # observer compares its generation before requesting a reconnect, so a
        # stale stream ending late cannot restart recovery (issue #172).
        self._observe_generation = 0
        self._session_started: float | None = None
        self._session_first_push: float | None = None
        self._session_pushes = 0
        # Recovery bookkeeping, exported through diagnostics.
        self._outage_started: float | None = None
        self._reconnect_attempts = 0
        self._consecutive_reconnect_failures = 0
        # Stage and exception type only: exception text can carry the resolved
        # device address, which must not reach diagnostics.
        self._last_reconnect_error: dict[str, str] | None = None

    def _mark_unavailable(self, reason: str) -> None:
        """Mark the device unavailable and log transition once."""
        if self._device_available:
            _LOGGER.warning("Device at %s became unavailable: %s", self.host, reason)
            self._outage_started = asyncio.get_event_loop().time()
            self._device_available = False
            self.last_update_success = False
            self.async_update_listeners()

    def _mark_available(self) -> None:
        """Mark the device available and log transition once."""
        if not self._device_available:
            _LOGGER.info("Device at %s is back online", self.host)
            self.last_update_success = True
            self.async_update_listeners()
        self._device_available = True
        self._outage_started = None

    def _update_failed_error(self) -> UpdateFailed:
        """Build the translated error raised when a status update fails."""
        return UpdateFailed(
            f"Error communicating with device at {self.host}",
            translation_domain=DOMAIN,
            translation_key="update_failed",
            translation_placeholders={"host": self.host},
        )

    def _not_ready_error(self) -> ConfigEntryNotReady:
        """Build the translated error raised when the first refresh fails."""
        return ConfigEntryNotReady(
            f"Failed to connect to device at {self.host}",
            translation_domain=DOMAIN,
            translation_key="cannot_connect",
            translation_placeholders={"host": self.host},
        )

    @property
    def missed_package_count(self) -> int:
        """Return the missed-package watchdog threshold for this device."""
        if self._missed_package_count_override is not None:
            return self._missed_package_count_override
        return self.model_config.missed_package_count

    @property
    def model(self) -> str:
        """Return the device model."""
        return self.device_info.model

    @property
    def device_id(self) -> str:
        """Return the device ID."""
        return self.device_info.device_id

    @property
    def device_name(self) -> str:
        """Return the device name."""
        return self.device_info.name

    @property
    def mac(self) -> str | None:
        """Return the device MAC address, if known (from DHCP discovery)."""
        return self.device_info.mac

    @property
    def model_config(self) -> DeviceModelConfig:
        """Return the device model configuration."""
        model = self.device_info.model
        model_family = model[:6]
        if model in DEVICE_MODELS:
            return DEVICE_MODELS[model]
        if model_family in DEVICE_MODELS:
            return DEVICE_MODELS[model_family]
        return DeviceModelConfig(api_generation=ApiGeneration.GEN1)

    async def async_set_control_value(self, key: str, value: Any) -> None:
        """Set a single control value on the device."""
        await self.async_set_control_values({key: value})

    async def async_set_control_values(self, values: dict[str, Any]) -> None:
        """Set multiple control values on the device."""
        if self._shutting_down:
            raise HomeAssistantError(
                translation_domain=DOMAIN,
                translation_key="command_failed",
                translation_placeholders={"host": self.host},
            )
        try:
            await asyncio.wait_for(self.client.set_control_values(data=values), timeout=COAP_CALL_TIMEOUT)
        except Exception as err:
            raise HomeAssistantError(
                f"Failed to send command to device at {self.host}: {err}",
                translation_domain=DOMAIN,
                translation_key="command_failed",
                translation_placeholders={"host": self.host},
            ) from err

    @property
    def _nudge_keys(self) -> set[str]:
        """Return the wire keys (without "#N" suffix) the status nudge writes."""
        return {key.partition("#")[0] for key, _ in self.model_config.status_nudge or []}

    @property
    def nudge_resting_values(self) -> dict[str, Any]:
        """Return the last observed resting value of each nudge key."""
        return dict(self._nudge_resting_values)

    def _record_nudge_resting_values(self, status: Mapping[str, Any]) -> None:
        """Remember nudge-key values from an ordinary status push.

        Only the persistent observe stream reports the device's real resting
        state; nudge snapshots can carry the transient write, so they must not
        update this map.
        """
        for key in self._nudge_keys:
            if status.get(key) is not None:
                self._nudge_resting_values[key] = status[key]

    def _build_status_nudge(self) -> list[tuple[str, Any]]:
        """Build the nudge write sequence for a push-on-change device.

        The model declares a default sequence: a transient value followed by a
        resting value the device is left on. Writing a fixed resting value
        clobbers a user setting on every nudge -- e.g. forcing the display
        backlight back on after each reconnect, so the display can never be
        turned off. Instead, end the sequence on the value we last observed for
        that key (the user's choice), while still passing through a different
        transient value first so the device sees a genuine change and pushes.

        A model's declared key may carry a "#N" suffix (e.g. "D03105#2") that
        selects a value scheme for entities sharing one physical register under
        different names -- see PhilipsLight.kind stripping the same suffix in
        light.py. The suffix is presentation-only: the wire key and the pushed
        status are always keyed by the bare id, so it's stripped here too,
        otherwise the last-known-value lookup below never matches and the
        "resting" value always wins.
        """
        base = self.model_config.status_nudge or []
        if not base:
            return []

        key = base[0][0].partition("#")[0]
        transient = base[0][1]
        resting = base[-1][1]

        # Restore the user's last-known value for the nudged key. Prefer the
        # value the observe stream last reported (persisted across restarts):
        # coordinator.data may hold a cached CONF_STATUS seed or a nudge
        # snapshot, while every real push also updates the observed value.
        if key in self._nudge_resting_values:
            resting = self._nudge_resting_values[key]
        elif self.data and self.data.get(key) is not None:
            resting = self.data[key]

        # The transient write must differ from the resting value, otherwise the
        # device sees no change and never pushes. The model's two values differ,
        # so fall back to the other one when the resting value collides.
        if transient == resting:
            transient = base[-1][1]

        return [(key, transient), (key, resting)]

    async def _async_nudge_fetch(self) -> dict[str, Any]:
        """Fetch a status snapshot from a device that only pushes on change."""
        nudge = self._build_status_nudge()
        return await async_fetch_status_with_nudge(self.host, nudge, create_client=CoAPClient.create)

    async def _async_refresh_via_nudge(self) -> None:
        """Fetch via nudge and publish the resulting status to listeners."""
        # The nudge helper opens its own short-lived client. Single-client
        # firmware evicts any other connection, so close the coordinator client
        # first and recreate it afterwards — otherwise the observe stream started
        # after this would attach to the connection the nudge just evicted.
        with contextlib.suppress(Exception):
            await asyncio.wait_for(self.client.shutdown(), timeout=SHUTDOWN_TIMEOUT)
        status = await self._async_nudge_fetch()
        replacement = await async_create_client(self.host, create_client=CoAPClient.create)
        if self._shutting_down:
            await asyncio.wait_for(replacement.shutdown(), timeout=SHUTDOWN_TIMEOUT)
            return
        self.client = replacement
        self._timeout = DEFAULT_TIMEOUT
        self._last_update = asyncio.get_event_loop().time()
        self._mark_available()
        self.async_set_updated_data(status)

    async def _async_update_data(self) -> dict[str, Any]:
        """Fetch data from the device (used for initial refresh and fallback)."""
        if self._status_nudge_enabled:
            # This firmware never answers a status read; ongoing state comes
            # from the observe stream. Return the last pushed status if we have
            # it, otherwise force one push via a nudge.
            if self.data:
                self._mark_available()
                return self.data
            try:
                return await self._async_nudge_fetch()
            except Exception as err:
                self._mark_unavailable("status update failed")
                raise self._update_failed_error() from err
        try:
            # One-shot read: ongoing updates come from the observe stream, so
            # avoid registering a redundant observation (philips-airctrl >= 1.1.0).
            status, timeout = await asyncio.wait_for(self.client.get_status(observe=False), timeout=COAP_CALL_TIMEOUT)
            self._timeout = timeout
            self._mark_available()
            return status
        except Exception as err:
            self._mark_unavailable("status update failed")
            raise self._update_failed_error() from err

    def _start_observing(self) -> None:
        """Start observing device status via CoAP push."""
        if self._shutting_down:
            return
        # Bump the generation before cancelling, so the old observer's
        # finally block sees it has been replaced and stays quiet.
        self._observe_generation += 1
        if self._observe_task is not None:
            self._observe_task.cancel()
        self._session_started = None
        self._session_first_push = None
        self._session_pushes = 0

        self._observe_task = self.hass.async_create_background_task(
            self._async_observe_status(self._observe_generation),
            f"philips_airpurifier_observe_{self.host}",
        )

        if not self._update_watchdog_enabled:
            return

        if self._watchdog_task is not None:
            self._watchdog_task.cancel()

        self._watchdog_task = self.hass.async_create_background_task(
            self._async_watchdog(),
            f"philips_airpurifier_watchdog_{self.host}",
        )

    async def _async_stop_observer(self) -> None:
        """Retire the current observer and wait briefly for it to finish."""
        self._observe_generation += 1
        task, self._observe_task = self._observe_task, None
        if task is None or task.done():
            return
        task.cancel()
        # asyncio.wait never raises the old task's CancelledError, while a
        # cancellation of this task still propagates.
        await asyncio.wait({task}, timeout=SHUTDOWN_TIMEOUT)
        if task.done() and not task.cancelled():
            task.exception()

    def _check_first_push(self, generation: int) -> None:
        """Log once when an observation has been registered but stays silent."""
        if generation == self._observe_generation and self._session_pushes == 0:
            _LOGGER.info(
                "Observation of %s registered but no initial response after %d seconds",
                self.host,
                COAP_CALL_TIMEOUT,
            )

    async def _async_observe_status(self, generation: int | None = None) -> None:
        """Observe device status via CoAP push updates."""
        if generation is None:
            generation = self._observe_generation
        loop = asyncio.get_event_loop()
        self._session_started = loop.time()
        # Diagnostic only: this never starts recovery on its own.
        first_push_check = loop.call_later(COAP_CALL_TIMEOUT, self._check_first_push, generation)
        reconnect = True
        try:
            async for status in self.client.observe_status():
                now = loop.time()
                if generation == self._observe_generation:
                    self._session_pushes += 1
                    if self._session_first_push is None:
                        self._session_first_push = now
                        first_push_check.cancel()
                        _LOGGER.debug(
                            "First observation push from %s after %.1f seconds",
                            self.host,
                            now - self._session_started,
                        )
                self._last_update = now
                self._mark_available()
                self._record_nudge_resting_values(status)
                self.async_set_updated_data(status)
            _LOGGER.debug("Observation stream for %s ended without an error, triggering reconnect", self.host)
        except asyncio.CancelledError:
            reconnect = False
            raise
        except Exception as err:
            _LOGGER.debug(
                "Observation stream for %s ended (%s: %s), triggering reconnect",
                self.host,
                type(err).__name__,
                err,
            )
        finally:
            first_push_check.cancel()
            if reconnect and not self._shutting_down and generation == self._observe_generation:
                self._reconnect_dispatch_task = self.hass.async_create_background_task(
                    self._async_reconnect(),
                    f"philips_airpurifier_reconnect_{self.host}",
                )

    def _watchdog_interval(self) -> int:
        """Return how long the device may stay silent before reconnecting."""
        return NUDGE_WATCHDOG_TIMEOUT if self._status_nudge_enabled else self._timeout * self.missed_package_count

    async def _async_watchdog(self) -> None:
        """Watch for missed updates and trigger reconnect if needed.

        The watchdog sleeps until the update window after the last push closes,
        rather than for a fixed period, so an outage is detected about one
        interval after the device fell silent instead of up to two.
        """
        loop = asyncio.get_event_loop()
        triggered_at = 0.0
        while True:
            interval = self._watchdog_interval()
            reference = max(self._last_update, triggered_at)
            remaining = interval - (loop.time() - reference) if reference > 0 else interval
            await asyncio.sleep(max(remaining, WATCHDOG_MIN_SLEEP))
            if self._last_update > 0:
                now = loop.time()
                elapsed = now - self._last_update
                if elapsed > interval:
                    self._mark_unavailable("watchdog timeout")
                    _LOGGER.warning(
                        "No updates from %s for %d seconds (watchdog interval %d seconds, "
                        "%d push(es) in this observation session), reconnecting",
                        self.host,
                        int(elapsed),
                        interval,
                        self._session_pushes,
                    )
                    # Give the reconnect a full interval before checking again.
                    triggered_at = now
                    await self._async_reconnect()

    async def _async_reconnect(self) -> None:
        """Reconnect to the device."""
        if self._shutting_down:
            return
        if self._reconnect_task is not None and not self._reconnect_task.done():
            age = (
                asyncio.get_event_loop().time() - self._reconnect_started
                if self._reconnect_started is not None
                else None
            )
            if age is None or age < RECONNECT_TASK_MAX:
                return
            _LOGGER.warning(
                "Previous reconnect to %s has been running for %d seconds, cancelling it and starting a new one",
                self.host,
                int(age),
            )
            self._reconnect_task.cancel()

        current_task = asyncio.current_task()
        if (
            self._reconnect_retry_task is not None
            and not self._reconnect_retry_task.done()
            and current_task is not self._reconnect_retry_task
        ):
            self._reconnect_retry_task.cancel()
            self._reconnect_retry_task = None

        self._reconnect_started = asyncio.get_event_loop().time()
        self._reconnect_task = self.hass.async_create_background_task(
            self._do_reconnect(),
            f"philips_airpurifier_reconnect_{self.host}",
        )

    def _schedule_reconnect_retry(self, delay: int) -> None:
        """Schedule a reconnect retry after a delay."""
        if self._shutting_down:
            return

        if self._reconnect_retry_task is not None and not self._reconnect_retry_task.done():
            self._reconnect_retry_task.cancel()

        self._reconnect_retry_task = self.hass.async_create_background_task(
            self._async_retry_reconnect(delay),
            f"philips_airpurifier_retry_{self.host}",
        )

    async def _async_retry_reconnect(self, delay: int) -> None:
        """Wait before attempting reconnect again."""
        await asyncio.sleep(delay)
        await self._async_reconnect()

    async def _do_reconnect(self) -> None:
        """Perform the actual reconnect."""
        loop = asyncio.get_event_loop()
        self._reconnect_attempts += 1
        stage = "shutdown"
        try:
            # Retire the old observer first so its stream ending cannot raise
            # into this reconnect and request another one.
            await self._async_stop_observer()
            with contextlib.suppress(Exception):
                await asyncio.wait_for(self.client.shutdown(), timeout=SHUTDOWN_TIMEOUT)

            if self._status_nudge_enabled:
                # Re-fetch via nudge before re-establishing the observe stream.
                # _async_refresh_via_nudge owns the coordinator client here: a
                # client created now would be evicted by the nudge helper's
                # temporary connection, so it (re)creates one after the nudge.
                stage = "nudge"
                outage_started = self._outage_started
                await self._async_refresh_via_nudge()
            else:
                stage = "create"
                replacement = await async_create_client(self.host, create_client=CoAPClient.create)
                if self._shutting_down:
                    await asyncio.wait_for(replacement.shutdown(), timeout=SHUTDOWN_TIMEOUT)
                    return
                self.client = replacement
                # One-shot read before re-establishing the observe stream.
                stage = "status"
                status, timeout = await asyncio.wait_for(
                    self.client.get_status(observe=False), timeout=COAP_CALL_TIMEOUT
                )
                self._timeout = timeout
                self._last_update = loop.time()
                outage_started = self._outage_started
                self._mark_available()
                self.async_set_updated_data(status)
            self._reconnect_delay = RECONNECT_INITIAL_DELAY
            if outage_started is None:
                _LOGGER.info("Reconnected to %s after %d attempt(s)", self.host, self._reconnect_attempts)
            else:
                _LOGGER.info(
                    "Reconnected to %s after %d attempt(s), unavailable for %d seconds",
                    self.host,
                    self._reconnect_attempts,
                    int(loop.time() - outage_started),
                )
            self._reconnect_attempts = 0
            self._consecutive_reconnect_failures = 0
            self._start_observing()
        except asyncio.CancelledError:
            raise
        except Exception as err:
            if stage == "status":
                # Release the client whose status read failed instead of
                # keeping it open through the backoff delay.
                with contextlib.suppress(Exception):
                    await asyncio.wait_for(self.client.shutdown(), timeout=SHUTDOWN_TIMEOUT)
            retry_delay = self._reconnect_delay
            self._reconnect_delay = min(self._reconnect_delay * 2, RECONNECT_MAX_DELAY)
            self._consecutive_reconnect_failures += 1
            self._last_reconnect_error = {"stage": stage, "type": type(err).__name__}
            self._mark_unavailable("reconnect failed")
            # A timeout has an empty message, so the type is what identifies it.
            _LOGGER.warning(
                "Reconnect to %s failed at the %s stage (%s: %s), retrying in %s seconds",
                self.host,
                stage,
                type(err).__name__,
                err,
                retry_delay,
            )
            _LOGGER.debug("Reconnect to %s failed", self.host, exc_info=True)
            self._schedule_reconnect_retry(retry_delay)

    def connection_diagnostics(self) -> dict[str, Any]:
        """Return a snapshot of the connection lifecycle for diagnostics."""
        now = asyncio.get_event_loop().time()

        def age(started: float | None) -> float | None:
            return round(now - started, 1) if started else None

        reconnecting = self._reconnect_task is not None and not self._reconnect_task.done()
        return {
            "available": self.last_update_success,
            "seconds_since_last_update": age(self._last_update),
            "watchdog_enabled": self._update_watchdog_enabled,
            "watchdog_interval": self._watchdog_interval(),
            "observer_running": self._observe_task is not None and not self._observe_task.done(),
            "observation_generation": self._observe_generation,
            "session_pushes": self._session_pushes,
            "session_age": age(self._session_started),
            "first_push_latency": (
                round(self._session_first_push - self._session_started, 1)
                if self._session_first_push is not None and self._session_started is not None
                else None
            ),
            "reconnect_in_progress": reconnecting,
            "reconnect_age": age(self._reconnect_started) if reconnecting else None,
            "reconnect_delay": self._reconnect_delay,
            "reconnect_attempts": self._reconnect_attempts,
            "consecutive_reconnect_failures": self._consecutive_reconnect_failures,
            "last_reconnect_error": self._last_reconnect_error,
            "outage_seconds": age(self._outage_started),
        }

    async def async_first_refresh_and_observe(self) -> None:
        """Perform first refresh and start observing."""
        if self._status_nudge_enabled:
            try:
                # This firmware never answers a status read; force the first
                # push with a nudge, then observe for subsequent changes.
                await self._async_refresh_via_nudge()
                _LOGGER.debug("First refresh (via nudge) completed for %s", self.host)
            except Exception as err:
                self.last_update_success = False
                self._device_available = False
                raise self._not_ready_error() from err
            self._start_observing()
            return

        if not self._update_watchdog_enabled and self.data:
            self._last_update = asyncio.get_event_loop().time()
            self._mark_available()
            self._start_observing()
            return

        try:
            # One-shot initial read; continuous updates come from the observe
            # stream started below, so don't register a second observation here.
            status, timeout = await asyncio.wait_for(self.client.get_status(observe=False), timeout=COAP_CALL_TIMEOUT)
            self._timeout = timeout
            self._mark_available()
            self.async_set_updated_data(status)
            _LOGGER.debug("First refresh completed for %s", self.host)
        except Exception as err:
            self.last_update_success = False
            self._device_available = False
            raise self._not_ready_error() from err

        self._last_update = asyncio.get_event_loop().time()
        self._start_observing()

    async def async_shutdown(self) -> None:
        """Release the client once, even when shutdown callers overlap."""
        async with self._shutdown_lock:
            if self._shutdown_complete:
                return
            self._shutting_down = True
            tasks = [
                task
                for task in (
                    self._observe_task,
                    self._watchdog_task,
                    self._reconnect_task,
                    self._reconnect_retry_task,
                    self._reconnect_dispatch_task,
                )
                if task is not None and not task.done()
            ]
            for task in tasks:
                task.cancel()
            try:
                await super().async_shutdown()
                if tasks:
                    done, pending = await asyncio.wait(tasks, timeout=SHUTDOWN_TIMEOUT)
                    for task in done:
                        with contextlib.suppress(asyncio.CancelledError, Exception):
                            task.result()
                    if pending:
                        _LOGGER.debug("%d device task(s) did not stop before shutdown timeout", len(pending))
            finally:
                try:
                    with contextlib.suppress(Exception):
                        await asyncio.wait_for(self.client.shutdown(), timeout=SHUTDOWN_TIMEOUT)
                finally:
                    self._observe_task = None
                    self._watchdog_task = None
                    self._reconnect_task = None
                    self._reconnect_retry_task = None
                    self._reconnect_dispatch_task = None
                    self._shutdown_complete = True
