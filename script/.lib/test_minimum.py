"""Check the isolated dependency graph before exercising the minimum HA version."""

from importlib.metadata import version
import subprocess
import sys

import pytest

if version("homeassistant") != "2026.9.0" or version("pytest-homeassistant-custom-component") != "0.13.363":
    raise SystemExit("Minimum compatibility environment does not match the pinned requirements")
subprocess.run(["uv", "pip", "check", "--python", sys.executable], check=True)  # noqa: S603, S607
print("Minimum compatibility environment: Home Assistant", version("homeassistant"), flush=True)
raise SystemExit(
    pytest.main(["tests", "--cov=custom_components/philips_airpurifier", "--cov-report=term-missing", *sys.argv[1:]])
)
