"""Support for Philips AirPurifier with CoAP."""

from __future__ import annotations

from collections.abc import Callable
import logging
from typing import cast

from philips_airctrl import CoAPClient

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, CONF_NAME, Platform
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .client import async_create_client
from .const import (
    CONF_DEVICE_ID,
    CONF_LAST_NUDGE_VALUES,
    CONF_MAC,
    CONF_MISSED_PACKAGE_COUNT,
    CONF_MODEL,
    CONF_STATUS,
    CONF_UPDATE_WATCHDOG,
    DOMAIN,
)
from .coordinator import PhilipsAirPurifierCoordinator
from .model import DeviceInformation
from .repairs import async_check_integration_health
from .services import async_setup_services

_LOGGER = logging.getLogger(__name__)

type PhilipsAirPurifierConfigEntry = ConfigEntry[PhilipsAirPurifierCoordinator]

PLATFORMS: list[Platform] = [
    Platform.BINARY_SENSOR,
    Platform.CLIMATE,
    Platform.EVENT,
    Platform.FAN,
    Platform.HUMIDIFIER,
    Platform.LIGHT,
    Platform.NUMBER,
    Platform.SELECT,
    Platform.SENSOR,
    Platform.SWITCH,
]

CONFIG_SCHEMA: Callable[[ConfigType], ConfigType] = cast(
    Callable[[ConfigType], ConfigType],
    cv.config_entry_only_config_schema(DOMAIN),  # pyright: ignore[reportUnknownMemberType]
)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up Philips AirPurifier integration."""
    _ = config
    await async_setup_services(hass)
    return True


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PhilipsAirPurifierConfigEntry,
) -> bool:
    """Set up Philips AirPurifier from a config entry."""
    host = entry.data[CONF_HOST]
    model = entry.data[CONF_MODEL]
    name = entry.data[CONF_NAME]
    device_id = entry.data[CONF_DEVICE_ID]

    _LOGGER.debug("async_setup_entry called for host %s", host)

    try:
        client = await async_create_client(host, timeout=25, create_client=CoAPClient.create)
        _LOGGER.debug("Got a valid client for host %s", host)
    except Exception as err:
        _LOGGER.warning("Failed to connect to host %s: %s", host, err)
        raise ConfigEntryNotReady(
            f"Failed to connect to device at {host}",
            translation_domain=DOMAIN,
            translation_key="cannot_connect",
            translation_placeholders={"host": host},
        ) from err

    device_information = DeviceInformation(
        host=host,
        mac=entry.data.get(CONF_MAC),
        model=model,
        name=name,
        device_id=device_id,
    )

    coordinator = PhilipsAirPurifierCoordinator(
        hass,
        client,
        host,
        device_information,
        update_watchdog_enabled=entry.options.get(CONF_UPDATE_WATCHDOG, True),
        missed_package_count_override=entry.options.get(CONF_MISSED_PACKAGE_COUNT),
        config_entry=entry,
        last_nudge_values=entry.data.get(CONF_LAST_NUDGE_VALUES),
    )

    if not entry.options.get(CONF_UPDATE_WATCHDOG, True) and CONF_STATUS in entry.data:
        coordinator.async_set_updated_data(entry.data[CONF_STATUS])

    # Perform initial data refresh, then start CoAP observation
    await coordinator.async_first_refresh_and_observe()

    hass.async_create_task(async_check_integration_health(hass, coordinator))

    def _schedule_health_check() -> None:
        hass.async_create_task(async_check_integration_health(hass, coordinator))

    entry.async_on_unload(coordinator.async_add_listener(_schedule_health_check))

    # Store initial status in config entry data if missing
    if CONF_STATUS not in entry.data:
        _LOGGER.debug("Saving initial status data for model %s", model)
        new_data = {**entry.data, CONF_STATUS: coordinator.data}
        hass.config_entries.async_update_entry(entry, data=new_data)

    if coordinator.model_config.status_nudge:

        def _persist_nudge_values() -> None:
            _persist_nudge_resting_values(hass, entry, coordinator)

        # Capture any push that arrived during setup, then follow changes.
        _persist_nudge_values()
        entry.async_on_unload(coordinator.async_add_listener(_persist_nudge_values))

    entry.runtime_data = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True


def _persist_nudge_resting_values(
    hass: HomeAssistant,
    entry: PhilipsAirPurifierConfigEntry,
    coordinator: PhilipsAirPurifierCoordinator,
) -> None:
    """Save the nudge keys' last resting values when they change.

    Push-only models restore these on the first nudge after a restart, when
    there is no live status yet, so the nudge doesn't override the user's
    display setting.
    """
    values = coordinator.nudge_resting_values
    if values != (entry.data.get(CONF_LAST_NUDGE_VALUES) or {}):
        hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_LAST_NUDGE_VALUES: values})


async def async_unload_entry(
    hass: HomeAssistant,
    entry: PhilipsAirPurifierConfigEntry,
) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        await entry.runtime_data.async_shutdown()

    return unload_ok
