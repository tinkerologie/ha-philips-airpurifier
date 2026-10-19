"""Tests for Philips AirPurifier services."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.philips_airpurifier.const import DOMAIN, PhilipsApi
from custom_components.philips_airpurifier.services import (
    SERVICE_FILTER_RESET,
    SERVICE_SET_CHILD_LOCK,
    _get_coordinator_from_entity_id,
    _reset_filter_counters,
    async_setup_services,
)
from homeassistant.components.fan import DOMAIN as FAN_DOMAIN
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import area_registry as ar, device_registry as dr, entity_registry as er
from homeassistant.helpers.target import SelectedEntities


def _get_fan_entity_id(hass: HomeAssistant, config_entry: MockConfigEntry) -> str:
    """Return fan entity ID for the configured entry."""
    entity_registry = er.async_get(hass)
    entries = er.async_entries_for_config_entry(entity_registry, config_entry.entry_id)
    fan_entry = next(e for e in entries if e.domain == FAN_DOMAIN)
    return fan_entry.entity_id


async def test_get_coordinator_from_entity_id_valid(
    hass: HomeAssistant,
    init_integration: MockConfigEntry,
) -> None:
    """Test coordinator lookup returns runtime_data for valid entity."""
    entity_id = _get_fan_entity_id(hass, init_integration)

    coordinator = _get_coordinator_from_entity_id(hass, entity_id)

    assert coordinator is init_integration.runtime_data


async def test_get_coordinator_from_entity_id_missing_entity(hass: HomeAssistant) -> None:
    """Test coordinator lookup returns None for unknown entity."""
    assert _get_coordinator_from_entity_id(hass, "fan.missing") is None


async def test_setup_services_idempotent(hass: HomeAssistant) -> None:
    """Test service registration is idempotent."""
    await async_setup_services(hass)
    await async_setup_services(hass)

    assert hass.services.has_service(DOMAIN, SERVICE_FILTER_RESET)
    assert hass.services.has_service(DOMAIN, SERVICE_SET_CHILD_LOCK)


async def test_set_child_lock_service_with_target(
    hass: HomeAssistant,
    init_integration: MockConfigEntry,
    mock_coap_client: AsyncMock,
) -> None:
    """Test a targeted call passes schema validation and reaches the device."""
    entity_id = _get_fan_entity_id(hass, init_integration)
    mock_coap_client.set_control_values.reset_mock()

    await hass.services.async_call(
        DOMAIN,
        SERVICE_SET_CHILD_LOCK,
        {"enabled": True},
        target={"entity_id": entity_id},
        blocking=True,
    )

    mock_coap_client.set_control_values.assert_awaited_once_with(data={PhilipsApi.CHILD_LOCK: True})


async def test_services_remain_after_last_entry_unloaded(
    hass: HomeAssistant,
    init_integration: MockConfigEntry,
) -> None:
    """Test services stay registered and reject targets of an unloaded entry."""
    entity_id = _get_fan_entity_id(hass, init_integration)

    await hass.config_entries.async_unload(init_integration.entry_id)
    await hass.async_block_till_done()

    assert hass.services.has_service(DOMAIN, SERVICE_FILTER_RESET)
    assert hass.services.has_service(DOMAIN, SERVICE_SET_CHILD_LOCK)
    assert _get_coordinator_from_entity_id(hass, entity_id) is None

    with pytest.raises(ServiceValidationError, match="Invalid target entity"):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_CHILD_LOCK,
            {"entity_id": entity_id, "enabled": True},
            blocking=True,
        )


async def test_filter_reset_service_calls_reset(
    hass: HomeAssistant,
    init_integration: MockConfigEntry,
) -> None:
    """Test filter_reset service calls reset helper."""
    await async_setup_services(hass)

    entity_id = _get_fan_entity_id(hass, init_integration)

    with (
        patch(
            "custom_components.philips_airpurifier.services._extract_selected_entities",
            new=MagicMock(return_value=SelectedEntities(referenced={entity_id})),
        ),
        patch(
            "custom_components.philips_airpurifier.services._reset_filter_counters",
            new=AsyncMock(),
        ) as reset_mock,
    ):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_FILTER_RESET,
            {"filter_type": "pre_filter"},
            blocking=True,
        )

        reset_mock.assert_awaited_once_with(init_integration.runtime_data, "pre_filter")


async def test_filter_reset_service_wraps_errors(
    hass: HomeAssistant,
    init_integration: MockConfigEntry,
) -> None:
    """Test filter_reset wraps reset errors into HomeAssistantError."""
    await async_setup_services(hass)

    entity_id = _get_fan_entity_id(hass, init_integration)

    with (
        patch(
            "custom_components.philips_airpurifier.services._extract_selected_entities",
            new=MagicMock(return_value=SelectedEntities(referenced={entity_id})),
        ),
        patch(
            "custom_components.philips_airpurifier.services._reset_filter_counters",
            new=AsyncMock(side_effect=RuntimeError("boom")),
        ),
        pytest.raises(HomeAssistantError, match="Filter reset failed"),
    ):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_FILTER_RESET,
            {"filter_type": "pre_filter"},
            blocking=True,
        )


async def test_set_child_lock_service_calls_coordinator(
    hass: HomeAssistant,
    init_integration: MockConfigEntry,
) -> None:
    """Test set_child_lock service sets child lock value."""
    await async_setup_services(hass)

    entity_id = _get_fan_entity_id(hass, init_integration)
    coordinator = init_integration.runtime_data

    with (
        patch(
            "custom_components.philips_airpurifier.services._extract_selected_entities",
            new=MagicMock(return_value=SelectedEntities(referenced={entity_id})),
        ),
        patch.object(coordinator, "async_set_control_value", new=AsyncMock()) as set_mock,
    ):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_CHILD_LOCK,
            {"enabled": True},
            blocking=True,
        )

        set_mock.assert_awaited_once_with(PhilipsApi.CHILD_LOCK, True)


async def test_set_child_lock_service_wraps_errors(
    hass: HomeAssistant,
    init_integration: MockConfigEntry,
) -> None:
    """Test set_child_lock wraps coordinator errors into HomeAssistantError."""
    await async_setup_services(hass)

    entity_id = _get_fan_entity_id(hass, init_integration)
    coordinator = init_integration.runtime_data

    with (
        patch(
            "custom_components.philips_airpurifier.services._extract_selected_entities",
            new=MagicMock(return_value=SelectedEntities(referenced={entity_id})),
        ),
        patch.object(
            coordinator,
            "async_set_control_value",
            new=AsyncMock(side_effect=RuntimeError("boom")),
        ),
        pytest.raises(HomeAssistantError, match="Set child lock failed"),
    ):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_CHILD_LOCK,
            {"enabled": False},
            blocking=True,
        )


async def test_reset_filter_counters_all_filters() -> None:
    """Test resetting all filter counters writes totals when known."""
    coordinator = AsyncMock()
    coordinator.data = {
        "flttotal0": 100,
        "flttotal1": 200,
        "flttotal2": 300,
        "D05-08": 400,
    }

    await _reset_filter_counters(coordinator, "all")

    assert coordinator.async_set_control_value.await_args_list == [
        (("fltsts0", 100),),
        (("fltsts1", 200),),
        (("fltsts2", 300),),
        (("D05-14", 400),),
    ]


async def test_reset_filter_counters_unknown_filter_raises() -> None:
    """Test unknown filter type raises ServiceValidationError."""
    coordinator = AsyncMock()
    coordinator.data = {}

    with pytest.raises(ServiceValidationError, match="Unknown filter type"):
        await _reset_filter_counters(coordinator, "unknown")


async def test_reset_filter_counters_zero_capacity_skips_call() -> None:
    """Test filter reset skips when total capacity is zero."""
    coordinator = AsyncMock()
    coordinator.data = {"flttotal0": 0}

    await _reset_filter_counters(coordinator, "pre_filter")

    coordinator.async_set_control_value.assert_not_awaited()


async def test_filter_reset_service_invalid_entity_raises(
    hass: HomeAssistant,
) -> None:
    """Test filter reset service raises on entity ids without coordinators."""
    await async_setup_services(hass)

    with (
        patch(
            "custom_components.philips_airpurifier.services._extract_selected_entities",
            new=MagicMock(return_value=SelectedEntities(referenced={"fan.unknown_entity"})),
        ),
        pytest.raises(ServiceValidationError, match="Invalid target entity"),
    ):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_FILTER_RESET,
            {"filter_type": "all"},
            blocking=True,
        )


async def test_set_child_lock_service_invalid_entity_raises(
    hass: HomeAssistant,
) -> None:
    """Test child lock service raises on entity ids without coordinators."""
    await async_setup_services(hass)

    with (
        patch(
            "custom_components.philips_airpurifier.services._extract_selected_entities",
            new=MagicMock(return_value=SelectedEntities(referenced={"fan.unknown_entity"})),
        ),
        pytest.raises(ServiceValidationError, match="Invalid target entity"),
    ):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_CHILD_LOCK,
            {"enabled": True},
            blocking=True,
        )


async def test_filter_reset_service_no_targets_raises(
    hass: HomeAssistant,
) -> None:
    """Test filter reset service raises if no targets are provided."""
    await async_setup_services(hass)

    with (
        patch(
            "custom_components.philips_airpurifier.services._extract_selected_entities",
            new=MagicMock(return_value=SelectedEntities()),
        ),
        pytest.raises(ServiceValidationError, match="No target entities provided"),
    ):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_FILTER_RESET,
            {"filter_type": "all"},
            blocking=True,
        )


async def test_set_child_lock_service_no_targets_raises(
    hass: HomeAssistant,
) -> None:
    """Test child lock service raises if no targets are provided."""
    await async_setup_services(hass)

    with (
        patch(
            "custom_components.philips_airpurifier.services._extract_selected_entities",
            new=MagicMock(return_value=SelectedEntities()),
        ),
        pytest.raises(ServiceValidationError, match="No target entities provided"),
    ):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_CHILD_LOCK,
            {"enabled": True},
            blocking=True,
        )


async def test_get_coordinator_from_entity_wrong_domain(
    hass: HomeAssistant,
) -> None:
    """Test coordinator lookup returns None for entities from different domains."""
    entry = MockConfigEntry(domain="light", title="Other", data={}, unique_id="other-id")
    entry.add_to_hass(hass)

    entity_registry = er.async_get(hass)
    entity_registry.async_get_or_create(
        "light",
        "light",
        "uid-1",
        suggested_object_id="other_light",
        config_entry=entry,
    )

    assert _get_coordinator_from_entity_id(hass, "light.other_light") is None


async def test_set_child_lock_device_target_sends_once(
    hass: HomeAssistant,
    init_integration: MockConfigEntry,
) -> None:
    """Test a device target expanding to many entities sends the command once."""
    await async_setup_services(hass)
    device_registry = dr.async_get(hass)
    device = dr.async_entries_for_config_entry(device_registry, init_integration.entry_id)[0]
    assert len(er.async_entries_for_device(er.async_get(hass), device.id)) > 1

    with patch.object(init_integration.runtime_data, "async_set_control_value", new=AsyncMock()) as set_mock:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_CHILD_LOCK,
            {"enabled": True},
            target={"device_id": device.id},
            blocking=True,
        )

    set_mock.assert_awaited_once_with(PhilipsApi.CHILD_LOCK, True)


async def test_area_target_skips_unrelated_entities(
    hass: HomeAssistant,
    init_integration: MockConfigEntry,
) -> None:
    """Test entities of other integrations pulled in by an area are skipped."""
    await async_setup_services(hass)
    area = ar.async_get(hass).async_create("Office")
    device_registry = dr.async_get(hass)
    device = dr.async_entries_for_config_entry(device_registry, init_integration.entry_id)[0]
    device_registry.async_update_device(device.id, area_id=area.id)
    entity_registry = er.async_get(hass)
    other = entity_registry.async_get_or_create("light", "demo", "unrelated-light", original_name="Lamp")
    entity_registry.async_update_entity(other.entity_id, area_id=area.id)

    with patch.object(init_integration.runtime_data, "async_set_control_value", new=AsyncMock()) as set_mock:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_CHILD_LOCK,
            {"enabled": False},
            target={"area_id": area.id},
            blocking=True,
        )

    set_mock.assert_awaited_once_with(PhilipsApi.CHILD_LOCK, False)


async def test_direct_invalid_target_raises_before_any_command(
    hass: HomeAssistant,
    init_integration: MockConfigEntry,
) -> None:
    """Test an invalid directly named entity fails the call before any device write."""
    await async_setup_services(hass)
    other = er.async_get(hass).async_get_or_create("light", "demo", "unrelated-light")

    with (
        patch.object(init_integration.runtime_data, "async_set_control_value", new=AsyncMock()) as set_mock,
        pytest.raises(ServiceValidationError, match="Invalid target entity"),
    ):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_CHILD_LOCK,
            {"enabled": True},
            target={"entity_id": [_get_fan_entity_id(hass, init_integration), other.entity_id]},
            blocking=True,
        )

    set_mock.assert_not_awaited()


async def test_set_child_lock_all_target_reaches_every_purifier(
    hass: HomeAssistant,
    init_integration: MockConfigEntry,
) -> None:
    """Test entity_id: all resolves to every loaded purifier."""
    await async_setup_services(hass)

    with patch.object(init_integration.runtime_data, "async_set_control_value", new=AsyncMock()) as set_mock:
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_CHILD_LOCK,
            {"enabled": True},
            target={"entity_id": "all"},
            blocking=True,
        )

    set_mock.assert_awaited_once_with(PhilipsApi.CHILD_LOCK, True)


async def test_all_target_without_loaded_purifiers_raises(hass: HomeAssistant) -> None:
    """Test entity_id: all with no loaded purifier reports no targets."""
    await async_setup_services(hass)

    with pytest.raises(ServiceValidationError, match="No target entities provided"):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_SET_CHILD_LOCK,
            {"enabled": True},
            target={"entity_id": "all"},
            blocking=True,
        )
