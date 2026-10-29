#!/usr/bin/env python3
"""Match recent Home Assistant developer blog posts against the integration.

Home Assistant announces developer-facing changes (new APIs, deprecations,
removals) on its developer blog, usually weeks before the beta that ships them.
For each post published in the look-back window, this script finds the paragraphs
and list items that announce a deprecation, removal or breaking change, reads the
inline code they name (``async_get_device``, ``ConfigEntryNotReady``, ...) and
searches the integration for those identifiers.

A post is *actionable* when an identifier named next to such an announcement
appears in the integration.
The weekly workflow opens one issue per actionable post; every other post is
only listed in the job summary.

Usage:
    python3 script/ha_dev_blog.py [--days 8] [--json report.json] [--summary out.md]
"""

from __future__ import annotations

import argparse
import email.utils
import html
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from collections.abc import Callable, Iterable, Sequence
from dataclasses import asdict, dataclass, field
from datetime import UTC, datetime, timedelta
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
PACKAGE_DIR = REPO_ROOT / "custom_components" / "philips_airpurifier"
FEED_URL = "https://developers.home-assistant.io/blog/rss.xml"
USER_AGENT = "ha-philips-airpurifier-dev-blog-watch"
SEARCHED_SUFFIXES = (".py", ".json", ".yaml")
MAX_LOCATIONS = 3

ARTICLE = re.compile(r"<article\b.*?</article>", re.DOTALL | re.IGNORECASE)
BLOCK = re.compile(r"<(p|li|td)\b[^>]*>(.*?)</\1>", re.DOTALL | re.IGNORECASE)
INLINE_CODE = re.compile(r"<code\b[^>]*>(.*?)</code>", re.DOTALL | re.IGNORECASE)
TAG = re.compile(r"<[^>]+>")
TOKEN = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")
ANNOUNCES_CHANGE = re.compile(
    r"\b(deprecat\w*|removed|removal|will be removed|no longer|breaking|"
    r"stops? working|must now)\b",
    re.IGNORECASE,
)
# Identifiers so common in any integration that a match says nothing.
GENERIC = frozenset({"config_entry", "entry_id", "runtime_data", "return_value"})

Fetch = Callable[[str], str]


@dataclass
class Post:
    """One developer blog post and what it shares with the integration."""

    title: str
    link: str
    published: str
    summary: str
    announces_change: bool = False
    matches: dict[str, list[str]] = field(default_factory=dict)
    error: str | None = None

    @property
    def actionable(self) -> bool:
        """Return True when the post changes something the integration uses."""
        return self.announces_change and bool(self.matches)


def fetch_url(url: str) -> str:
    """Return the body of ``url`` as text."""
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})  # noqa: S310 - fixed https URLs
    with urllib.request.urlopen(request, timeout=30) as response:  # noqa: S310
        return response.read().decode("utf-8", errors="replace")


def parse_feed(xml_text: str) -> list[Post]:
    """Return the posts in an RSS 2.0 feed, newest first as the feed lists them."""
    posts = []
    # The fixed developer blog feed over https; Expat resolves no external
    # entities and caps entity expansion.
    for item in ET.fromstring(xml_text).iterfind("./channel/item"):  # noqa: S314
        published = email.utils.parsedate_to_datetime(item.findtext("pubDate") or "")
        posts.append(
            Post(
                title=(item.findtext("title") or "").strip(),
                link=(item.findtext("link") or "").strip(),
                published=published.astimezone(UTC).isoformat(),
                summary=" ".join(
                    html.unescape(
                        TAG.sub("", item.findtext("description") or "")
                    ).split()
                ),
            )
        )
    return posts


def changed_identifiers(page_html: str) -> set[str]:
    """Return the API-like identifiers named next to an announced change.

    Only paragraphs, list items and table cells whose text announces a
    deprecation, removal or breaking change are read, and only their inline
    code: highlighted ``<pre>`` examples are full of boilerplate every
    integration shares. An identifier counts when it has an underscore or is
    CamelCase, which leaves out ``None``, ``True`` and prose.
    """
    article = ARTICLE.search(page_html)
    body = article.group(0) if article else page_html
    found: set[str] = set()
    for _tag, block in BLOCK.findall(body):
        if not ANNOUNCES_CHANGE.search(html.unescape(TAG.sub(" ", block))):
            continue
        for code in INLINE_CODE.findall(block):
            for token in TOKEN.findall(html.unescape(TAG.sub("", code))):
                if token.startswith("__") or token in GENERIC or len(token) < 4:
                    continue
                if "_" in token or sum(char.isupper() for char in token) >= 2:
                    found.add(token)
    return found


def announces_change(page_html: str) -> bool:
    """Return True when the post's text announces a deprecation or removal."""
    article = ARTICLE.search(page_html)
    text = html.unescape(TAG.sub(" ", article.group(0) if article else page_html))
    return ANNOUNCES_CHANGE.search(text) is not None


def source_files(package_dir: Path) -> list[Path]:
    """Return the integration files searched for identifiers, sorted."""
    return sorted(
        path
        for path in package_dir.rglob("*")
        if path.is_file()
        and path.suffix in SEARCHED_SUFFIXES
        and "__pycache__" not in path.parts
    )


def find_usages(names: Iterable[str], package_dir: Path) -> dict[str, list[str]]:
    """Return ``file:line`` locations in the integration for each name used."""
    wanted = sorted(set(names))
    if not wanted:
        return {}
    pattern = re.compile(r"\b(" + "|".join(map(re.escape, wanted)) + r")\b")
    usages: dict[str, list[str]] = {}
    root = package_dir.parent.parent
    for path in source_files(package_dir):
        relative = path.relative_to(root).as_posix()
        lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
        for number, line in enumerate(lines, start=1):
            for name in set(pattern.findall(line)):
                locations = usages.setdefault(name, [])
                if len(locations) < MAX_LOCATIONS:
                    locations.append(f"{relative}:{number}")
    return dict(sorted(usages.items()))


def recent_posts(
    *,
    days: int,
    now: datetime,
    package_dir: Path = PACKAGE_DIR,
    fetch: Fetch = fetch_url,
) -> list[Post]:
    """Return the posts of the last ``days`` days, matched to the integration."""
    cutoff = now - timedelta(days=days)
    posts = [
        post
        for post in parse_feed(fetch(FEED_URL))
        if datetime.fromisoformat(post.published) >= cutoff
    ]
    for post in posts:
        # One unreachable post must not hide the others; main reports it.
        try:
            page = fetch(post.link)
        except OSError as err:
            post.error = f"{type(err).__name__}: {err}"
            continue
        post.announces_change = announces_change(page)
        post.matches = find_usages(changed_identifiers(page), package_dir)
    return posts


def render_summary(posts: Sequence[Post], days: int) -> str:
    """Return a Markdown job summary of the checked posts."""
    lines = [f"## Home Assistant developer blog, last {days} days", ""]
    if not posts:
        return "\n".join([*lines, "No new posts.", ""])
    lines += [
        "| Post | Announces a change | Changed identifiers used here |",
        "| --- | --- | --- |",
    ]
    for post in posts:
        if post.error:
            lines.append(
                f"| [{post.title}]({post.link}) | fetch failed: {post.error} | |"
            )
            continue
        flag = "yes" if post.announces_change else "no"
        used = ", ".join(f"`{name}`" for name in post.matches) or "none"
        marker = " **(issue)**" if post.actionable else ""
        lines.append(f"| [{post.title}]({post.link}){marker} | {flag} | {used} |")
    return "\n".join([*lines, ""])


def render_issue(post: Post) -> str:
    """Return the body of the issue opened for an actionable post."""
    lines = [
        f"Home Assistant's developer blog announced a change on {post.published[:10]} "
        "that names code Philips AirPurifier uses:",
        "",
        f"**[{post.title}]({post.link})**",
        "",
        f"> {post.summary}" if post.summary else "",
        "",
        "Where the integration uses the identifiers the post names:",
        "",
    ]
    for name, locations in post.matches.items():
        lines.append(f"- `{name}`: " + ", ".join(f"`{loc}`" for loc in locations))
    lines += [
        "",
        "Read the post, decide whether the integration needs a change and in which "
        "Home Assistant release, then fix it or close this issue with the reason.",
        "",
        "--------",
        "Opened automatically by the weekly Home Assistant developer blog check "
        "(`.github/workflows/ha-dev-blog.yml`).",
    ]
    return "\n".join(line for line in lines if line is not None)


def main(argv: Sequence[str] | None = None, *, fetch: Fetch = fetch_url) -> int:
    """Run the command-line interface."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    # Three weeks: a weekly run still catches up after two missed runs, and
    # the workflow never opens a second issue for a post.
    parser.add_argument("--days", type=int, default=22, help="Look-back window")
    parser.add_argument("--json", type=Path, help="Write the report as JSON here")
    parser.add_argument("--summary", type=Path, help="Append a Markdown summary here")
    args = parser.parse_args(argv)

    posts = recent_posts(days=args.days, now=datetime.now(UTC), fetch=fetch)
    if args.json:
        report = [
            {**asdict(post), "actionable": post.actionable, "issue": render_issue(post)}
            for post in posts
        ]
        args.json.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    summary = render_summary(posts, args.days)
    if args.summary:
        with args.summary.open("a", encoding="utf-8") as handle:
            handle.write(summary)
    print(summary)
    # Fail after writing the report, so issues still open for the posts read.
    failed = [post for post in posts if post.error]
    for post in failed:
        print(f"Could not read {post.link}: {post.error}", file=sys.stderr)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
