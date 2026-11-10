"""Tests for the HA development and minimum environment contracts."""

from functools import partial
from importlib.metadata import PackageNotFoundError
import json
from pathlib import Path
import runpy
import shutil
import subprocess
from unittest.mock import patch

import pytest

ROOT = Path(__file__).resolve().parents[1]
FLOOR = "2026.9.0"
TARGET = "2026.11.1"
LEGACY = "pytest-homeassistant-custom-component"
OFFICIAL = "pytest-homeassistant"


@pytest.mark.parametrize(
    ("case", "message"),
    [
        ("valid", "HA version sync OK"),
        ("floor", "Minimum test version must equal the HACS support floor"),
        ("lock", "Locked homeassistant must match development HA"),
        ("old_target", "is below supported minimum"),
        ("plugin_lock", "Locked pytest-homeassistant must match development HA"),
        ("plugin_pin", "The development pytest plugin pin must match HA"),
        ("legacy_lock", "The legacy pytest plugin must be absent from the development lock"),
        ("legacy_dev", "Development dependencies must use only the official pytest plugin"),
        ("official_min", "Minimum test requirements must use only the legacy pytest plugin"),
        ("missing_legacy", "Expected one exact pin for pytest-homeassistant-custom-component"),
    ],
)
def test_ha_version_sync(tmp_path: Path, case: str, message: str) -> None:
    """Validate the lock and dev pins separately from the support floor."""
    script_dir = tmp_path / "script"
    (script_dir / ".lib").mkdir(parents=True)
    shutil.copy2(ROOT / "script/ha-version-sync", script_dir)
    shutil.copy2(ROOT / "script/.lib/output.sh", script_dir / ".lib")
    (tmp_path / "hacs.json").write_text(json.dumps({"homeassistant": FLOOR}))

    minimum = [f"homeassistant=={TARGET if case == 'floor' else FLOOR}"]
    if case != "missing_legacy":
        minimum.append(f"{LEGACY}==0.13.363")
    if case == "official_min":
        minimum.append(f"{OFFICIAL}=={TARGET}")
    (tmp_path / "requirements_test_min.txt").write_text("\n".join(minimum))

    target = "2026.8.0" if case == "old_target" else TARGET
    plugin_target = FLOOR if case == "plugin_pin" else target
    dev = [f"homeassistant=={target}", f"{OFFICIAL}=={plugin_target}"]
    if case == "legacy_dev":
        dev.append(LEGACY)
    (tmp_path / "pyproject.toml").write_text(f"[project.optional-dependencies]\ndev = {json.dumps(dev)}\n")
    packages = {
        "homeassistant": FLOOR if case == "lock" else TARGET,
        OFFICIAL: FLOOR if case == "plugin_lock" else TARGET,
    }
    if case == "legacy_lock":
        packages[LEGACY] = "0.13.363"
    (tmp_path / "uv.lock").write_text(
        "\n".join(f'[[package]]\nname = "{name}"\nversion = "{version}"\n' for name, version in packages.items())
    )

    result = subprocess.run([str(script_dir / "ha-version-sync")], capture_output=True, text=True, check=False)  # noqa: S603
    assert result.returncode == (0 if case == "valid" else 1)
    assert message in result.stdout + result.stderr


def _installed_version(installed: dict[str, str], name: str) -> str:
    """Match importlib.metadata.version for missing distributions."""
    try:
        return installed[name]
    except KeyError:
        raise PackageNotFoundError(name) from None


@pytest.mark.parametrize(
    ("installed", "message"),
    [
        ({"homeassistant": TARGET, LEGACY: "0.13.363"}, "does not match the pinned requirements"),
        ({"homeassistant": FLOOR, LEGACY: "0.13.363", OFFICIAL: TARGET}, "contains the official pytest plugin"),
    ],
)
def test_minimum_environment_rejects_mismatched_packages(installed: dict[str, str], message: str) -> None:
    """Stop before pytest starts when the minimum environment is invalid."""
    with (
        patch("importlib.metadata.version", side_effect=partial(_installed_version, installed)),
        pytest.raises(SystemExit, match=message),
    ):
        runpy.run_path(str(ROOT / "script/.lib/test_minimum.py"))


def test_minimum_environment_runs_legacy_suite_without_official_plugin() -> None:
    """Run coverage-enabled tests when the minimum environment is valid."""
    installed = {"homeassistant": FLOOR, LEGACY: "0.13.363"}
    with (
        patch("importlib.metadata.version", side_effect=partial(_installed_version, installed)),
        patch("subprocess.run") as check_dependencies,
        patch("pytest.main", return_value=0) as run_tests,
        pytest.raises(SystemExit) as result,
    ):
        runpy.run_path(str(ROOT / "script/.lib/test_minimum.py"))

    assert result.value.code == 0
    check_dependencies.assert_called_once()
    run_tests.assert_called_once()
    assert "--cov=custom_components/philips_airpurifier" in run_tests.call_args.args[0]
