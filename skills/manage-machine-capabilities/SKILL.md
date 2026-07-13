---
name: manage-machine-capabilities
description: "Use when inspecting, enabling, disabling, or projecting explicit machine skill and MCP capabilities, including approved setup-profile provenance."
---

# Manage Machine Capabilities

## Purpose

Manage machine activation intent separately from standalone inventory and
project declarations. Machine capabilities are ambient in local sessions.

## Procedure

1. Inspect machine state with `drwn status --machine --json --explain`.
2. Distinguish approved setup-profile provenance from explicit selections.
   The profile is pinned during fresh guided setup; explicit commands do not
   mutate its immutable contents.
3. Confirm that each requested capability exists:
   - `drwn machine skill show <id> --json`
   - `drwn machine mcp show <id> --json`
4. Preview explicit activation changes:
   - `drwn machine skill enable <id> --dry-run --json`
   - `drwn machine skill disable <id> --dry-run --json`
   - `drwn machine mcp enable <id> --dry-run --json`
   - `drwn machine mcp disable <id> --dry-run --json`
5. Apply the approved command without `--dry-run`.
6. Note any remaining profile provenance reported by disable. Disabling an
   explicit selection does not remove the same capability from a pinned
   profile.
7. Preview user-scope projection with
   `drwn write --root --dry-run --json`.
8. After explicit approval, run `drwn write --root`.
9. Verify with `drwn status --machine --json --explain` and
   `drwn doctor --json`.

## Guardrails

- Fresh non-interactive setup starts with empty machine capabilities.
- Guided setup may install the opt-out approved profile once.
- Machine activation does not alter project config or standalone inventory.
- Machine projection must not write project-owned paths.

## Failure Modes

- Missing inventory record: install it with `manage-machine-inventory` first.
- Missing or changed pinned profile bytes: report the integrity issue; do not
  fetch or repair implicitly.
- User-scope drift: diagnose ownership before considering a forced write.
- Disable leaves profile provenance: report that the capability remains
  effective through the pinned profile.

## Related Skills

- `manage-machine-inventory`
- `inspect-worker`
- `repair-worker`
