---
name: author-card
description: "Use when creating, composing, editing, validating, or locally publishing capability Cards and Worker Blueprint sources."
---

# Author Card

## Purpose

Build mutable capability Card sources and Worker Blueprint sources, then
publish immutable local versions after validation.

## Procedure

1. Verify `drwn --version` and inspect sources with
   `drwn card source list --json`.
2. Create the appropriate source:
   - Capability Card: `drwn card new <name> [--scope @scope]`
   - Worker Blueprint: `drwn worker new <name> [--scope @scope]`
3. Inspect the source with `drwn card source show <name> --json`.
4. For a capability Card, preview and approve each source mutation:
   - `drwn card source add-skill <card> <skill> --dry-run --json`
   - `drwn card source add-mcp <card> <server> --dry-run --json`
   - `drwn card source add-hook <card> <hook> --dry-run --json`
   Use the matching remove command for removals.
5. Use `--from <path>` when copying an explicit skill or MCP definition.
   Require explicit approval before `--replace` or `--keep-files`.
6. Update supported metadata with
   `drwn card source set <card> ... --dry-run --json`, then apply it after
   approval.
7. Compose a Blueprint with
   `drwn worker compose <name> --add <card-ref>` or `--remove <card-ref>`.
8. Validate source state with `drwn card source doctor <name> --json` and
   `drwn card source sync <name> --check`.
9. Publish locally only after a clean preflight:
   - Capability Card: `drwn card publish <name>`
   - Worker Blueprint: `drwn worker publish <name>`
10. Verify the immutable ref with `drwn card validate <ref> --json` and
    `drwn card show <ref> --json`.
11. Use `drwn card release <name> --bump <kind>` to preview the integrated
    release flow; add `--yes` only after approval.

## Guardrails

- A Blueprint composes Cards; it does not copy machine activation intent.
- Card construction copies standalone capabilities into Card-owned sources.
- Never store literal credentials. Use environment-variable references.
- Published versions are immutable; bump the source version for every change.

## Failure Modes

- Source doctor reports issues: stop before publish.
- Structural change and version bump disagree: correct the version; do not use
  the mismatch override by default.
- Duplicate source content: use `--replace` only after reviewing the existing
  files.

## Related Skills

- `share-card`
- `manage-machine-inventory`
- `inspect-worker`
