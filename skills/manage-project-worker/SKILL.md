---
name: manage-project-worker
description: "Use when installing, selecting, updating, pinning, or removing a project's Worker roots, adding explicit project capabilities, or projecting project state."
---

# Manage Project Worker

## Purpose

Manage the one selected Worker and its complete Blueprint graph. Project roots,
project capabilities, and downstream projection are explicit project intent.

## Procedure

1. Inspect current intent with `drwn status --json --explain` and
   `drwn card status --json --explain`.
2. Choose the operation that matches the requested state:
   - Replace all roots: `drwn apply <spec...>`
   - Add one root: `drwn add <spec>`
   - Select or install one root: `drwn use <ref>`
   - Clear selection but keep roots: `drwn use --none`
   - Pin one root: `drwn pin <spec>`
   - Refresh roots within requirements: `drwn update [name]`
   - Remove one root: `drwn remove <name>`
3. When applying alternative roots, pass `--active <root>` or `--none`.
   Never infer a selected Worker.
4. Use each mutation's `--dry-run` form first. Summarize config, lock, and
   selection changes before requesting approval.
5. Add explicit project capabilities only when requested:
   - `drwn add skill <skill-id> --dry-run --json`
   - `drwn add mcp <server-id> --dry-run --json`
   Apply the same command without `--dry-run` after approval.
6. Keep intent mutation separate from downstream projection unless the user
   explicitly approves a command's `--write` option.
7. Preview projection with `drwn write --dry-run --json`, then run
   `drwn write` after approval.
8. Verify the result with `drwn status --json --explain`.

## Guardrails

- Cards compose into one Blueprint; installed alternatives are not a stack.
- `write` is a projection and must not change project intent.
- Machine capability state is ambient and never becomes an implicit project
  declaration.
- Do not edit generated target files as the source of truth.

## Failure Modes

- Ambiguous alternative roots: require `--active` or `--none`.
- Resolution or trust failure: report the failing ref and stop before write.
- Missing locked bytes: run `drwn install --no-write` before projection.
- Projection drift or stale ownership: hand off to `repair-worker`.

## Related Skills

- `bootstrap-project`
- `inspect-worker`
- `repair-worker`
