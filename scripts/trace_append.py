#!/usr/bin/env python3
"""Append a standardized entry to TRACE.md (public sanitized repo).

Usage:
  python3 scripts/trace_append.py \
    --run-id abc123 --stage worker --result ok \
    --read path/a --read path/b \
    --write path/c --commit path/c \
    --note "short note"
"""

from __future__ import annotations

import argparse
import datetime as dt
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TRACE = ROOT / "TRACE.md"


def fmt_list(items: list[str]) -> str:
    if not items:
        return "  - (none)"
    return "\n".join(f"  - {x}" for x in items)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--run-id", required=True)
    ap.add_argument("--stage", required=True)
    ap.add_argument("--result", choices=["ok", "degraded", "failed"], required=True)
    ap.add_argument("--read", action="append", default=[])
    ap.add_argument("--write", action="append", default=[])
    ap.add_argument("--commit", action="append", default=[])
    ap.add_argument("--note", action="append", default=[])
    args = ap.parse_args()

    ts = dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

    entry = (
        f"\n## {ts} | run_id={args.run_id} | stage={args.stage} | result={args.result}\n"
        f"- Files read:\n{fmt_list(args.read)}\n"
        f"- Files written:\n{fmt_list(args.write)}\n"
        f"- Files committed:\n{fmt_list(args.commit)}\n"
        f"- Notes:\n{fmt_list(args.note)}\n"
    )

    if not TRACE.exists():
        TRACE.write_text("# TRACE.md\n", encoding="utf-8")
    with TRACE.open("a", encoding="utf-8") as f:
        f.write(entry)

    print(str(TRACE))


if __name__ == "__main__":
    main()
