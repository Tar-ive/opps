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

## Helper command example

```bash
python3 scripts/trace_append.py \
  --run-id run_2026_03_02_abc123 \
  --stage worker \
  --result ok \
  --read workers/person_research_worker.py \
  --write artifacts/2026-03-02-worker-output.json \
  --commit artifacts/2026-03-02-worker-output.json \
  --note "Generated sanitized worker output"
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
