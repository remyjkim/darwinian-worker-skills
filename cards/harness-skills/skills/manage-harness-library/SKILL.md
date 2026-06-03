---
name: manage-harness-library
description: "Use when managing Darwinian Harness local inventory, package-backed skill bundles, MCP definitions, or card catalogs without making them defaults."
---

# manage-harness-library

## Purpose

Manage reusable inventory that is available to Darwinian Harness but not
automatically active everywhere. Use this for package-backed skill bundles,
local MCP definitions, card catalogs, and library inspection. Use
`manage-defaults` only when the user wants machine-wide defaults or curation.

Requires `drwn` on PATH. Scope is machine local inventory. Blast radius is
medium because package, MCP-library, and catalog commands mutate
`~/.agents/drwn`, but they do not write downstream agent tool state or activate
defaults by themselves.

## Procedure

1. Verify `drwn` is installed with `drwn --version`. If it fails, halt and tell
   the user to install `drwn`.
2. Read inventory with:
   - `drwn library list --json`
   - `drwn skills packages list --json`
   - `drwn library catalog list --json`
3. Disambiguate the user's intent:
   - Inspect local inventory: `drwn library list [skills|mcp] --json`
   - Show one inventory item: `drwn library show <id> --json`
   - Add a skill bundle: `drwn library add skill <package-spec> --json`
   - Inspect an installed bundle: `drwn skills packages show <package-name> --json`
   - Add an MCP definition: `drwn library add mcp <spec> --as <id>`
   - Manage card catalogs: `drwn library catalog list/add/refresh/remove`
4. For adding a skill bundle:
   1. Confirm the package spec or local path.
   2. Explain that the bundle becomes available only; it is not activated in
      any project and is not made a machine default.
   3. On approval, run `drwn library add skill <package-spec> --json`.
   4. Run `drwn skills packages show <package-name> --json` using the package
      name returned by the add command.
5. For adding an MCP definition:
   1. Confirm the JSON file or spec and the `--as <id>` identifier.
   2. Run `drwn library add mcp <spec> --as <id> --dry-run --json`.
   3. Show the planned local library change.
   4. On approval, run the same command without `--dry-run`.
   5. Use `--replace` only after the user explicitly confirms overwrite intent.
6. For card catalogs:
   1. Use `drwn library catalog list --json` first.
   2. For add, confirm the Git catalog URL and run
      `drwn library catalog add <url>`. The catalog scope comes from the
      catalog manifest, not from a separate CLI argument.
   3. For refresh, run `drwn library catalog refresh --json [scope]`.
   4. For remove, confirm the scope or URL and run
      `drwn library catalog remove <scope-or-url>`.
   5. Verify with `drwn library catalog list --json`.
7. If the user wants to make an available item active in every project, stop
   and redirect to `manage-defaults`.
8. If the user wants to activate an available item only in the current project,
   stop and redirect to `materialize-harness`.

## User-Ask Points

1. Confirm adding a package-backed skill bundle.
2. Confirm each MCP-library mutation after dry-run preview.
3. Confirm `--replace` for MCP definitions.
4. Confirm catalog add, refresh, and remove operations.
5. Confirm handoff before changing defaults or project activation.

## Wraps

`drwn --version`, `drwn library list --json`, `drwn library show --json`,
`drwn library add skill --json`, `drwn skills packages list --json`,
`drwn skills packages show --json`, `drwn library add mcp --dry-run --json`,
`drwn library add mcp`, `drwn library catalog list --json`,
`drwn library catalog add`, `drwn library catalog refresh --json`,
`drwn library catalog remove`

## Scope

Machine local inventory under `~/.agents/drwn`. This skill does not make
anything a machine default and does not write downstream `.claude/`, `.codex/`,
or `.cursor/` state.

## Failure Modes

- Bundle ingestion fails: surface the npm pack or bundle validation error.
- Bundle introduces a colliding skill name: stop; do not attempt to rename it
  inside the package.
- MCP definition collides with an existing local entry: require explicit
  `--replace` approval.
- Catalog clone or refresh fails: surface Git auth or network errors and stop.
- User expected automatic activation: explain availability vs curation vs
  project activation and redirect to the correct skill.

## Related Skills

- `manage-defaults`
- `materialize-harness`
- `recommend-harness`
- `support-harness`
