---
name: apply-harness-card
description: "Use when applying, adding, pinning, removing, updating, detaching, or inspecting Harness Cards in the current project before materializing downstream changes."
---

# apply-harness-card

## Purpose

Manage the project's Harness Card set: apply a fresh set, add or remove
individual cards, pin exact versions, refresh the lockfile, detach the project
from cards entirely, or inspect what is currently applied.

Requires `drwn` on PATH. Scope is project. Blast radius is medium because this
skill mutates project config, `card.lock`, and usually downstream generated
state after `drwn write`.

Cards pin harness state: card versions, bundled skills, MCP definitions,
extension intent, targets, and the project overlay. They do not pin the `drwn`
version, Claude/Codex/Cursor versions, operating-system dependencies, or
unpinned MCP runtime packages.

## Procedure

1. Read project card state with `drwn card status --json`.
2. Read published local card inventory with `drwn card list --json`.
3. Disambiguate intent:
   - Apply a full set: `drwn apply <spec> ...`
   - Add one: `drwn card add <spec>`
   - Pin one: `drwn card pin <spec>`
   - Remove one: `drwn card remove <name>`
   - Detach all cards: `drwn card detach`
   - Refresh lockfile: `drwn card update`
   - Inspect updates: `drwn card outdated --json`
4. Before a mutating card command, show the exact before/after intent in prose.
   Card mutations do not support `--dry-run` today.
5. On approval, run the selected card command.
6. Preview downstream effect with `drwn write --dry-run --json`.
7. On approval, run `drwn write`.
8. Confirm the result with `drwn card status --json`.
9. If the user wants provenance for a newly active item, run
   `drwn status --why <name>`.

## User-Ask Points

1. Confirm the requested card-set mutation before any `drwn apply` or
   `drwn card ...` mutation.
2. Confirm the final `drwn write` after reviewing `changes`.

## Wraps

`drwn card status --json`, `drwn card list --json`, `drwn card outdated --json`,
`drwn apply`, `drwn card add`, `drwn card pin`, `drwn card remove`,
`drwn card detach`, `drwn card update`, `drwn write --dry-run --json`,
`drwn write`, `drwn status --why`

## Scope

Project only.

## Failure Modes

- Unresolved card spec: surface the exact failure and stop.
- Duplicate card on add: surface the conflict and suggest `pin` or `update`.
- Missing card on remove or pin: tell the user and refer back to the current
  project status.
- No outdated cards: explain that there is nothing to refresh.

## Related Skills

- `author-harness-card`
- `install-harness-project`
- `materialize-harness`
- `share-harness-card`
- `inspect-harness`
- `recommend-harness`
