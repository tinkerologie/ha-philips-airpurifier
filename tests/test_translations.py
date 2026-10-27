"""Tests that every locale mirrors the English translation structure."""

from __future__ import annotations

import json
from pathlib import Path
import re
from typing import Any

import pytest

COMPONENT_DIR = Path(__file__).resolve().parent.parent / "custom_components" / "philips_airpurifier"
TRANSLATIONS_DIR = COMPONENT_DIR / "translations"
STRINGS_FILE = COMPONENT_DIR / "strings.json"
ENGLISH_FILE = TRANSLATIONS_DIR / "en.json"

LOCALE_FILES = sorted(path for path in TRANSLATIONS_DIR.glob("*.json") if path.name != ENGLISH_FILE.name)

# Matches runtime placeholders such as {model}; never matches [%key:...%] references.
PLACEHOLDER_PATTERN = re.compile(r"\{([A-Za-z_][A-Za-z0-9_]*)\}")


def _flatten(node: dict[str, Any], prefix: str = "") -> dict[str, str]:
    """Flatten a translation tree into a mapping of dotted leaf path to string value."""
    assert node, f"Empty object at {prefix or '<root>'}"
    leaves: dict[str, str] = {}
    for key, value in node.items():
        path = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            leaves.update(_flatten(value, path))
        else:
            assert isinstance(value, str), f"Non-string leaf at {path}: {value!r}"
            leaves[path] = value
    return leaves


def _load_leaves(path: Path) -> dict[str, str]:
    """Load a translation file and return its flattened leaves."""
    data = json.loads(path.read_text(encoding="utf-8"))
    assert isinstance(data, dict), f"{path.name} must contain a JSON object"
    return _flatten(data)


def _placeholders(value: str) -> set[str]:
    """Return the placeholder names used in a translation string."""
    return set(PLACEHOLDER_PATTERN.findall(value))


def _placeholder_mismatches(reference: dict[str, str], other: dict[str, str]) -> list[str]:
    """Return sorted descriptions of shared leaves whose placeholder sets differ."""
    return sorted(
        f"{path}: expected {sorted(_placeholders(reference[path]))}, got {sorted(_placeholders(other[path]))}"
        for path in reference.keys() & other.keys()
        if _placeholders(reference[path]) != _placeholders(other[path])
    )


@pytest.mark.unit
def test_locales_discovered() -> None:
    """At least one non-English locale is checked."""
    assert LOCALE_FILES


@pytest.mark.unit
@pytest.mark.parametrize("locale_file", LOCALE_FILES, ids=lambda path: path.stem)
def test_locale_matches_english(locale_file: Path) -> None:
    """Each locale has exactly the English keys, string leaves and placeholders."""
    english = _load_leaves(ENGLISH_FILE)
    locale = _load_leaves(locale_file)

    missing = sorted(english.keys() - locale.keys())
    extra = sorted(locale.keys() - english.keys())
    assert not missing, f"{locale_file.name} is missing keys: {missing}"
    assert not extra, f"{locale_file.name} has keys not in en.json: {extra}"

    mismatches = _placeholder_mismatches(english, locale)
    assert not mismatches, f"{locale_file.name} has placeholder mismatches: {mismatches}"


@pytest.mark.unit
def test_strings_matches_english() -> None:
    """strings.json and translations/en.json have the same keys and placeholders."""
    strings = _load_leaves(STRINGS_FILE)
    english = _load_leaves(ENGLISH_FILE)

    missing = sorted(strings.keys() - english.keys())
    extra = sorted(english.keys() - strings.keys())
    assert not missing, f"en.json is missing keys from strings.json: {missing}"
    assert not extra, f"en.json has keys not in strings.json: {extra}"

    mismatches = _placeholder_mismatches(strings, english)
    assert not mismatches, f"en.json has placeholder mismatches with strings.json: {mismatches}"


def test_runtime_entity_metadata_has_names_and_icons() -> None:
    """All model capability descriptions resolve to frontend translation resources."""
    from custom_components.philips_airpurifier.const import (
        BINARY_SENSOR_TYPES,
        FILTER_TYPES,
        LIGHT_TYPES,
        NUMBER_TYPES,
        SELECT_TYPES,
        SENSOR_TYPES,
        SWITCH_TYPES,
        FanAttributes,
    )

    strings = json.loads(STRINGS_FILE.read_text())["entity"]
    icons = json.loads((COMPONENT_DIR / "icons.json").read_text())["entity"]
    descriptions = {
        "sensor": {**SENSOR_TYPES, **FILTER_TYPES},
        "binary_sensor": BINARY_SENSOR_TYPES,
        "light": LIGHT_TYPES,
        "number": NUMBER_TYPES,
        "select": SELECT_TYPES,
        "switch": SWITCH_TYPES,
    }
    for platform, kinds in descriptions.items():
        for description in kinds.values():
            key = description.get("translation_key", description[FanAttributes.LABEL])
            assert key in strings[platform], (platform, key)
            assert key in icons[platform] or description.get("device_class"), (platform, key)


def test_every_model_preset_has_a_name_and_icon() -> None:
    """Picker and state translations cover every supported model's fan presets."""
    from custom_components.philips_airpurifier.device_models import DEVICE_MODELS

    strings = json.loads(STRINGS_FILE.read_text())["entity"]
    icons = json.loads((COMPONENT_DIR / "icons.json").read_text())["entity"]
    names = strings["fan"]["pap"]["state_attributes"]["preset_mode"]["state"]
    pictures = icons["fan"]["pap"]["state_attributes"]["preset_mode"]["state"]
    for model, config in DEVICE_MODELS.items():
        for preset in config.preset_modes:
            assert preset in names, (model, preset)
            assert preset in pictures, (model, preset)
