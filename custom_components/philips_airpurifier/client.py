"""Client helpers for Philips Air Purifier CoAP communication."""

from __future__ import annotations

import asyncio
import contextlib
import importlib
import logging
import os
from typing import Any
import warnings

from philips_airctrl import CoAPClient

_LOGGER = logging.getLogger(__name__)

# Delay before nudging, to let the observation register on the device.
_NUDGE_REGISTER_DELAY = 2.0
# How long to wait for a push after each nudge, and how many times to nudge.
_NUDGE_WAIT_TIMEOUT = 12.0
_NUDGE_ATTEMPTS = 2
_AIOCOAP_CLIENT_TRANSPORT_ENV = "AIOCOAP_CLIENT_TRANSPORT"
_aiocoap_transport_env_ready = False
_aiocoap_transport_env_lock = asyncio.Lock()


def _preload_aiocoap_client_transports(transports: str | None) -> None:
    """Preload aiocoap client transports in worker thread under a scoped warning filter.

    Upstream aiocoap's DTLSClientConnection._start() in tinydtls.py contains a
    'return' in a 'finally' block, which triggers a compile-time SyntaxWarning on
    Python 3.14+. philips-airctrl uses only coap:// (plain UDP CoAP), not DTLS
    (coaps://), but aiocoap pre-imports available client transports when
    initializing the client context. Later, DTLSClientConnection._start() imports
    DTLSSocket.

    Preloading tinydtls here under a scoped filter suppresses the warning without
    affecting transport availability or making DTLS usable. This workaround can
    be removed once upstream aiocoap releases a fix for DTLSClientConnection._start().
    Upstream reference: https://github.com/chrysn/aiocoap/issues
    Integration reference: https://github.com/ruaan-deysel/ha-philips-airpurifier/issues/127
    """
    if not transports or "tinydtls" not in transports.split(":"):
        return

    with contextlib.suppress(Exception):
        with warnings.catch_warnings():
            warnings.filterwarnings(
                "ignore",
                category=SyntaxWarning,
                message=r".*'return' in a 'finally' block.*",
                module=r".*aiocoap\.transports\.tinydtls.*",
            )
            importlib.import_module("aiocoap.transports.tinydtls")


def _resolve_aiocoap_client_transport_env() -> str | None:
    """Resolve aiocoap client transports as an env-var value."""
    with contextlib.suppress(Exception):
        # aiocoap does not ship stubs; keep this optional preload boundary dynamic.
        defaults_any: Any = importlib.import_module("aiocoap.defaults")
        raw_transports = defaults_any.get_default_clienttransports(use_env=True)
        transports = tuple(str(transport) for transport in raw_transports)
        if transports:
            return ":".join(transports)
    return None


def _prepare_aiocoap_transports_worker(existing_env: str | None) -> str | None:
    """Resolve and preload aiocoap client transports in a worker thread."""
    if existing_env is None:
        resolved = _resolve_aiocoap_client_transport_env()
        effective = resolved
    else:
        resolved = None
        effective = existing_env

    _preload_aiocoap_client_transports(effective)
    return resolved


async def _async_prepare_aiocoap_client_transport_env() -> None:
    """Prepare aiocoap transport defaults outside the event loop."""
    global _aiocoap_transport_env_ready

    if _aiocoap_transport_env_ready:
        return

    async with _aiocoap_transport_env_lock:
        if _aiocoap_transport_env_ready:
            return

        existing_env = os.environ.get(_AIOCOAP_CLIENT_TRANSPORT_ENV)
        resolved = await asyncio.to_thread(_prepare_aiocoap_transports_worker, existing_env)
        if existing_env is None and resolved:
            os.environ[_AIOCOAP_CLIENT_TRANSPORT_ENV] = resolved

        _aiocoap_transport_env_ready = True


async def async_create_client(
    host: str,
    timeout: float = 25,
    create_client: Any | None = None,
) -> CoAPClient:
    """Create a CoAP client for a host with timeout protection."""
    await _async_prepare_aiocoap_client_transport_env()
    creator = create_client or CoAPClient.create
    return await asyncio.wait_for(creator(host), timeout=timeout)


async def async_fetch_status(
    host: str,
    connect_timeout: float = 30,
    status_timeout: float = 30,
    create_client: Any | None = None,
) -> dict[str, Any]:
    """Fetch current status using a temporary CoAP client and shut it down.

    Uses ``observe=False`` (philips-airctrl >= 1.1.0) so this one-shot read does
    not leave a CoAP observation registered on the device.
    """
    client = await async_create_client(host, timeout=connect_timeout, create_client=create_client)
    try:
        status, _ = await asyncio.wait_for(client.get_status(observe=False), timeout=status_timeout)
        return status
    finally:
        with contextlib.suppress(Exception):
            await client.shutdown()


async def async_fetch_device_info(
    host: str,
    timeout: float = 15,
    create_client: Any | None = None,
) -> dict[str, Any]:
    """Fetch the plaintext ``sys/dev/info`` resource (model id, name, device id).

    ``CoAPClient.create(host, sync=False)`` skips the encrypted sync handshake,
    which is required for push-only firmware that never answers the
    ``sys/dev/status`` read, so this identifies a device whose status cannot be
    read directly.
    """
    await _async_prepare_aiocoap_client_transport_env()
    creator = create_client or CoAPClient.create
    client = await asyncio.wait_for(creator(host, sync=False), timeout=timeout)
    try:
        return await client.get_device_info()
    finally:
        with contextlib.suppress(Exception):
            await client.shutdown()


async def async_fetch_status_with_nudge(
    host: str,
    nudge: list[tuple[str, Any]],
    connect_timeout: float = 30,
    status_timeout: float = 30,
    create_client: Any | None = None,
) -> dict[str, Any]:
    """Fetch status from a device that only pushes on a real state change.

    Some firmwares never answer a status read; they only push the status
    resource to observers when the device state changes. This opens an
    observation and sends ``nudge`` control writes on the *same* CoAP client to
    force the first push, then returns that status.

    A single client is used for both the observation and the nudge writes:
    these firmwares appear to serve only one CoAP client, so a second
    connection would evict the observer and the push would never arrive. The
    observe GET and the encrypted control POST are independent requests on the
    one shared context, so they coexist safely.
    """
    _ = status_timeout  # bounded per-attempt by _NUDGE_WAIT_TIMEOUT below
    client = await async_create_client(host, timeout=connect_timeout, create_client=create_client)
    _LOGGER.debug("Nudge: client connected to %s, opening observation", host)
    result: dict[str, Any] = {}
    received = asyncio.Event()

    async def _watch() -> None:
        try:
            async for status in client.observe_status():
                result["status"] = status
                received.set()
                return
        except Exception as ex:  # noqa: BLE001
            _LOGGER.debug("Nudge: observe stream for %s ended before a push: %s", host, ex)

    watch_task = asyncio.create_task(_watch())
    try:
        # Let the observation register on the device before changing state.
        await asyncio.sleep(_NUDGE_REGISTER_DELAY)
        for attempt in range(1, _NUDGE_ATTEMPTS + 1):
            for key, value in nudge:
                try:
                    await client.set_control_value(key, value)
                except Exception as ex:  # noqa: BLE001
                    _LOGGER.debug(
                        "Nudge: write %s=%s failed on attempt %d for %s: %s",
                        key,
                        value,
                        attempt,
                        host,
                        ex,
                    )
            _LOGGER.debug("Nudge: attempt %d/%d sent to %s, awaiting push", attempt, _NUDGE_ATTEMPTS, host)
            with contextlib.suppress(TimeoutError):
                await asyncio.wait_for(received.wait(), timeout=_NUDGE_WAIT_TIMEOUT)
            if received.is_set():
                _LOGGER.debug("Nudge: push received from %s on attempt %d", host, attempt)
                return result["status"]
            _LOGGER.debug("Nudge: no push from %s after attempt %d/%d", host, attempt, _NUDGE_ATTEMPTS)
        msg = f"no status push from {host} after {_NUDGE_ATTEMPTS} nudge attempts"
        raise TimeoutError(msg)
    finally:
        watch_task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await watch_task
        with contextlib.suppress(Exception):
            await client.shutdown()
