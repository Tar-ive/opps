# TRACE.md — Public Repo File Touch Log (Sanitized)

Purpose: lightweight, append-only trace of what automation touched in this repo.

## Rules
- Append one entry per run (UTC timestamp).
- Include only sanitized info (no names, no phone numbers, no secrets).
- Record:
  - run id (if available)
  - stage (worker | aggregation | backup-action)
  - files read
  - files written
  - files committed
  - result (ok|degraded|failed)

## Entry template

```md
## <UTC timestamp> | run_id=<id> | stage=<stage> | result=<ok|degraded|failed>
- Files read:
  - path/to/file
- Files written:
  - path/to/file
- Files committed:
  - path/to/file
- Notes:
  - short note
```

## Seed entry

## 2026-03-02T02:45:00Z | run_id=manual-bootstrap | stage=ops-maintenance | result=ok
- Files read:
  - scripts/render_recipient_messages.py
- Files written:
  - TRACE.md
- Files committed:
  - TRACE.md
- Notes:
  - Initialized trace log policy for public sanitized automation traces.
