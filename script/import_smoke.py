#!/usr/bin/env python3
"""Import every integration module and fail on deprecated use.

Run it against a Home Assistant release the tests cannot use yet, such as a beta
without a matching pytest-homeassistant-custom-component. It fails when a module
cannot be imported, when a ``DeprecationWarning`` or ``PendingDeprecationWarning``
is attributed to the integration, or when Home Assistant logs a deprecation
report that names the integration.

Usage: python script/import_smoke.py
"""

from __future__ import annotations

import importlib
import logging
import re
import sys
import traceback
import warnings
from pathlib import Path

DOMAIN = "philips_airpurifier"
REPO_ROOT = Path(__file__).resolve().parent.parent
PACKAGE_DIR = REPO_ROOT / "custom_components" / DOMAIN
DEPRECATIONS = (DeprecationWarning, PendingDeprecationWarning)
# Keep in sync with tests/fixtures/deprecations.py.
REPORT_PATTERN = re.compile(
    rf"Detected that (?:custom )?integration '{DOMAIN}' "
    rf"|The deprecated .+ was \w+ from {DOMAIN}\."
    rf"|custom_components\.{DOMAIN}(?:\.\w+)*::\S+ provides the deprecated "
)


class ReportHandler(logging.Handler):
    """Collect Home Assistant deprecation reports about this integration."""

    def __init__(self) -> None:
        """Initialize the handler for warnings and above."""
        super().__init__(logging.WARNING)
        self.reports: list[str] = []

    def emit(self, record: logging.LogRecord) -> None:
        """Keep the message when it reports deprecated use by this integration."""
        message = record.getMessage()
        if REPORT_PATTERN.search(message):
            self.reports.append(f"{record.name}: {message}")


def module_names(package_dir: Path = PACKAGE_DIR) -> list[str]:
    """Return the integration's module names, package first."""
    base = package_dir.parent.parent
    names = []
    for path in sorted(package_dir.rglob("*.py")):
        parts = path.relative_to(base).with_suffix("").parts
        if parts[-1] == "__init__":
            parts = parts[:-1]
        names.append(".".join(parts))
    return sorted(names, key=lambda name: (name.count("."), name))


def is_own_warning(message: warnings.WarningMessage, package_dir: Path) -> bool:
    """Return whether a deprecation warning is attributed to the integration."""
    if not issubclass(message.category, DEPRECATIONS):
        return False
    return Path(message.filename).resolve().is_relative_to(package_dir.resolve())


def run(package_dir: Path = PACKAGE_DIR) -> int:
    """Import every module and print a report; return the exit status."""
    from homeassistant.const import __version__ as ha_version

    sys.path.insert(0, str(package_dir.parent.parent))
    handler = ReportHandler()
    logging.getLogger().addHandler(handler)
    names = module_names(package_dir)
    failures: list[str] = []
    other: list[str] = []
    try:
        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter("always")
            for name in names:
                try:
                    importlib.import_module(name)
                except Exception:
                    failures.append(f"import {name} failed:\n{traceback.format_exc()}")
    finally:
        logging.getLogger().removeHandler(handler)

    for message in caught:
        text = (
            f"{message.category.__name__}: {message.message} "
            f"({message.filename}:{message.lineno})"
        )
        if is_own_warning(message, package_dir):
            failures.append(text)
        elif issubclass(message.category, DEPRECATIONS):
            other.append(text)
    failures.extend(f"Home Assistant report: {report}" for report in handler.reports)

    print(f"Home Assistant {ha_version}: imported {len(names)} modules")
    for text in other:
        print(f"ignored third-party {text}")
    if failures:
        print(f"{len(failures)} problem(s) in {DOMAIN}:")
        for text in failures:
            print(f"- {text}")
        return 1
    print(f"No deprecated use by {DOMAIN} found")
    return 0


if __name__ == "__main__":
    sys.exit(run())
