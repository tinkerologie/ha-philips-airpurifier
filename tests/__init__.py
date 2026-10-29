"""Tests for the Philips AirPurifier integration."""

from .fixtures.deprecations import install_deprecation_report_handler

# Before conftest imports the integration, so import-time reports are caught too.
install_deprecation_report_handler()
