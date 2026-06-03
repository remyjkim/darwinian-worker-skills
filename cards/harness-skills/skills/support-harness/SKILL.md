---
name: support-harness
description: "Use when collecting Darwinian Harness support artifacts, exporting session logs, or running low-risk store maintenance checks."
---

# support-harness

## Purpose

Collect support context and run explicit store maintenance commands without
conflating support work with repair. Use this for session-log exports, store
status, store verification, store archive export, and Git garbage collection
for local card repos.

Requires `drwn` on PATH. Scope is project for session exports and machine store
for store commands. Blast radius ranges from none to medium: verification is
read-only, exports write archive files, and `store gc` mutates local Git
storage without changing card content.

## Procedure

1. Verify `drwn` is installed with `drwn --version`. If it fails, halt and tell
   the user to install `drwn`.
2. Read baseline state with `drwn status --json` and
   `drwn store status --json`.
3. Disambiguate the user's support intent:
   - Inspect store status: `drwn store status --json`
   - Verify card store health: `drwn store verify --json`
   - Export session logs: `drwn export sessions`
   - Export the local store: `drwn store export --out <path>`
   - Run Git garbage collection: `drwn store gc`
4. For session exports:
   1. Run `drwn export sessions --dry-run`.
   2. Show how many Claude/Codex session files would be archived and the
      intended destination.
   3. Ask whether the user wants the default archive, an explicit `--out
      <path>`, and whether to use `--gzip`.
   4. On approval, run `drwn export sessions [--out <path>] [--gzip]`.
5. For store verification, run `drwn store verify --json` and summarize card
   store health. This is read-only and needs no approval.
6. For store archive export:
   1. Ask for an explicit output path.
   2. Explain that `drwn store export --out <path>` writes a tar archive of the
      local `~/.agents/drwn` store.
   3. On approval, run `drwn store export --out <path>`.
7. For `drwn store gc`:
   1. Explain that it runs Git garbage collection in local card repositories.
   2. Ask for approval because it mutates local Git storage.
   3. Run `drwn store gc`.
   4. Verify with `drwn store verify --json`.
8. If support checks reveal drift, unresolved config, legacy layout, or
   integrity problems, stop and redirect to `repair-harness`.

## User-Ask Points

1. Confirm writing a session archive after reviewing the dry run.
2. Confirm the explicit store export destination.
3. Confirm `drwn store gc`.

## Wraps

`drwn --version`, `drwn status --json`, `drwn store status --json`,
`drwn store verify --json`, `drwn export sessions --dry-run`,
`drwn export sessions`, `drwn store export --out`, `drwn store gc`

## Scope

Project session export and machine-level local `drwn` store support. This skill
does not repair state or write downstream agent tool configuration.

## Failure Modes

- No project session files found: report that there is nothing to archive.
- Export destination already exists or is unwritable: ask for another path.
- Store verification fails: surface the failing card repo and redirect to
  `repair-harness`.
- User asks to fix drift: redirect to `repair-harness`.

## Related Skills

- `inspect-harness`
- `repair-harness`
- `install-harness-project`
