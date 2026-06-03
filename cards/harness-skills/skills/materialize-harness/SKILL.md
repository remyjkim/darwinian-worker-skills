---
name: materialize-harness
description: "Use when activating project-local skills or MCP servers, or writing effective Darwinian Harness state into downstream agent tools."
---

# materialize-harness

## Purpose

Materialize effective Darwinian Harness state into downstream agent tools. Use
this for routine `drwn write` work, targeted writes, MCP-only writes,
skills-only writes, and project-local activation of individual skills or MCP
servers before writing.

Requires `drwn` on PATH. Scope is project when a project config is present;
otherwise scope is machine. Blast radius is medium because this skill writes
generated state under `.claude/`, `.codex/`, `.cursor/`, or the corresponding
machine-level downstream directories.

## Procedure

1. Verify `drwn` is installed with `drwn --version`. If it fails, halt and tell
   the user to install `drwn`.
2. Read current state with `drwn status --json` and diagnostics with
   `drwn doctor --json`.
3. If diagnostics report legacy layout, unresolved skills, or card-store
   corruption, stop and redirect to `repair-harness`.
4. Disambiguate the user's intent:
   - Activate a project-local skill: `drwn add skill <query-or-name>`
   - Activate a project-local MCP server: `drwn add mcp <query-or-name>`
   - Write all effective state: `drwn write`
   - Write one target: `drwn write --target=<target>`
   - Write only skills: `drwn write --skills-only`
   - Write only MCP: `drwn write --mcp-only` or `drwn mcp write`
5. For project-local skill activation:
   1. Preview with `drwn add skill <query-or-name> --dry-run --json`.
   2. Use `--library` if the user wants local inventory only.
   3. Use `--yes` only when the user explicitly accepts installing an
      unambiguous catalog bundle.
   4. On approval, run the same command without `--dry-run`.
6. For project-local MCP activation:
   1. Preview with `drwn add mcp <query-or-name> --dry-run --json`.
   2. Use `--library` if the user wants local inventory only.
   3. Use `--yes` only when the user explicitly accepts an unambiguous catalog
      match.
   4. On approval, run the same command without `--dry-run`.
7. Build the downstream write command from the requested target or slice.
   Prefer:
   - `drwn write --dry-run --json` for all state
   - `drwn write --target=<target> --dry-run --json` for one target
   - `drwn write --skills-only --dry-run --json` for skills
   - `drwn mcp write --dry-run --json` for MCP-only writes
8. Show planned changes, warnings, target scope, and whether the write is
   project-scope or machine-scope.
9. If the dry run has no changes, say that generated state is already current
   and do not run a real write.
10. On approval, run the corresponding real write command without `--dry-run`.
11. Use `drwn write --force` only after a second explicit approval when the
    user accepts overwriting drift in drwn-managed regions.
12. Verify with `drwn status --json` and `drwn doctor --json`.

## User-Ask Points

1. Confirm any project config mutation from `drwn add skill` or `drwn add mcp`.
2. Confirm catalog-backed installation or catalog-backed MCP acceptance when
   `--yes` is needed.
3. Confirm downstream write after reviewing the dry-run changes.
4. Confirm `--force` separately with an explicit drift-overwrite warning.

## Wraps

`drwn --version`, `drwn status --json`, `drwn doctor --json`,
`drwn add skill --dry-run --json`, `drwn add skill`,
`drwn add mcp --dry-run --json`, `drwn add mcp`,
`drwn write --dry-run --json`, `drwn write`,
`drwn write --target`, `drwn write --skills-only`,
`drwn write --mcp-only`, `drwn write --force`,
`drwn mcp write --dry-run --json`, `drwn mcp write`

## Scope

Project when run inside a configured project; machine-level downstream state
when no project config is active. Project-local activation commands require a
project.

## Failure Modes

- Not in a project for `drwn add skill` or `drwn add mcp`: redirect to
  `bootstrap-project` first.
- Ambiguous catalog result: ask for a more specific query or use
  `recommend-harness`.
- Unresolved skill or MCP after activation: surface diagnostics and stop before
  writing.
- User-owned drift blocks write: explain the conflict and require separate
  approval before `--force`.

## Related Skills

- `bootstrap-project`
- `install-harness-project`
- `inspect-harness`
- `repair-harness`
- `recommend-harness`
