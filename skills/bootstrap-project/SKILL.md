---
name: bootstrap-project
description: "Use when initializing Darwinian Worker in a project or installing the locked Worker/Card graph after cloning an existing project."
---

# Bootstrap Project

## Purpose

Create the supported project configuration or hydrate an existing locked
project. Keep machine capability selection separate from project intent.

## Procedure

1. Run `drwn --version` and stop if the CLI is unavailable.
2. Run `drwn status --json` to distinguish a new directory from an existing
   project.
3. For a new project, choose one supported setup path:
   - Interactive terminal: `drwn init`
   - Prompt-free setup: `drwn init --non-interactive`
4. Never use `--force` over an existing config without explicit approval.
5. When `.agents/drwn/card.lock` already exists, hydrate its immutable Card
   graph with `drwn install`. In CI, use `drwn install --frozen` so network or
   lock changes fail.
6. Use `drwn install --no-write` when the user wants to fetch and verify Card
   bytes before projecting downstream files.
7. Re-run `drwn status --json` and report the selected Worker, roots, and any
   unresolved state.
8. Preview downstream projection with `drwn write --dry-run --json`.
9. Run `drwn write` only after the user approves the preview.

## Guardrails

- Project setup does not inherit machine capabilities into project intent.
- A project has at most one selected Worker.
- Do not edit `config.json` or `card.lock` directly.
- Do not invent Card refs when project intent is incomplete.

## Failure Modes

- Missing CLI: stop and report that `drwn` must be installed.
- Unsupported or malformed local schema: stop; do not rewrite it speculatively.
- Frozen install requires fetch or lock changes: report the exact requirement
  and leave the project unchanged.
- Projection reports drift: hand off to `repair-worker`; do not force a write.

## Related Skills

- `manage-project-worker`
- `inspect-worker`
- `repair-worker`
