"""Tests for script/build_release_zip.py, the HACS/Marketplace release asset."""

from __future__ import annotations

import hashlib
import importlib.util
import json
import os
from pathlib import Path
import stat
import subprocess
import sys
from typing import Any
import zipfile

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
SCRIPT_PATH = REPO_ROOT / "script" / "build_release_zip.py"
PACKAGE_DIR = REPO_ROOT / "custom_components" / "philips_airpurifier"


@pytest.fixture(scope="module")
def release_zip() -> Any:
    """Load the build script as a module."""
    spec = importlib.util.spec_from_file_location("build_release_zip", SCRIPT_PATH)
    assert spec is not None
    assert spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def _git(cwd: Path, *args: str) -> str:
    return subprocess.run(  # noqa: S603 - fixed Git executable and fixture arguments
        ["git", "-c", "commit.gpgsign=false", *args],  # noqa: S607
        cwd=cwd,
        check=True,
        capture_output=True,
        text=True,
    ).stdout


def _expected_files(package_dir: Path) -> list[str]:
    """List the tracked package files independently of the script."""
    tracked = _git(package_dir, "ls-files", ".").splitlines()
    return sorted(n for n in tracked if not any(p.startswith(".") for p in n.split("/")))


def _fake_package(root: Path, version: str = "2026.10.4", files: dict[str, str] | None = None) -> Path:
    """Create a committed package, plus untracked leftovers the zip must skip."""
    package = root / "repo with spaces" / "philips_airpurifier"
    tracked = {
        "manifest.json": json.dumps({"version": version}),
        "__init__.py": '"""Init."""\n',
        "translations/en.json": "{}",
        "client.py": '"""Client."""\n',
        "frontend.py": '"""Frontend."""\n',
        "frontend/philips-airpurifier-cards.js": 'import{a}from"./chunks/shared.js";import"./other.js";',
        "frontend/other.js": 'const m=import("../frontend/chunks/shared.js");',
        "frontend/chunks/shared.js": "export const a=1;",
        "brand/icon.png": "png",
        **(files or {}),
    }
    for name, content in tracked.items():
        path = package / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)
    _git(package.parent, "init", "-q")
    _git(package.parent, "add", "--force", ".")
    (package / "__pycache__").mkdir()
    (package / "__pycache__" / "__init__.cpython-314.pyc").write_bytes(b"\0")
    (package / "stale.pyc").write_bytes(b"\0")
    (package / ".DS_Store").write_bytes(b"\0")
    (package / "untracked.py").write_text("")
    return package


def test_real_package_zip_layout(release_zip: Any, tmp_path: Path) -> None:
    """The zip holds the package contents at its root, minus build leftovers."""
    zip_path = release_zip.build_release(tmp_path, environ={})
    with zipfile.ZipFile(zip_path) as archive:
        names = archive.namelist()
        infos = archive.infolist()
        assert archive.testzip() is None

    assert "manifest.json" in names
    assert names == sorted(names)
    assert names == _expected_files(PACKAGE_DIR)
    for required in (
        "__init__.py",
        "client.py",
        "coordinator.py",
        "climate.py",
        "frontend.py",
        "sensor.py",
        "strings.json",
        "icons.json",
        "quality_scale.yaml",
        "translations/en.json",
        "brand/icon.png",
        "frontend/philips-airpurifier-cards.js",
    ):
        assert required in names
    for prefix in ("brand/", "translations/", "frontend/"):
        assert any(n.startswith(prefix) for n in names), prefix
    assert not [n for n in names if "__pycache__" in n or n.endswith(".pyc")]
    assert not [n for n in names if n.startswith("custom_components/")]
    for info in infos:
        assert info.date_time == (1980, 1, 1, 0, 0, 0)
        assert info.compress_type == zipfile.ZIP_DEFLATED
        assert stat.S_IMODE(info.external_attr >> 16) == 0o644


def test_builds_are_byte_identical(release_zip: Any, tmp_path: Path) -> None:
    """Two builds with the same SOURCE_DATE_EPOCH produce the same bytes."""
    environ = {"SOURCE_DATE_EPOCH": "1761700000"}
    first = release_zip.build_release(tmp_path / "a", environ=environ)
    second = release_zip.build_release(tmp_path / "b", environ=environ)
    assert first.read_bytes() == second.read_bytes()
    checksums = (tmp_path / "a" / "SHA256SUMS").read_text()
    digest = hashlib.sha256(first.read_bytes()).hexdigest()
    assert checksums == f"{digest}  philips_airpurifier.zip\n"
    assert checksums == (tmp_path / "b" / "SHA256SUMS").read_text()
    with zipfile.ZipFile(first) as archive:
        assert archive.infolist()[0].date_time == (2025, 10, 29, 1, 6, 40)


def test_hacs_json_names_the_release_zip(release_zip: Any) -> None:
    """HACS and the Marketplace download the asset hacs.json names."""
    hacs = json.loads((REPO_ROOT / "hacs.json").read_text())
    assert hacs["zip_release"] is True
    assert hacs["filename"] == release_zip.ZIP_NAME


def test_only_tracked_files_are_packaged(release_zip: Any, tmp_path: Path) -> None:
    """Untracked files, bytecode, caches and hidden files never reach the zip."""
    package = _fake_package(tmp_path)
    zip_path = release_zip.build_release(tmp_path / "out", package_dir=package, version="v2026.10.4", environ={})
    with zipfile.ZipFile(zip_path) as archive:
        assert archive.namelist() == [
            "__init__.py",
            "brand/icon.png",
            "client.py",
            "frontend.py",
            "frontend/chunks/shared.js",
            "frontend/other.js",
            "frontend/philips-airpurifier-cards.js",
            "manifest.json",
            "translations/en.json",
        ]


def test_mtimes_do_not_change_the_zip(release_zip: Any, tmp_path: Path) -> None:
    """Checkout times differ between machines; the zip must not."""
    package = _fake_package(tmp_path)
    first = release_zip.build_release(tmp_path / "a", package_dir=package, environ={})
    os.utime(package / "__init__.py", (2_000_000_000, 2_000_000_000))
    second = release_zip.build_release(tmp_path / "b", package_dir=package, environ={})
    assert first.read_bytes() == second.read_bytes()


@pytest.mark.parametrize(
    "required",
    [
        "manifest.json",
        "__init__.py",
        "translations/en.json",
        "client.py",
        "frontend.py",
        "frontend/philips-airpurifier-cards.js",
    ],
)
def test_missing_required_file_fails(release_zip: Any, tmp_path: Path, required: str) -> None:
    """The files the integration needs to load must be in the zip."""
    package = _fake_package(tmp_path)
    _git(package, "rm", "-q", "--cached", required)
    with pytest.raises(release_zip.ReleaseZipError, match=f"{required} is missing"):
        release_zip.build_release(tmp_path / "out", package_dir=package, environ={})
    assert not (tmp_path / "out").exists()


@pytest.mark.parametrize(
    "source",
    [
        'import{a}from"./chunks/missing-X1.js";',
        'import"../frontend/gone.js";',
        'const m=import( "./lazy.js" );',
    ],
)
def test_unresolved_frontend_import_fails(release_zip: Any, tmp_path: Path, source: str) -> None:
    """A card whose chunk did not ship would fail to load in the browser."""
    package = _fake_package(tmp_path, files={"frontend/broken.js": source})
    with pytest.raises(release_zip.ReleaseZipError, match=r"frontend/broken\.js imports"):
        release_zip.build_release(tmp_path / "out", package_dir=package, environ={})


def test_tracked_bytecode_fails(release_zip: Any, tmp_path: Path) -> None:
    """Bytecode committed by mistake stops the build instead of shipping."""
    package = _fake_package(tmp_path)
    _git(package, "add", "--force", "stale.pyc")
    with pytest.raises(release_zip.ReleaseZipError, match="Bytecode is tracked"):
        release_zip.build_release(tmp_path / "out", package_dir=package, environ={})


def test_tracked_file_missing_from_checkout_fails(release_zip: Any, tmp_path: Path) -> None:
    """A tracked file deleted locally would silently drop out of the zip."""
    package = _fake_package(tmp_path)
    (package / "brand/icon.png").unlink()
    with pytest.raises(release_zip.ReleaseZipError, match="missing from the checkout"):
        release_zip.build_release(tmp_path / "out", package_dir=package, environ={})


def test_outside_git_fails(release_zip: Any, tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """Without Git the tracked file list is unknown, so nothing is built."""
    package = tmp_path / "not a repo"
    package.mkdir()
    (package / "manifest.json").write_text("{}")
    monkeypatch.setenv("GIT_CEILING_DIRECTORIES", str(tmp_path))
    with pytest.raises(release_zip.ReleaseZipError, match="not inside a Git"):
        release_zip.build_release(tmp_path / "out", package_dir=package, environ={})


def test_version_mismatch_fails(release_zip: Any, tmp_path: Path) -> None:
    """A release tag that differs from manifest.json stops the build."""
    package = _fake_package(tmp_path, version="2026.10.4")
    with pytest.raises(release_zip.ReleaseZipError, match="does not match"):
        release_zip.build_release(tmp_path / "out", package_dir=package, version="v1")
    assert not (tmp_path / "out").exists()


@pytest.mark.parametrize(
    ("manifest", "message"),
    [(None, "not found"), ({}, "no version")],
)
def test_bad_manifest(release_zip: Any, tmp_path: Path, manifest: dict[str, str] | None, message: str) -> None:
    """A missing manifest or version is reported."""
    package = tmp_path / "pkg"
    package.mkdir()
    if manifest is not None:
        (package / "manifest.json").write_text(json.dumps(manifest))
    with pytest.raises(release_zip.ReleaseZipError, match=message):
        release_zip.check_version(package, "1")


def test_symlink_rejected(release_zip: Any, tmp_path: Path) -> None:
    """Symbolic links would make the zip depend on the build machine."""
    package = _fake_package(tmp_path)
    (package / "link.py").symlink_to(package / "__init__.py")
    _git(package, "add", "link.py")
    with pytest.raises(release_zip.ReleaseZipError, match="Symbolic links"):
        release_zip.build_release(tmp_path / "out", package_dir=package, environ={})


@pytest.mark.parametrize(
    ("value", "expected"),
    [("", 315532800), ("0", 315532800), ("1761700000", 1761700000)],
)
def test_source_date_epoch(release_zip: Any, value: str, expected: int) -> None:
    """Timestamps come from SOURCE_DATE_EPOCH, clamped to the zip epoch."""
    assert release_zip.source_date_epoch({"SOURCE_DATE_EPOCH": value}) == expected


def test_invalid_source_date_epoch(release_zip: Any) -> None:
    """A malformed SOURCE_DATE_EPOCH is an error, not a silent default."""
    with pytest.raises(release_zip.ReleaseZipError, match="SOURCE_DATE_EPOCH"):
        release_zip.source_date_epoch({"SOURCE_DATE_EPOCH": "yesterday"})


def test_cli(release_zip: Any, tmp_path: Path, capsys: pytest.CaptureFixture[str]) -> None:
    """The command line builds the zip and rejects a mismatched version."""
    manifest = json.loads((PACKAGE_DIR / "manifest.json").read_text())
    version = f"v{manifest['version']}"
    assert release_zip.main(["--output-dir", str(tmp_path), "--version", version]) == 0
    assert "philips_airpurifier.zip (" in capsys.readouterr().out
    assert (tmp_path / "SHA256SUMS").is_file()

    out_dir = str(tmp_path / "x")
    assert release_zip.main(["--output-dir", out_dir, "--version", "0.0.0"]) == 1
    assert "does not match" in capsys.readouterr().err


def test_tracked_hidden_files_are_skipped(release_zip: Any, tmp_path: Path) -> None:
    """Dotfiles stay out of the zip even when Git tracks them."""
    package = _fake_package(tmp_path, files={".gitkeep": "", "brand/.hidden": ""})
    zip_path = release_zip.build_release(tmp_path / "out", package_dir=package, environ={})
    with zipfile.ZipFile(zip_path) as archive:
        assert not [n for n in archive.namelist() if "/." in f"/{n}"]


def test_entries_outside_the_zip_root_fail(release_zip: Any, tmp_path: Path) -> None:
    """A nested custom_components/ folder would not install as an integration."""
    package = _fake_package(tmp_path)
    names = [
        "__init__.py",
        "custom_components/philips_airpurifier/sensor.py",
        "manifest.json",
        "translations/en.json",
        "client.py",
        "frontend.py",
        "frontend/philips-airpurifier-cards.js",
    ]
    with pytest.raises(release_zip.ReleaseZipError, match="not at the zip root"):
        release_zip.check_members(package, names)
