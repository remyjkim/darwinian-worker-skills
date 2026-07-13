---
name: repair-worker
description: "Use when repairing unresolved Card bytes, stale Worker locks, source drift, projection ownership, or registered-project state after read-only diagnosis."
---

# Repair Worker

## Purpose

Restore declared Worker/Card state with the smallest supported mutation. Start
from diagnostics, preview every repair that supports dry-run, and verify after
each change.

## Procedure

1. Capture the failing state with `drwn status --json --explain` and
   `drwn doctor --json`.
2. Match the stable issue code to one repair path:
   - Missing locked Card bytes: `drwn install --no-write`
   - Stale root resolution: `drwn update --dry-run`, then `drwn update`
   - Editable source drift: `drwn card source sync <name> --check`, then
     `drwn card source sync <name>`
   - Stale registered checkout: `drwn projects unregister <root> --dry-run`
   - Downstream projection drift: `drwn write --dry-run --json`
3. Show the planned mutation and request approval.
4. Apply one repair at a time. For a stale registration, rerun
   `drwn projects unregister <root>` only after approval.
5. Use `drwn write --force` only when diagnostics prove that user-edited bytes
   are inside drwn-owned output and the user explicitly chooses replacement.
6. Re-run `drwn doctor --json` and `drwn status --json --explain`.
7. Stop if the issue code changes; diagnose the new state before another
   mutation.

## Guardrails

- Never hand-edit project config, lockfiles, write records, or generated output.
- Never delete current inventory to repair project projection.
- Never force through an unresolved Card graph or invalid ownership record.
- Preserve unrelated user-owned target configuration.

## Failure Modes

- Invalid supported schema: report the file and validation error; do not guess.
- Source sync would overwrite local edits: stop and present the changed files.
- Forced projection still fails: preserve diagnostics and stop.
- Registered root is unreadable but still needed for reference discovery:
  repair or explicitly unregister it before inventory cleanup.

## Related Skills

- `inspect-worker`
- `manage-project-worker`
- `manage-machine-inventory`
