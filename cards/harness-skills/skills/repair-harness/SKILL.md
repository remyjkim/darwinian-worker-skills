---
name: repair-harness
description: "Use when repairing Darwinian Harness drift, missing generated files, outdated card locks, or legacy layout, with previews and approvals before mutation."
---

# repair-harness

## Purpose

Guide safe repair of harness state after `inspect-harness` or a user report
finds drift. Use diagnostics to classify the issue, preview the fix, and only
then mutate.

Requires `drwn` on PATH. Scope is primarily project, but this skill also
touches the machine-wide store during `drwn store migrate`. Blast radius is
high.

## Procedure

1. Read current diagnostics with `drwn doctor --json`.
2. If cards are involved, read `drwn card status --explain`.
3. Read `drwn store status --json` to check for legacy layout.
4. Classify the issue:
   - Legacy layout detected
   - Broken symlinks, stale generated files, or MCP drift
   - Outdated card lock
   - Extension-specific health failure
5. For legacy layout:
   1. Explain what `drwn store migrate` will do.
   2. Ask for approval.
   3. Run `drwn store migrate` or `drwn store migrate --yes` when appropriate.
6. For downstream drift:
   1. Run `drwn write --dry-run --json`.
   2. Show `changes`.
   3. On approval, run `drwn write`.
   4. If the fix requires overwriting drwn-owned drift, explain `--force`
      explicitly and ask again before running `drwn write --force`.
7. For outdated card locks:
   1. Run `drwn card outdated --json`.
   2. On approval, run `drwn card update`.
   3. Then preview with `drwn write --dry-run --json` and continue through the
      write path.
8. For extension failures:
   1. Run `drwn extensions doctor --json` and `drwn extensions status <name> --json`.
   2. If a setup re-run is required, preview and explain it first.
   3. On approval, run `drwn extensions setup <name>`.
   4. Then preview downstream changes with `drwn write --dry-run --json`.
9. Re-run the relevant read-only commands to confirm the repair.

## User-Ask Points

1. Confirm store migration.
2. Confirm `drwn write`.
3. Confirm `drwn write --force` with an explicit overwrite warning.
4. Confirm `drwn card update`.
5. Confirm extension setup re-run when external tool setup is involved.

## Wraps

`drwn doctor --json`, `drwn card status --explain`, `drwn store status --json`,
`drwn store migrate`, `drwn write --dry-run --json`, `drwn write`,
`drwn write --force`, `drwn card outdated --json`, `drwn card update`,
`drwn extensions doctor --json`, `drwn extensions status --json`,
`drwn extensions setup`

## Scope

Project first, with machine-store mutation during migration.

## Failure Modes

- Clean diagnostics: explain that there is nothing to repair.
- User declines migration or write: stop cleanly with no further mutation.
- `drwn write` fails on unresolved included skills: surface the missing name and
  do not try to bypass it with `--force`.
- Extension setup failure: surface stderr and stop.

## Related Skills

- `inspect-harness`
- `apply-harness-card`
- `install-harness-project`
- `materialize-harness`
- `manage-defaults`
