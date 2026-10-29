"""Tests for script/ha_dev_blog.py, the weekly developer blog check."""

from __future__ import annotations

from datetime import UTC, datetime
import importlib.util
import json
from pathlib import Path
import sys
from typing import Any, Self

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
SCRIPT_PATH = REPO_ROOT / "script" / "ha_dev_blog.py"
NOW = datetime(2026, 10, 29, tzinfo=UTC)

FEED = """<?xml version="1.0"?>
<rss version="2.0"><channel>
<item><title>Thing is deprecated</title><link>https://blog/new</link>
<pubDate>Wed, 28 Oct 2026 00:00:00 GMT</pubDate>
<description>&lt;p&gt;The &lt;code&gt;old_api&lt;/code&gt;
goes away.&lt;/p&gt;</description></item>
<item><title>Nice new feature</title><link>https://blog/feature</link>
<pubDate>Mon, 26 Oct 2026 00:00:00 GMT</pubDate><description>New.</description></item>
<item><title>Old news</title><link>https://blog/old</link>
<pubDate>Thu, 01 Oct 2026 00:00:00 GMT</pubDate><description>Old.</description></item>
</channel></rss>"""

DEPRECATION_POST = """<html><nav><code>nav_noise_name</code></nav><article>
<p>Home Assistant 2026.12 deprecates <code>old_api</code> and
<code>OldHelperClass</code>; it will be removed in 2027.6.</p>
<p>Use <code>new_api</code> instead, see <code>unrelated_name</code>.</p>
<pre><code><span class="line">old_api(hass)</span></code></pre>
<ul><li>The <code>None</code> and <code>__init__</code> values no longer apply,
nor does <code>config_entry</code> or <code>abc</code>.</li></ul>
</article></html>"""

FEATURE_POST = """<article><p>You can now use <code>old_api</code> anywhere.</p></article>"""


@pytest.fixture(scope="module")
def blog() -> Any:
    """Load the script as a module."""
    spec = importlib.util.spec_from_file_location("ha_dev_blog", SCRIPT_PATH)
    assert spec is not None
    assert spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


@pytest.fixture
def package(tmp_path: Path) -> Path:
    """A small integration that uses ``old_api`` and ``OldHelperClass``."""
    package = tmp_path / "custom_components" / "philips_airpurifier"
    (package / "__pycache__").mkdir(parents=True)
    (package / "sensor.py").write_text("x = 1\nold_api(hass)\nold_api(other)\n")
    (package / "helpers.py").write_text("class A(OldHelperClass):\n    pass\n")
    (package / "notes.txt").write_text("old_api\n")
    (package / "__pycache__" / "sensor.py").write_text("old_api\n")
    return package


def fake_fetch(pages: dict[str, str]) -> Any:
    def fetch(url: str) -> str:
        return pages[url]

    return fetch


def pages(blog: Any) -> dict[str, str]:
    return {
        blog.FEED_URL: FEED,
        "https://blog/new": DEPRECATION_POST,
        "https://blog/feature": FEATURE_POST,
    }


def test_parse_feed(blog: Any) -> None:
    """Titles, links, UTC dates and plain-text summaries come from the feed."""
    posts = blog.parse_feed(FEED)
    assert [p.title for p in posts] == [
        "Thing is deprecated",
        "Nice new feature",
        "Old news",
    ]
    assert posts[0].link == "https://blog/new"
    assert posts[0].published == "2026-10-28T00:00:00+00:00"
    assert posts[0].summary == "The old_api goes away."


def test_changed_identifiers_only_from_change_paragraphs(blog: Any) -> None:
    """Identifiers next to a deprecation count; examples, prose and noise don't."""
    assert blog.changed_identifiers(DEPRECATION_POST) == {"old_api", "OldHelperClass"}
    assert blog.changed_identifiers(FEATURE_POST) == set()


def test_changed_identifiers_from_lists_and_tables_next_to_an_announcement(blog: Any) -> None:
    """A list or table names what the paragraph right before or after it announces."""
    page = """<article>
<h3>Deprecated helpers</h3>
<p>These helpers are deprecated:</p>
<ul><li><code>async_get_device</code></li></ul>
<h3>Renamed properties</h3>
<p>The properties are renamed to match the other entities.</p>
<table><tr><td><code>target_temperature</code></td><td><code>native_target_temperature</code></td></tr></table>
<p>The old names will be removed in 2027.11.</p>
<p>See <code>some_helper</code> for details.</p>
<h3>New features</h3>
<p>You can also use these:</p>
<ul><li><code>shiny_new_api</code></li></ul>
<p>Nothing else changes.</p>
<ul><li><code>other_new_api</code> no longer needs a config entry.</li><li><code>quiet_api</code></li></ul>
</article>"""
    assert blog.changed_identifiers(page) == {
        "async_get_device",
        "target_temperature",
        "native_target_temperature",
        "other_new_api",
    }


def test_changed_identifiers_without_article(blog: Any) -> None:
    """A page without an <article> is read whole."""
    page = "<p>The <code>gone_api</code> was removed.</p>"
    assert blog.changed_identifiers(page) == {"gone_api"}
    assert blog.announces_change(page)
    assert not blog.announces_change("<p>All good.</p>")


@pytest.mark.parametrize(
    "sentence",
    [
        "The removal of <code>DeviceInfo</code> takes effect in 2027.1.",
        "<code>DeviceInfo</code> is deprecated.",
        "<code>DeviceInfo</code> has been removed.",
        "<code>DeviceInfo</code> no longer accepts a dict.",
    ],
)
def test_change_wording(blog: Any, sentence: str) -> None:
    """Each way a post announces a change is recognized."""
    page = f"<article><p>{sentence}</p></article>"
    assert blog.announces_change(page)
    assert blog.changed_identifiers(page) == {"DeviceInfo"}


def test_find_usages(blog: Any, package: Path) -> None:
    """Whole-word matches in source files, capped, with repository paths."""
    usages = blog.find_usages({"old_api", "OldHelperClass", "missing_name"}, package)
    assert usages == {
        "OldHelperClass": ["custom_components/philips_airpurifier/helpers.py:1"],
        "old_api": [
            "custom_components/philips_airpurifier/sensor.py:2",
            "custom_components/philips_airpurifier/sensor.py:3",
        ],
    }
    assert blog.find_usages([], package) == {}


def test_find_usages_caps_locations(blog: Any, package: Path) -> None:
    """At most MAX_LOCATIONS places are listed per identifier."""
    (package / "many.py").write_text("old_api\n" * 10)
    assert len(blog.find_usages({"old_api"}, package)["old_api"]) == blog.MAX_LOCATIONS


def test_recent_posts(blog: Any, package: Path) -> None:
    """Only posts in the window are read; a deprecation of used code is actionable."""
    posts = blog.recent_posts(days=8, now=NOW, package_dir=package, fetch=fake_fetch(pages(blog)))
    assert [p.link for p in posts] == ["https://blog/new", "https://blog/feature"]
    deprecation, feature = posts
    assert deprecation.actionable
    assert set(deprecation.matches) == {"old_api", "OldHelperClass"}
    assert not feature.announces_change
    assert not feature.actionable


def test_render_summary(blog: Any, package: Path) -> None:
    """The summary marks the posts that get an issue."""
    posts = blog.recent_posts(days=8, now=NOW, package_dir=package, fetch=fake_fetch(pages(blog)))
    summary = blog.render_summary(posts, 8)
    assert "[Thing is deprecated](https://blog/new) **(issue)** | yes |" in summary
    assert "[Nice new feature](https://blog/feature) | no | none |" in summary
    assert "No new posts." in blog.render_summary([], 8)


def test_render_issue(blog: Any, package: Path) -> None:
    """The issue links the post and lists where the integration is affected."""
    post = blog.recent_posts(days=8, now=NOW, package_dir=package, fetch=fake_fetch(pages(blog)))[0]
    body = blog.render_issue(post)
    assert "**[Thing is deprecated](https://blog/new)**" in body
    assert "> The old_api goes away." in body
    assert "- `old_api`: `custom_components/philips_airpurifier/sensor.py:2`" in body
    post.summary = ""
    assert "> " not in blog.render_issue(post)


def test_main_writes_report_and_summary(blog: Any, tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """The CLI writes the JSON report and appends the job summary."""
    monkeypatch.setattr(blog, "datetime", _FrozenDatetime)
    report = tmp_path / "report.json"
    summary = tmp_path / "summary.md"
    summary.write_text("before\n")
    result = blog.main(
        ["--days", "8", "--json", str(report), "--summary", str(summary)],
        fetch=fake_fetch(pages(blog)),
    )
    assert result == 0
    data = json.loads(report.read_text())
    assert [entry["link"] for entry in data] == [
        "https://blog/new",
        "https://blog/feature",
    ]
    assert all({"actionable", "issue", "matches"} <= entry.keys() for entry in data)
    assert summary.read_text().startswith("before\n## Home Assistant developer blog")


def test_main_without_outputs(blog: Any, monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]) -> None:
    """Without --json or --summary the summary is only printed."""
    monkeypatch.setattr(blog, "datetime", _FrozenDatetime)
    assert blog.main(["--days", "1"], fetch=fake_fetch(pages(blog))) == 0
    assert "Thing is deprecated" in capsys.readouterr().out


def test_unreachable_post_is_reported_and_the_rest_still_read(
    blog: Any,
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    capsys: pytest.CaptureFixture[str],
) -> None:
    """A failed post fetch keeps the other posts and fails after writing outputs."""
    monkeypatch.setattr(blog, "datetime", _FrozenDatetime)
    available = pages(blog)

    def fetch(url: str) -> str:
        if url == "https://blog/feature":
            message = "timed out"
            raise TimeoutError(message)
        return available[url]

    report = tmp_path / "report.json"
    summary = tmp_path / "summary.md"
    result = blog.main(["--json", str(report), "--summary", str(summary)], fetch=fetch)

    assert result == 1
    data = {entry["link"]: entry for entry in json.loads(report.read_text())}
    assert data["https://blog/new"]["announces_change"]
    assert data["https://blog/new"]["error"] is None
    assert data["https://blog/feature"]["error"] == "TimeoutError: timed out"
    assert not data["https://blog/feature"]["actionable"]
    assert "fetch failed: TimeoutError: timed out" in summary.read_text()
    assert "Could not read https://blog/feature" in capsys.readouterr().err


def test_fetch_url_sends_user_agent(blog: Any, monkeypatch: pytest.MonkeyPatch) -> None:
    """Requests identify the watcher and decode the body as text."""
    seen: dict[str, Any] = {}

    class Response:
        def __enter__(self) -> Self:
            return self

        def __exit__(self, *args: object) -> None:
            return None

        def read(self) -> bytes:
            return "café".encode()

    def urlopen(request: Any, timeout: int) -> Response:
        seen["agent"] = request.get_header("User-agent")
        seen["timeout"] = timeout
        return Response()

    monkeypatch.setattr(blog.urllib.request, "urlopen", urlopen)
    assert blog.fetch_url("https://example.invalid/") == "café"
    assert seen == {"agent": blog.USER_AGENT, "timeout": 30}


class _FrozenDatetime(datetime):
    @classmethod
    def now(cls, tz: Any = None) -> datetime:
        return NOW
