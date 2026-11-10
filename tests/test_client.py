"""Tests for the CoAP client helpers."""

from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator
import os
from typing import Any
from unittest.mock import AsyncMock, MagicMock, call, patch
import warnings

import pytest

from custom_components.philips_airpurifier.client import (
    async_fetch_device_info,
    async_fetch_status_with_nudge,
)

_CLIENT = "custom_components.philips_airpurifier.client"


async def _aiter(items: list[Any]) -> AsyncIterator[Any]:
    """Yield the given items as an async iterator."""
    for item in items:
        yield item


async def _aiter_raises(exc: Exception) -> AsyncIterator[Any]:
    """Raise the given exception on first iteration (after yielding nothing)."""
    if False:  # pragma: no cover - makes this a generator without yielding
        yield None
    raise exc


async def test_async_fetch_device_info_returns_library_info() -> None:
    """Device info comes from CoAPClient.get_device_info with sync disabled."""
    info = {"modelid": "CX7550/01", "name": "Büro", "device_id": "abc"}
    client = MagicMock()
    client.get_device_info = AsyncMock(return_value=info)
    client.shutdown = AsyncMock()
    create = AsyncMock(return_value=client)

    result = await async_fetch_device_info("1.2.3.4", create_client=create)

    assert result == info
    create.assert_awaited_once_with("1.2.3.4", sync=False)
    client.shutdown.assert_awaited()


async def test_async_fetch_device_info_shuts_down_on_read_error() -> None:
    """A failing get_device_info still shuts the client down and propagates."""
    client = MagicMock()
    client.get_device_info = AsyncMock(side_effect=RuntimeError("read rejected"))
    client.shutdown = AsyncMock()
    create = AsyncMock(return_value=client)

    with pytest.raises(RuntimeError, match="read rejected"):
        await async_fetch_device_info("1.2.3.4", create_client=create)

    client.shutdown.assert_awaited()


async def test_async_fetch_device_info_propagates_create_failure() -> None:
    """A failing client creation propagates and no client is created to shut down."""
    create = AsyncMock(side_effect=TimeoutError("connect timed out"))

    with pytest.raises(TimeoutError, match="connect timed out"):
        await async_fetch_device_info("1.2.3.4", create_client=create)

    create.assert_awaited_once_with("1.2.3.4", sync=False)


async def test_async_fetch_status_with_nudge_success() -> None:
    """Test the observe-plus-nudge fetch returns the first pushed status."""
    status = {"D01S05": "CX7550/01", "D03102": 1}
    client = MagicMock()
    client.observe_status = MagicMock(return_value=_aiter([status]))
    client.set_control_value = AsyncMock()
    client.shutdown = AsyncMock()

    with (
        patch(f"{_CLIENT}.async_create_client", AsyncMock(return_value=client)),
        patch(f"{_CLIENT}._NUDGE_REGISTER_DELAY", 0),
    ):
        result = await async_fetch_status_with_nudge("1.2.3.4", [("D03105", 0), ("D03105", 115)])

    assert result == status
    client.set_control_value.assert_awaited()
    client.shutdown.assert_awaited()


async def test_async_fetch_status_with_nudge_timeout() -> None:
    """Test the nudge fetch raises a descriptive TimeoutError when no push arrives."""
    client = MagicMock()
    client.observe_status = MagicMock(return_value=_aiter([]))
    client.set_control_value = AsyncMock()
    client.shutdown = AsyncMock()

    with (
        patch(f"{_CLIENT}.async_create_client", AsyncMock(return_value=client)),
        patch(f"{_CLIENT}._NUDGE_REGISTER_DELAY", 0),
        patch(f"{_CLIENT}._NUDGE_WAIT_TIMEOUT", 0.01),
        pytest.raises(TimeoutError, match="no status push from 1.2.3.4"),
    ):
        await async_fetch_status_with_nudge("1.2.3.4", [("D03105", 0)])

    client.shutdown.assert_awaited()


async def test_async_fetch_status_with_nudge_write_failure_is_logged() -> None:
    """A failing control write is swallowed; a later push still succeeds."""
    status = {"D01S05": "CX7550/01"}
    client = MagicMock()
    client.observe_status = MagicMock(return_value=_aiter([status]))
    client.set_control_value = AsyncMock(side_effect=RuntimeError("write rejected"))
    client.shutdown = AsyncMock()

    with (
        patch(f"{_CLIENT}.async_create_client", AsyncMock(return_value=client)),
        patch(f"{_CLIENT}._NUDGE_REGISTER_DELAY", 0),
    ):
        result = await async_fetch_status_with_nudge("1.2.3.4", [("D03105", 0)])

    assert result == status
    client.set_control_value.assert_awaited()
    client.shutdown.assert_awaited()


async def test_async_fetch_status_with_nudge_observe_error_is_logged() -> None:
    """An observe-stream error is swallowed and surfaces as a nudge timeout."""
    client = MagicMock()
    client.observe_status = MagicMock(return_value=_aiter_raises(RuntimeError("stream died")))
    client.set_control_value = AsyncMock()
    client.shutdown = AsyncMock()

    with (
        patch(f"{_CLIENT}.async_create_client", AsyncMock(return_value=client)),
        patch(f"{_CLIENT}._NUDGE_REGISTER_DELAY", 0),
        patch(f"{_CLIENT}._NUDGE_WAIT_TIMEOUT", 0.01),
        pytest.raises(TimeoutError, match="no status push from 1.2.3.4"),
    ):
        await async_fetch_status_with_nudge("1.2.3.4", [("D03105", 0)])

    client.shutdown.assert_awaited()


@pytest.mark.unit
@pytest.mark.parametrize("resting_result", [True, False, None, RuntimeError("resting write failed")])
async def test_nudge_snapshot_uses_only_the_acknowledged_resting_value(
    resting_result: bool | None | Exception,
) -> None:
    """Publish an acknowledged restoration under the bare key without mutating the push."""
    status = {"D03105": 0, "D03102": 1}
    client = MagicMock()
    client.observe_status.return_value = _aiter([status])
    client.set_control_value = AsyncMock(side_effect=[True, resting_result])
    client.shutdown = AsyncMock()

    with patch(f"{_CLIENT}._NUDGE_REGISTER_DELAY", 0):
        result = await async_fetch_status_with_nudge(
            "1.2.3.4", [("D03105#2", 0), ("D03105#2", 115)], create_client=AsyncMock(return_value=client)
        )

    assert result == {"D03105": 115 if resting_result is True else 0, "D03102": 1}
    assert status == {"D03105": 0, "D03102": 1}
    assert client.set_control_value.await_args_list == [call("D03105", 0), call("D03105", 115)]
    client.shutdown.assert_awaited_once()


@pytest.mark.unit
@pytest.mark.parametrize(("stalled_value", "expected"), [(0, 115), (115, 0)])
async def test_nudge_write_timeout_preserves_restoration(
    monkeypatch: pytest.MonkeyPatch, stalled_value: int, expected: int
) -> None:
    """A stalled write neither prevents restoration nor counts as an acknowledgement."""
    import custom_components.philips_airpurifier.client as client_module

    never = asyncio.Event()

    async def write(_key: str, value: int) -> bool:
        if value == stalled_value:
            await never.wait()
        return True

    client = MagicMock()
    client.observe_status.return_value = _aiter([{"D03105": 0}])
    client.set_control_value = AsyncMock(side_effect=write)
    client.shutdown = AsyncMock()
    monkeypatch.setattr(client_module, "_NUDGE_WRITE_TIMEOUT", 0.01, raising=False)
    monkeypatch.setattr(client_module, "_NUDGE_REGISTER_DELAY", 0)

    result = await asyncio.wait_for(
        async_fetch_status_with_nudge(
            "1.2.3.4", [("D03105", 0), ("D03105", 115)], create_client=AsyncMock(return_value=client)
        ),
        timeout=1,
    )

    assert result["D03105"] == expected
    assert client.set_control_value.await_args_list == [call("D03105", 0), call("D03105", 115)]
    client.shutdown.assert_awaited_once()


@pytest.mark.unit
async def test_nudge_exhausts_attempts_when_writes_stall_without_a_push(monkeypatch: pytest.MonkeyPatch) -> None:
    """A lost write cannot wedge setup or keep the temporary client open."""
    import custom_components.philips_airpurifier.client as client_module

    never = asyncio.Event()

    async def write(_key: str, _value: int) -> None:
        await never.wait()

    client = MagicMock()
    client.observe_status.return_value = _aiter([])
    client.set_control_value = AsyncMock(side_effect=write)
    client.shutdown = AsyncMock()
    monkeypatch.setattr(client_module, "_NUDGE_WRITE_TIMEOUT", 0.01, raising=False)
    monkeypatch.setattr(client_module, "_NUDGE_WAIT_TIMEOUT", 0.01)
    monkeypatch.setattr(client_module, "_NUDGE_REGISTER_DELAY", 0)

    with pytest.raises(TimeoutError, match="no status push from 1.2.3.4 after 2 nudge attempts"):
        await asyncio.wait_for(
            async_fetch_status_with_nudge(
                "1.2.3.4", [("D03105", 0), ("D03105", 115)], create_client=AsyncMock(return_value=client)
            ),
            timeout=1,
        )

    assert client.set_control_value.await_args_list == [call("D03105", 0), call("D03105", 115)] * 2
    client.shutdown.assert_awaited_once()


@pytest.mark.unit
async def test_nudge_does_not_reuse_an_earlier_restoration_acknowledgement() -> None:
    """A failed restoration on the successful attempt leaves the snapshot as observed."""
    push_ready = asyncio.Event()
    writes = 0

    async def observe() -> AsyncIterator[dict[str, int]]:
        await push_ready.wait()
        yield {"D03105": 0}

    async def write(_key: str, _value: int) -> bool:
        nonlocal writes
        writes += 1
        if writes == 4:
            push_ready.set()
            return False
        return True

    client = MagicMock()
    client.observe_status.return_value = observe()
    client.set_control_value = AsyncMock(side_effect=write)
    client.shutdown = AsyncMock()

    with patch(f"{_CLIENT}._NUDGE_REGISTER_DELAY", 0), patch(f"{_CLIENT}._NUDGE_WAIT_TIMEOUT", 0.01):
        result = await async_fetch_status_with_nudge(
            "1.2.3.4", [("D03105", 0), ("D03105", 115)], create_client=AsyncMock(return_value=client)
        )

    assert result == {"D03105": 0}
    assert writes == 4


@pytest.fixture(autouse=True)
def _reset_aiocoap_env(monkeypatch: pytest.MonkeyPatch) -> None:
    """Reset aiocoap transport env readiness and environment variable."""
    import custom_components.philips_airpurifier.client as client_module

    monkeypatch.setattr(client_module, "_aiocoap_transport_env_ready", False)
    monkeypatch.delenv("AIOCOAP_CLIENT_TRANSPORT", raising=False)


async def test_async_prepare_aiocoap_client_transport_env_preloads_tinydtls_suppressing_warning(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Test that aiocoap transport preparation preloads tinydtls and suppresses the SyntaxWarning."""
    import custom_components.philips_airpurifier.client as client_module

    monkeypatch.setattr(
        client_module,
        "_resolve_aiocoap_client_transport_env",
        lambda: "tinydtls:oscore:udp6",
    )

    def _mock_import(name: str) -> None:
        if name == "aiocoap.transports.tinydtls":
            warnings.warn_explicit(
                "'return' in a 'finally' block",
                category=SyntaxWarning,
                filename="tinydtls.py",
                lineno=228,
                module="aiocoap.transports.tinydtls",
            )

    monkeypatch.setattr(client_module.importlib, "import_module", _mock_import)

    with warnings.catch_warnings(record=True) as recorded:
        warnings.simplefilter("always")
        await client_module._async_prepare_aiocoap_client_transport_env()

    assert not any(issubclass(w.category, SyntaxWarning) for w in recorded)
    assert os.environ.get("AIOCOAP_CLIENT_TRANSPORT") == "tinydtls:oscore:udp6"
    assert client_module._aiocoap_transport_env_ready is True


async def test_async_prepare_aiocoap_client_transport_env_without_tinydtls(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Test that transports without tinydtls do not trigger a preload import."""
    import custom_components.philips_airpurifier.client as client_module

    monkeypatch.setattr(
        client_module,
        "_resolve_aiocoap_client_transport_env",
        lambda: "oscore:udp6",
    )
    imported: list[str] = []
    monkeypatch.setattr(client_module.importlib, "import_module", imported.append)

    await client_module._async_prepare_aiocoap_client_transport_env()

    assert imported == []
    assert os.environ.get("AIOCOAP_CLIENT_TRANSPORT") == "oscore:udp6"
    assert client_module._aiocoap_transport_env_ready is True


async def test_async_prepare_aiocoap_client_transport_env_preserves_existing_override(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Test that an existing AIOCOAP_CLIENT_TRANSPORT is preserved and preloaded if needed."""
    import custom_components.philips_airpurifier.client as client_module

    monkeypatch.setenv("AIOCOAP_CLIENT_TRANSPORT", "tinydtls:custom")
    resolver_called = False

    def _resolver() -> str | None:
        nonlocal resolver_called
        resolver_called = True
        return "different"

    monkeypatch.setattr(client_module, "_resolve_aiocoap_client_transport_env", _resolver)
    imported: list[str] = []
    monkeypatch.setattr(client_module.importlib, "import_module", imported.append)

    await client_module._async_prepare_aiocoap_client_transport_env()

    assert not resolver_called
    assert os.environ.get("AIOCOAP_CLIENT_TRANSPORT") == "tinydtls:custom"
    assert "aiocoap.transports.tinydtls" in imported
    assert client_module._aiocoap_transport_env_ready is True


async def test_async_prepare_aiocoap_client_transport_env_handles_import_error(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Test that import failures during preload do not prevent readiness."""
    import custom_components.philips_airpurifier.client as client_module

    monkeypatch.setattr(
        client_module,
        "_resolve_aiocoap_client_transport_env",
        lambda: "tinydtls:udp6",
    )

    def _raising_import(name: str) -> None:
        raise ImportError("No module named tinydtls")

    monkeypatch.setattr(client_module.importlib, "import_module", _raising_import)

    await client_module._async_prepare_aiocoap_client_transport_env()

    assert os.environ.get("AIOCOAP_CLIENT_TRANSPORT") == "tinydtls:udp6"
    assert client_module._aiocoap_transport_env_ready is True


def test_resolve_aiocoap_client_transport_env_empty(monkeypatch: pytest.MonkeyPatch) -> None:
    """Return None when default client transports list is empty."""
    from types import SimpleNamespace

    import custom_components.philips_airpurifier.client as client_module

    dummy_defaults = SimpleNamespace(get_default_clienttransports=lambda **kw: [])
    monkeypatch.setattr("aiocoap.defaults", dummy_defaults, raising=False)
    with patch.dict("sys.modules", {"aiocoap.defaults": dummy_defaults}):
        assert client_module._resolve_aiocoap_client_transport_env() is None


async def test_async_prepare_aiocoap_client_transport_env_concurrent(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Concurrent preparation calls safely hit the double-check lock."""
    import custom_components.philips_airpurifier.client as client_module

    original_worker = client_module._prepare_aiocoap_transports_worker

    def _slow_worker(env: str | None) -> str | None:
        import time

        time.sleep(0.01)
        return original_worker(env)

    monkeypatch.setattr(client_module, "_prepare_aiocoap_transports_worker", _slow_worker)
    monkeypatch.setattr(client_module, "_resolve_aiocoap_client_transport_env", lambda: "oscore:udp6")

    await asyncio.gather(
        client_module._async_prepare_aiocoap_client_transport_env(),
        client_module._async_prepare_aiocoap_client_transport_env(),
    )
    assert client_module._aiocoap_transport_env_ready is True
