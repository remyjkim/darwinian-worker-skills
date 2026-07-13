---
name: manage-machine-inventory
description: "Use when installing, updating, removing, transferring, or garbage-collecting standalone machine skill packages and MCP records without activating them."
---

# Manage Machine Inventory

## Purpose

Manage reusable standalone inventory independently from machine and project
activation. Inventory operations do not make capabilities effective.

## Procedure

1. Inspect inventory before mutation:
   - `drwn machine skill list --json`
   - `drwn machine mcp list --json`
2. Inspect one record and its references:
   - `drwn machine skill show <id> --json`
   - `drwn machine skill references <id> --json`
   - `drwn machine mcp show <id> --json`
   - `drwn machine mcp references <id> --json`
3. Preview skill package changes before applying them:
   - Install: `drwn machine skill install <source> --dry-run --json`
   - Update: `drwn machine skill update <package> --from <source> --dry-run --json`
   - Uninstall: `drwn machine skill uninstall <package> --dry-run --json`
4. Preview MCP record changes before applying them:
   - Add: `drwn machine mcp add <file> --as <id> --dry-run --json`
   - Update: `drwn machine mcp update <id> --from <file> --dry-run --json`
   - Remove: `drwn machine mcp remove <id> --dry-run --json`
5. For reference-sensitive update or removal, add every unregistered project
   root with repeated `--project <root>`. Unreadable registered roots fail
   closed; repair or unregister stale roots explicitly.
6. For Claude MCP import, inspect `claude mcp list` and
   `claude mcp get <id>`, then parse the authoritative JSON configuration with
   a structured parser. Never read OAuth stores. Replace literal secrets with
   `${ENV_VAR}` references, stage a validated definition, and add it with
   `drwn machine mcp add`.
7. Use deterministic portable transfer commands as required:
   - Metadata: `drwn machine inventory export --output <file>`
   - Offline bytes: `drwn machine inventory bundle --output <file>`
   - Read-only comparison: `drwn machine inventory verify --from <file> --json`
   - Additive import: `drwn machine inventory sync --from <bundle> --dry-run`
8. Plan garbage collection with `drwn machine inventory gc --json`. Run
   `drwn machine inventory gc --prune` only after reviewing eligible garbage.

## Guardrails

- Inventory install and transfer never activate capabilities.
- Referenced inventory removal is blocked and has no force bypass.
- Current inventory is removed only by explicit uninstall or remove.
- Portable artifacts exclude credentials, project intent, Cards, and runtime
  state.

## Failure Modes

- Skill ID collision: stop and identify the owning package.
- Referenced package or MCP record: disclose every known reference and stop.
- Unreadable registered project: repair or unregister it; do not bypass the
  reference scan.
- Portable artifact conflict: stop; sync is additive and never overwrites.

## Related Skills

- `manage-machine-capabilities`
- `author-card`
- `repair-worker`
