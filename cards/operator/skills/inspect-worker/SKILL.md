---
name: inspect-worker
description: "Use when inspecting a project's Worker, Blueprint, Cards, capabilities, provenance, health, or catalog options without changing project state."
---

# Inspect Worker

## Purpose

Explain current project and machine-visible state without mutation. Prefer JSON
for exact provenance and stable issue codes.

## Procedure

1. Run `drwn status --json --explain` for roots, selected Worker, effective
   capabilities, targets, and write-record ownership.
2. Use `drwn status --why <id>` to explain one Card, skill, MCP server, target,
   or extension.
3. Run `drwn card status --json --explain` for configured refs, locked
   versions, and Card provenance.
4. Run `drwn doctor --json` for read-only drift, ownership, and configuration
   diagnostics.
5. Inspect immutable or editable Card state as needed:
   - `drwn card show <ref> --json`
   - `drwn card diff <before> <after> --json`
   - `drwn card validate <ref> --json`
   - `drwn card source show <name> --json`
   - `drwn card source doctor <name> --json`
6. Discover candidates without installing them:
   - `drwn search card <query> --json`
   - `drwn search skill <query> --json`
   - `drwn search mcp <query> --json`
7. Report declared project state separately from ambient machine visibility.
8. Recommend a mutation skill only after identifying the exact desired delta.

## Guardrails

- Do not run `write`, source sync, install, update, or repair commands.
- Do not treat generated files as project declarations.
- Preserve stable issue codes and exact paths in the report.

## Failure Modes

- No project config: report that the directory is not initialized.
- Invalid config, lock, or write record: report corruption; do not repair it.
- Missing external credentials: report the affected integration without
  attempting authentication.

## Related Skills

- `manage-project-worker`
- `repair-worker`
- `manage-machine-capabilities`
