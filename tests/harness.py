"""Test helpers shared by the development and minimum HA environments."""

from importlib.metadata import PackageNotFoundError, version


def _installed(distribution: str) -> bool:
    try:
        version(distribution)
    except PackageNotFoundError:
        return False
    return True


USING_LEGACY_HARNESS = _installed("pytest-homeassistant-custom-component")
if USING_LEGACY_HARNESS and _installed("pytest-homeassistant"):
    raise RuntimeError("Use separate environments for the official and legacy Home Assistant pytest plugins")

if USING_LEGACY_HARNESS:
    from pytest_homeassistant_custom_component.common import MockConfigEntry, mock_component
else:
    from pytest_homeassistant.common import MockConfigEntry, mock_component

__all__ = ["MockConfigEntry", "USING_LEGACY_HARNESS", "mock_component"]
