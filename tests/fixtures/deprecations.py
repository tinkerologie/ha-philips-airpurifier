"""Catch Home Assistant deprecation reports that name this integration.

Home Assistant does not raise ``DeprecationWarning`` for deprecated usage by
integrations. ``homeassistant.helpers.frame.report_usage`` and the
``homeassistant.helpers.deprecation`` helpers log a warning instead, which a
passing test run would otherwise hide. The handler is installed from
``tests/__init__.py`` so it also sees reports logged while the integration is
imported, before ``tests/conftest.py`` runs.
"""

from __future__ import annotations

import logging
import re

DOMAIN = "philips_airpurifier"

# Matches the frame helper's "Detected that custom integration '<domain>' ...",
# the deprecation helpers' "The deprecated constant X was used from <domain>.",
# and their "custom_components.<domain>.<module>::<Class> provides the deprecated
# <name>, ..." for an entity class that still defines a deprecated attribute.
_REPORT_PATTERN = re.compile(
    rf"Detected that (?:custom )?integration '{DOMAIN}' "
    rf"|The deprecated .+ was \w+ from {DOMAIN}\."
    rf"|custom_components\.{DOMAIN}(?:\.\w+)*::\S+ provides the deprecated "
)


class DeprecationReportHandler(logging.Handler):
    """Collect Home Assistant deprecation reports about this integration."""

    def __init__(self) -> None:
        """Initialize the handler for warnings and above."""
        super().__init__(logging.WARNING)
        self.reports: list[str] = []

    def emit(self, record: logging.LogRecord) -> None:
        """Keep the message when it reports deprecated use by this integration."""
        message = record.getMessage()
        if _REPORT_PATTERN.search(message):
            self.reports.append(f"{record.name}: {message}")

    def pop_reports(self) -> list[str]:
        """Return and forget the reports collected so far."""
        reports, self.reports = self.reports, []
        return reports


HANDLER = DeprecationReportHandler()


def install_deprecation_report_handler() -> None:
    """Attach the handler to the root logger once."""
    root = logging.getLogger()
    if HANDLER not in root.handlers:
        root.addHandler(HANDLER)
