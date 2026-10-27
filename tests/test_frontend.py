"""Tests for packaged dashboard card delivery."""

from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from custom_components.philips_airpurifier.const import FRONTEND_FILENAME, FRONTEND_URL_BASE
from custom_components.philips_airpurifier.frontend import FRONTEND_PATH, _bundle_digest, async_register_frontend
from homeassistant.core import HomeAssistant


async def test_frontend_registers_static_path_and_versioned_module(hass: HomeAssistant) -> None:
    """Serve only the packaged static directory and include rebuild cache busting."""
    register = AsyncMock()
    hass.http = SimpleNamespace(async_register_static_paths=register)
    with (
        patch(
            "custom_components.philips_airpurifier.frontend.async_get_integration",
            return_value=SimpleNamespace(version="2026.10.2"),
        ),
        patch("custom_components.philips_airpurifier.frontend.add_extra_js_url") as add_url,
    ):
        await async_register_frontend(hass)
    path = register.call_args.args[0][0]
    assert path.url_path == FRONTEND_URL_BASE
    assert Path(path.path) == FRONTEND_PATH
    assert path.cache_headers is True
    digest = await hass.async_add_executor_job(_bundle_digest)
    add_url.assert_called_once_with(hass, f"{FRONTEND_URL_BASE}/{FRONTEND_FILENAME}?v=2026.10.2-{digest}")


def test_frontend_bundle_is_packaged() -> None:
    """HACS installations include the prebuilt browser module."""
    bundle = FRONTEND_PATH / FRONTEND_FILENAME
    assert bundle.is_file()
    assert bundle.read_text().endswith("\n")
    assert "philips-airpurifier-purifier-card" in bundle.read_text()


async def test_frontend_not_registered_again_on_entry_reload(hass, init_integration, mock_dashboard_delivery):
    """Config entry reloads must not add duplicate HTTP routes."""
    assert mock_dashboard_delivery.await_count == 1
    await hass.config_entries.async_reload(init_integration.entry_id)
    await hass.async_block_till_done()
    assert mock_dashboard_delivery.await_count == 1


async def test_missing_bundle_does_not_block_integration(hass: HomeAssistant) -> None:
    """A partial install may lose cards while purifier controls remain usable."""
    with (
        patch("custom_components.philips_airpurifier.frontend.async_get_integration"),
        patch("custom_components.philips_airpurifier.frontend._bundle_digest", side_effect=FileNotFoundError),
        patch("custom_components.philips_airpurifier.frontend.add_extra_js_url") as add_url,
    ):
        await async_register_frontend(hass)
    add_url.assert_not_called()
