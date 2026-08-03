---
name: author-card
description: "Use when creating, composing, editing, validating, or locally publishing capability Cards and Worker Blueprint sources."
---

# Author Card

## Purpose

Build mutable capability Card sources and Worker Blueprint sources, then
publish immutable local versions after validation.

## Procedure

1. Verify `drwn --version`. Identify the canonical source repository by its
   explicit path. A bare Card name is acceptable only when exactly one
   configured catalog checkout resolves it.
2. Create the appropriate source:
   - Capability Card: `drwn card new <name> [--scope @scope] --into <collection>`
   - Worker Blueprint: `drwn worker new <name> [--scope @scope] --into <collection>`
   Retain the returned source path for every following operation.
3. Inspect the source with `drwn card source show <source-path> --json`.
4. For a capability Card, preview and approve each source mutation:
   - `drwn card source add-skill <source-path> <skill> --dry-run --json`
   - `drwn card source add-mcp <source-path> <server> --dry-run --json`
   - `drwn card source add-hook <source-path> <hook> --dry-run --json`
   Use the matching remove command for removals.
5. On an add command, `--from <capability-path>` identifies the skill or MCP
   bytes being copied; it does not identify the Card source. Require explicit
   approval before `--replace` or `--keep-files`.
6. Update supported metadata with
   `drwn card source set <source-path> ... --dry-run --json`, then apply it after
   approval.
7. Compose a Blueprint with
   `drwn worker compose <source-path> --add <card-ref>` or `--remove <card-ref>`.
8. If the manifest declares `skills.upstream`, preview its refresh with
   `drwn card source sync <source-path> --check`. Validate with
   `drwn card source doctor <source-path> --json`.
9. Publish locally only after a clean preflight:
   - Capability Card: `drwn card publish --from <source-path>`
   - Worker Blueprint: `drwn worker publish --from <source-path>`
10. Verify the immutable ref with `drwn card validate <ref> --json` and
    `drwn card show <ref> --json`.
11. Use `drwn card release --from <source-path> --bump <kind>` to preview the
    integrated release flow; add `--yes` only after approval.

## Guardrails

- A Blueprint composes Cards; it does not copy machine activation intent.
- Card construction copies standalone capabilities into Card-owned sources.
- Never create, copy, or move authoring sources under
  `~/.agents/drwn/sources`; it is legacy operator data, not an active registry.
- `catalogCheckouts` is optional convenience for unique name lookup. Explicit
  paths work without catalog configuration.
- Never store literal credentials. Use environment-variable references.
- Published versions are immutable; bump the source version for every change.

## Failure Modes

- Source doctor reports issues: stop before publish.
- Missing or invalid source path: stop and request the canonical repository
  path; do not manufacture a machine-store copy.
- Name lookup returns zero or multiple matches: use the explicit source path.
- A supplied name and `--from` manifest disagree: correct the target; do not
  override the mismatch.
- Structural change and version bump disagree: correct the version; do not use
  the mismatch override by default.
- Duplicate source content: use `--replace` only after reviewing the existing
  files.

## Related Skills

- `share-card`
- `manage-machine-inventory`
- `inspect-worker`
