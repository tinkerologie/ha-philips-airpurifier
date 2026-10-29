"""Tests for script/import_smoke.py."""

from __future__ import annotations

import importlib.util
import logging
import os
from pathlib import Path
import subprocess
import sys
import types
from typing import TYPE_CHECKING, Any

import pytest

from .fixtures.deprecations import HANDLER as DEPRECATION_REPORTS, DeprecationReportHandler

if TYPE_CHECKING:
    from collections.abc import Generator

SCRIPT_PATH = Path(__file__).resolve().parents[1] / "script" / "import_smoke.py"


@pytest.fixture(scope="module")
def smoke() -> Any:
    """Load the import_smoke script as a module."""
    spec = importlib.util.spec_from_file_location("import_smoke", SCRIPT_PATH)
    assert spec is not None
    assert spec.loader is not None
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


@pytest.fixture
def fake_root(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Generator[Path]:
    """Return a scratch import root and forget the modules imported from it.

    The other test modules stub ``homeassistant`` in ``sys.modules``, so the
    version the report prints comes from a stand-in here.
    """
    monkeypatch.setattr(sys, "path", list(sys.path))
    ha_const = types.ModuleType("homeassistant.const")
    ha_const.__version__ = "0.0.0"  # type: ignore[attr-defined]
    monkeypatch.setitem(sys.modules, "homeassistant", types.ModuleType("homeassistant"))
    monkeypatch.setitem(sys.modules, "homeassistant.const", ha_const)
    before = set(sys.modules)
    yield tmp_path
    for name in set(sys.modules) - before:
        del sys.modules[name]


def _package(root: Path, files: dict[str, str]) -> Path:
    package_dir = root / "smoke_ns" / "fake_integration"
    for name, source in {"__init__.py": "", **files}.items():
        path = package_dir / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(source)
    (root / "smoke_ns" / "__init__.py").write_text("")
    return package_dir


def test_module_names_lists_the_package_first(smoke: Any) -> None:
    """The real integration is listed package first, then by depth."""
    names = smoke.module_names()

    assert names[0] == "custom_components.philips_airpurifier"
    assert "custom_components.philips_airpurifier.sensor" in names
    assert "custom_components.philips_airpurifier.climate" in names
    depths = [name.count(".") for name in names]
    assert depths == sorted(depths)


def test_real_integration_imports_cleanly_against_home_assistant() -> None:
    """Every module imports against the installed Home Assistant without deprecations.

    The other tests stub ``homeassistant`` in ``sys.modules``, so they never run
    real Home Assistant code. This runs the smoke script in a clean interpreter
    (``-I``: no stubs, no ``PYTHONPATH``, no script directory on ``sys.path``)
    against the Home Assistant this test environment pins.
    """
    env = {key: value for key, value in os.environ.items() if not key.startswith(("PYTHON", "COV_CORE", "COVERAGE"))}
    result = subprocess.run(  # noqa: S603 - fixed interpreter and repository script
        [sys.executable, "-I", str(SCRIPT_PATH)],
        cwd=SCRIPT_PATH.parents[1],
        env=env,
        capture_output=True,
        text=True,
        check=False,
        timeout=300,
    )

    assert result.returncode == 0, result.stdout + result.stderr
    assert "No deprecated use by philips_airpurifier found" in result.stdout


def test_clean_package_passes(smoke: Any, fake_root: Path, capsys: pytest.CaptureFixture[str]) -> None:
    """A package without deprecated use exits 0."""
    package_dir = _package(fake_root, {"ok.py": "VALUE = 1\n"})

    assert smoke.run(package_dir) == 0
    assert "No deprecated use by philips_airpurifier found" in capsys.readouterr().out


def test_deprecations_reports_and_import_errors_fail(
    smoke: Any, fake_root: Path, capsys: pytest.CaptureFixture[str]
) -> None:
    """Own warnings, HA reports and broken imports fail; others are listed."""
    (fake_root / "smoke_third_party.py").write_text(
        "import warnings\nwarnings.warn('library internals', DeprecationWarning, stacklevel=1)\n"
    )
    package_dir = _package(
        fake_root,
        {
            "own.py": (
                "import warnings\n"
                "import smoke_third_party\n"
                "warnings.warn('own use', DeprecationWarning, stacklevel=1)\n"
                "warnings.warn('not a deprecation', UserWarning, stacklevel=1)\n"
            ),
            "reported.py": (
                "import logging\n"
                "logging.getLogger('homeassistant.helpers.frame').warning(\n"
                "    \"Detected that custom integration 'philips_airpurifier' uses X\"\n"
                ")\n"
            ),
            "broken.py": "from smoke_missing import thing\n",
        },
    )

    try:
        assert smoke.run(package_dir) == 1
    finally:
        DEPRECATION_REPORTS.pop_reports()

    out = capsys.readouterr().out
    assert "3 problem(s) in philips_airpurifier" in out
    assert "DeprecationWarning: own use" in out
    assert "Home Assistant report: homeassistant.helpers.frame" in out
    assert "import smoke_ns.fake_integration.broken failed" in out
    assert "ignored third-party DeprecationWarning: library internals" in out
    assert "not a deprecation" not in out


REPORTS = {
    "frame helper": "Detected that custom integration 'philips_airpurifier' uses X",
    "deprecated constant": "The deprecated constant X was used from philips_airpurifier.",
    "deprecated entity attribute": (
        "custom_components.philips_airpurifier.sensor::PhilipsAirPurifierSensor provides "
        "the deprecated temperature_unit, this will stop working in Home Assistant "
        "2027.11, use native_temperature_unit instead, please report it"
    ),
}
NOT_REPORTS = {
    "other integration": "Detected that custom integration 'other' uses X",
    "other entity class": ("custom_components.other.sensor::OtherSensor provides the deprecated x"),
    "domain prefix": ("custom_components.philips_airpurifier_extra.sensor::Extra provides the deprecated x"),
}


def _handlers(smoke: Any) -> list[Any]:
    return [smoke.ReportHandler(), DeprecationReportHandler()]


def _emit(handler: logging.Handler, message: str) -> None:
    handler.emit(
        logging.LogRecord(
            "homeassistant.helpers.deprecation",
            logging.WARNING,
            __file__,
            1,
            message,
            None,
            None,
        )
    )


@pytest.mark.parametrize("message", REPORTS.values(), ids=REPORTS.keys())
def test_report_patterns_match_every_home_assistant_format(smoke: Any, message: str) -> None:
    """The smoke script and the test fixture both keep each report format."""
    for handler in _handlers(smoke):
        _emit(handler, message)
        assert handler.reports == [f"homeassistant.helpers.deprecation: {message}"]


@pytest.mark.parametrize("message", NOT_REPORTS.values(), ids=NOT_REPORTS.keys())
def test_report_patterns_ignore_other_integrations(smoke: Any, message: str) -> None:
    """Reports about another integration are not attributed to this one."""
    for handler in _handlers(smoke):
        _emit(handler, message)
        assert handler.reports == []
