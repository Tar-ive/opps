#!/usr/bin/env python3
"""Render personalized WhatsApp message bodies from a validated opps update.

Inputs:
- Private recipients file via env var `PRIVATE_RECIPIENTS_PATH` (VM-only, never committed)
- updates/YYYY-MM-DD.md (or a machine-readable JSON in the future)

This is a *starter* renderer: today it just wraps the same links with different
headers + "why" text. The next step is to move to structured JSON output from
the extractor so we can truly personalize ranking and rationale.

Usage:
  python3 scripts/render_recipient_messages.py --date 2026-03-01
Outputs:
  tmp/messages-<date>.json
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", required=True)
    args = ap.parse_args()

    private_path = Path(os.environ.get("PRIVATE_RECIPIENTS_PATH", "")).expanduser()
    if not private_path or not private_path.exists():
        raise SystemExit("Missing PRIVATE_RECIPIENTS_PATH (must point to VM-private recipients JSON)")
    profiles = json.loads(private_path.read_text(encoding="utf-8"))
    md_path = ROOT / "updates" / f"{args.date}.md"
    md = md_path.read_text(encoding="utf-8") if md_path.exists() else ""

    # naive link extraction
    links = []
    for line in md.splitlines():
        line = line.strip()
        if line.startswith("http"):
            links.append(line)
        if "http" in line:
            # pick the first http url
            idx = line.find("http")
            if idx >= 0:
                links.append(line[idx:].split()[0])

    # de-dupe preserve order
    seen = set()
    dedup = []
    for u in links:
        u = u.strip().rstrip(")]")
        if not u or u in seen:
            continue
        seen.add(u)
        dedup.append(u)

    out = []
    for r in profiles.get("recipients", []):
        why = r.get("why")
        header = f"📋 Daily Opps — {args.date}\n\nHi {r.get('name')}!\n{why}\n\nTop links:\n"
        body = "\n".join(f"- {u}" for u in dedup[:10])
        out.append({
            "id": r.get("id"),
            "to": r.get("to"),
            "channel": r.get("channel"),
            "message": header + body,
        })

    (ROOT / "tmp").mkdir(exist_ok=True)
    out_path = ROOT / "tmp" / f"messages-{args.date}.json"
    out_path.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(str(out_path))


if __name__ == "__main__":
    main()
