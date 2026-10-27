"""Serve the packaged dashboard cards without modifying Lovelace resources."""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path
from typing import TYPE_CHECKING

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http.server import StaticPathConfig
from homeassistant.loader import async_get_integration

from .const import DOMAIN, FRONTEND_FILENAME, FRONTEND_URL_BASE

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

FRONTEND_PATH = Path(__file__).parent / "frontend"


def _bundle_digest() -> str:
    """Read the bundle outside the event loop for rebuild cache invalidation."""
    return hashlib.sha256((FRONTEND_PATH / FRONTEND_FILENAME).read_bytes()).hexdigest()[:12]


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Register the card module once during integration setup."""
    integration = await async_get_integration(hass, DOMAIN)
    try:
        digest = await hass.async_add_executor_job(_bundle_digest)
    except OSError:
        _LOGGER.warning("Dashboard card bundle is unreadable; reinstall the integration to restore the cards")
        return
    await hass.http.async_register_static_paths(
        [StaticPathConfig(FRONTEND_URL_BASE, str(FRONTEND_PATH), cache_headers=True)]
    )
    add_extra_js_url(hass, f"{FRONTEND_URL_BASE}/{FRONTEND_FILENAME}?v={integration.version}-{digest}")
