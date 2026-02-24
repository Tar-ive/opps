#!/usr/bin/env python3
"""Daily opportunity updater.

- Runs a set of web searches
- Produces a concise markdown update under updates/YYYY-MM-DD.md
- Updates README with link to latest

This script expects to be run inside the opps repo.
"""

from __future__ import annotations

import datetime as dt
import json
import os
import re
import subprocess
from pathlib import Path

import requests

BRAVE_API_KEY = os.environ.get("BRAVE_API_KEY", "").strip()
if not BRAVE_API_KEY:
    raise SystemExit("Missing BRAVE_API_KEY in environment (OpenClaw web_search uses it, but this script uses direct Brave API).")

TODAY = dt.datetime.utcnow().date().isoformat()
ROOT = Path(__file__).resolve().parents[1]
UPDATES = ROOT / "updates"
UPDATES.mkdir(exist_ok=True)
OUT = UPDATES / f"{TODAY}.md"

QUERIES = [
    '"10,000 AIdeas" competition submit',
    '"NVIDIA GTC" "golden ticket" startup',
    'AI startup competition 2026 apply',
    'hackathon 2026 prizes apply',
    'innovation challenge 2026 cash prize apply',
    'accelerator "credits" "apply" AI',
    'grant program "AI" 2026 apply',
    'pitch competition 2026 application deadline',
]


def brave_search(query: str, count: int = 5):
    url = "https://api.search.brave.com/res/v1/web/search"
    headers = {
        "Accept": "application/json",
        "X-Subscription-Token": BRAVE_API_KEY,
    }
    params = {
        "q": query,
        "count": count,
        "country": "US",
        "search_lang": "en",
        "ui_lang": "en-US",
    }
    r = requests.get(url, headers=headers, params=params, timeout=30)
    r.raise_for_status()
    return r.json()


def extract_items(payload: dict):
    items = []
    for r in payload.get("web", {}).get("results", []) or []:
        items.append(
            {
                "title": r.get("title", "").strip(),
                "url": r.get("url", "").strip(),
                "snippet": re.sub(r"\s+", " ", (r.get("description", "") or "").strip()),
            }
        )
    return items


def main():
    all_items = []
    for q in QUERIES:
        try:
            payload = brave_search(q, count=5)
            all_items.extend(extract_items(payload))
        except Exception as e:
            all_items.append({"title": f"ERROR for query: {q}", "url": "", "snippet": str(e)})

    # De-dupe by URL
    seen = set()
    deduped = []
    for it in all_items:
        u = it.get("url", "")
        if u and u in seen:
            continue
        if u:
            seen.add(u)
        deduped.append(it)

    # Keep top ~20
    deduped = deduped[:20]

    md = []
    md.append(f"# Opportunities — {TODAY} (UTC)\n")
    md.append("Shortlist of competitions/programs to submit projects and potentially win prizes.\n")
    md.append("## Shortlist\n")

    for it in deduped:
        title = it["title"] or "(no title)"
        url = it["url"]
        snip = it["snippet"]
        if url:
            md.append(f"- **{title}**\n  - Link: {url}\n  - Notes: {snip}\n")
        else:
            md.append(f"- **{title}**\n  - Notes: {snip}\n")

    OUT.write_text("\n".join(md), encoding="utf-8")

    # Update README latest link
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    latest_line = f"- Latest update: [`updates/{TODAY}.md`](updates/{TODAY}.md)\n"
    new = re.sub(r"- Latest update: .*\n", latest_line, readme)
    if new == readme:
        # insert under Latest
        new = readme.replace("## Latest\n", "## Latest\n" + latest_line)
    (ROOT / "README.md").write_text(new, encoding="utf-8")

    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
