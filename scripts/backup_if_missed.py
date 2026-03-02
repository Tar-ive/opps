#!/usr/bin/env python3
"""GitHub Actions fallback: generate opps update if today's update is missing.

Design goal:
- Provide a *safety net* for days when the OpenClaw cron did not successfully
  write/push `updates/YYYY-MM-DD.md`.

Signal:
- Canonical "did opps run" signal is the presence of `updates/<date>.md`.

Fallback behavior:
- If update exists: exit 0, do nothing.
- If missing: run a lightweight deterministic Exa search + produce a minimal
  markdown update (no heavy LLM extraction).

This is intentionally simpler than the OpenClaw agent run — it prefers
"something is better than nothing" while staying auditable.

Requires:
- EXA_API_KEY in environment.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import subprocess
from pathlib import Path

try:
    from zoneinfo import ZoneInfo
except Exception:  # pragma: no cover
    ZoneInfo = None

ROOT = Path(__file__).resolve().parents[1]
UPDATES = ROOT / "updates"
UPDATES.mkdir(exist_ok=True)


def today_in_tz(tz: str) -> str:
    if ZoneInfo is None:
        # Fallback: UTC
        return dt.datetime.now(dt.timezone.utc).date().isoformat()
    return dt.datetime.now(ZoneInfo(tz)).date().isoformat()


def run(cmd: list[str]) -> None:
    p = subprocess.run(cmd, cwd=str(ROOT), check=True, capture_output=True, text=True)
    if p.stdout:
        print(p.stdout)
    if p.stderr:
        print(p.stderr)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--tz", default="America/Chicago")
    ap.add_argument("--min-items", type=int, default=1)
    args = ap.parse_args()

    day = today_in_tz(args.tz)
    out = UPDATES / f"{day}.md"

    if out.exists() and out.stat().st_size > 50:
        print(f"✅ Update already exists: {out}")
        return

    api_key = (os.environ.get("EXA_API_KEY") or "").strip()
    if not api_key:
        raise SystemExit("Missing EXA_API_KEY")

    # 1) Exa search (deterministic, small)
    # We reuse the repo's existing scripts, but we intentionally keep numResults small.
    print("⚠️ Missing daily update; running fallback Exa search...")
    run(["node", "scripts/exa_search.js"])

    # 2) Minimal markdown build from candidate_results.json
    cand_path = ROOT / "candidate_results.json"
    if not cand_path.exists():
        raise SystemExit("candidate_results.json not produced")

    candidates = json.loads(cand_path.read_text(encoding="utf-8"))
    # Keep a small list
    candidates = [c for c in candidates if isinstance(c, dict) and c.get("url")][:25]

    # Optional novelty filter using state/seen_urls.json
    seen_path = ROOT / "state" / "seen_urls.json"
    seen: set[str] = set()
    if seen_path.exists():
        try:
            seen = set(json.loads(seen_path.read_text(encoding="utf-8")))
        except Exception:
            seen = set()

    fresh = []
    for c in candidates:
        u = c.get("url")
        if not u or u in seen:
            continue
        fresh.append(c)

    # If nothing fresh, still write something.
    final = fresh if len(fresh) >= args.min_items else candidates

    md = []
    md.append(f"# Daily Opportunities Update — {day}\n")
    md.append("⚠️ **Backup run** (GitHub Actions): OpenClaw cron did not produce today’s update.\n")
    md.append("## Candidate links (unverified)\n")
    for c in final:
        title = (c.get("title") or "(no title)").strip()
        url = c.get("url")
        md.append(f"- **{title}**\n  - {url}\n")

    out.write_text("\n".join(md), encoding="utf-8")
    print(f"✅ Wrote fallback update: {out}")

    # Update seen set
    (ROOT / "state").mkdir(exist_ok=True)
    for c in final:
        u = c.get("url")
        if u:
            seen.add(u)
    seen_path.write_text(json.dumps(sorted(seen), indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
