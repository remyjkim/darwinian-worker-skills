---
name: import-mcp-from-claude
description: "Use when the user says /import-mcp-from-claude, wants to port one or many MCP servers added with `claude mcp add` into the drwn library so drwn manages them uniformly across Claude Code, Codex, and Cursor. Handles registry-collision detection, schema transformation, activation choice, and scope-safe Claude cleanup."
---

# Import MCP Servers from Claude Code into drwn

**Assumes:** `drwn` and `claude` CLIs on PATH. The user has at least one MCP server already added to Claude Code via `claude mcp add`. If the user wants to import a server they have never added to Claude, redirect them to `drwn library add mcp` directly (or to the `@darwinian/notion` card flow if it's Notion specifically).

Move one or more MCP servers from Claude Code's own config into drwn's library / registry surface, so a single drwn-managed source delivers the same server to all three tools.

## Input

**Determine arguments.** When invoked via slash, the user's message is `/import-mcp-from-claude [<name1> <name2> ...]` or `/import-mcp-from-claude --all`. Parse:

- Zero args → enumerate Claude's current MCPs and ask which to import.
- `--all` → import every Claude MCP not already in drwn's built-in registry or local library.
- One or more names → import each by name.

When invoked via prose (e.g., "port my Notion and Linear MCPs into drwn"), extract the names from the message; if unclear, ask.

## Directive

### Step 1: Discovery (read-only)

1. Run `claude mcp list` to enumerate what Claude Code has configured. Capture name, scope (local/project/user), and transport per entry. Treat this as text output; current Claude Code does not expose `--json` for this command. Only run this in directories the user trusts, because Claude Code may spawn stdio servers from project `.mcp.json` during health checks.
2. For each candidate import target, run `claude mcp get <name>` to capture the readable detail block. Current Claude Code does not support `claude mcp get <name> --json`.
3. When exact JSON is needed for transformation, inspect the authoritative config file instead of guessing from text output:
   - Project scope: read `<project>/.mcp.json` from the project where `claude mcp get` reports the server.
   - Local/user scope: inspect `~/.claude.json` for matching `mcpServers` entries, including project-local entries under the current project path.
   - Use a structured JSON parser (`jq`, Node, or equivalent). Do not read or copy OAuth token stores.
4. Run `drwn library list mcp --json` and (if available) `drwn library show <name> --json` for each candidate to detect:
   - **Already in drwn's built-in registry** (`source: "registry"`): the server is shipped with drwn; no library-add needed. Surface as "registry-backed" and skip directly to the activation question for that name.
   - **Already in local library** (`source: "library"`): ask whether to overwrite (`--replace`) or skip.
   - **Not in drwn**: proceed to transformation.

Show the user a table summarizing the plan before any mutation:

```text
name        claude transport    in drwn?       action
----------- ------------------- -------------- --------------------------
notion      http                registry       skip add, ask activation
linear      stdio (npx)         not present    transform + library add
custom-api  http (with headers) not present    transform + library add (headers → ${ENV_VAR} placeholders)
```

Wait for explicit confirmation before proceeding.

### Step 2: Schema transformation (per server not in drwn)

For each server requiring `drwn library add mcp`:

1. Convert Claude's JSON shape to drwn's `RegistryServer` schema. Field mapping:

   | Claude field | drwn field | Notes |
   | --- | --- | --- |
   | `type: "http"` or `"sse"` | `transport: "http"` / `"sse"` | string-rename |
   | (stdio: no `type`) | `transport: "stdio"` | inferred from presence of `command` |
   | `url` | `url` | passthrough for http/sse |
   | `command` | `command` | passthrough for stdio |
   | `args` | `args` | passthrough |
   | `env` | `env` | passthrough |
   | `headers` | `headers` | Passthrough as a string map (drwn ≥ 0.6.0). Per target: Claude keeps `${VAR}` verbatim, Cursor rewrites to `${env:VAR}`, Codex maps `Authorization: Bearer ${VAR}` → `bearer_token_env_var` and literal headers → `http_headers`. A **non-bearer** `${VAR}` header can't be expressed on Codex — drwn warns at write time and omits it (still carries on Claude/Cursor). |
   | `headersHelper`, per-server OAuth client metadata, custom timeout/loading fields | (no equivalent today) | **WARN the user** — do not silently drop auth-critical fields. Ask whether to (a) drop them and import with known limitations, (b) abort, or (c) keep the server in Claude and skip the import. |

   When a `headers` value holds an inline literal secret (e.g. `Bearer sk-...`), do **not** import it verbatim: prompt for an env var name (e.g. `FAL_KEY`), replace the secret with `${ENV_VAR}`, and record the variable in `notes`. Only the `${ENV_VAR}` reference is ever written to the library or a card.

2. Add drwn-specific fields that Claude doesn't track:
   - `description` (required by drwn): ask the user for a one-line purpose. Suggest a default derived from the name (e.g., `"<name> MCP server (imported from Claude Code)"`).
   - `optional`: ask. Default to `false` for "should always materialize when applied" vs `true` for "only activate when a project opts in".
   - `notes` (optional): ask. Common content: auth/setup hints, e.g. `"Run /mcp inside Claude Code to authenticate"`.

3. Write the transformed JSON to a staging file: `/tmp/<name>-drwn.json`.

4. Show the user the transformed JSON and ask for confirmation before registering.

### Step 3: Register in drwn library

For each confirmed transformation:

```bash
drwn library add mcp /tmp/<name>-drwn.json --as <name>
```

If the entry already exists in the local library and the user wants to overwrite, add `--replace`. If `drwn library add mcp` rejects with a "built-in registry collision" error, surface clearly and skip (the registry-backed entry already wins; no action needed).

Verify each registration:

```bash
drwn library show <name> --json
```

Expected: `source: "library"`, fields match the transformed JSON.

### Step 4: Choose activation surface (per server)

For each server (whether newly added or already in drwn's registry/library), ask which surface to activate:

- **(A) Current project only (recommended for Claude Code today)**: requires the user to `cd` into the target project first; then `drwn add mcp <name>`. Surface as "current project" with the project path. After `drwn write`, Claude Code should see the server from root `.mcp.json`.
- **(B) Bundle into a card (recommended for team distribution)**: ask which card source. Then `drwn card source add-mcp <card> <name>`. Useful for team distribution. Mention this requires a separate card publish + push to share.
- **(C) Machine-wide default**: `drwn library defaults add mcp <name>`. This is useful for drwn's global/default model, but do not claim it is confirmed for Claude Code `/mcp` unless the drwn machine-scope Claude writer has been updated to Claude Code's current user-scope config semantics. The confirmed Claude Code path is project/card materialization to `.mcp.json`.
- **(D) Skip activation**: just register in the library; activate manually later.

For batch imports, ask once if the same surface applies to all, or per-server.

### Step 5: Scope-safe cleanup (per server activated via drwn)

For each server now activated through drwn, the existing Claude-side entry may conflict with, duplicate, or be replaced by drwn's output. Handle this by scope:

1. Remind the user: "Once drwn writes this server's config, Claude Code may see duplicate scopes unless the old Claude-side entry is removed or intentionally replaced."
2. If the user chooses to remove the Claude-side entry:

   ```bash
   claude mcp remove <name> --scope <local|user|project>
   ```

   Run this for each server that was at scope `local`/`project`/`user` per the discovery output.
3. For project-scope Claude entries, cleanup order matters:
   - If the entry currently lives in `<project>/.mcp.json`, remove it before `drwn write`, or make sure every server worth preserving from that file is represented in drwn first.
   - Do **not** run `claude mcp remove <name> --scope project` after `drwn write`; that would edit the same `.mcp.json` file that drwn just materialized.
4. For local/user-scope Claude entries in `~/.claude.json`, removing them avoids Claude Code reporting conflicting scopes after drwn creates project `.mcp.json`.
5. Verify cleanup intentionally:
   - If drwn has not written the replacement yet, `claude mcp list` should no longer show the removed manual entry.
   - After `drwn write`, `claude mcp get <name>` should show `Scope: Project config (shared via .mcp.json)` for project/card activation.

### Step 6: Materialize

```bash
drwn write --dry-run --json
```

Confirm with the user that the planned writes look right (Notion → all three tool configs, etc., with `warnings: []`). Then:

```bash
drwn write
```

If drift is reported despite step 5, walk back through which server still has a manual entry or which previously drwn-managed file changed. Don't `--force` blindly.

### Step 7: Verify per-tool authentication

For each server requiring per-tool auth (most do, e.g. Notion needs OAuth):

- **Claude Code**: tokens may persist from before the import (auth is keyed by URL, not by who manages the config). Quick smoke test by running a tool call (e.g., `notion-search "anything"`). If it returns auth error, run `/mcp` to re-authenticate.
- **Codex**: `codex mcp login <name>` (first time only).
- **Cursor**: open MCP settings, authenticate (first time only).

Surface the per-tool auth steps to the user — don't assume Claude's auth carries over automatically.

## Output

- Updated drwn library entries (one per imported server).
- Activated surface per server (machine default / project / card / none).
- Materialized project configs in `.mcp.json` for Claude Code, `.codex/config.toml` for Codex, and `.cursor/mcp.json` for Cursor.
- (Optionally) cleaned-up Claude Code MCP list.
- Per-tool auth status reported to the user.

## Failure Modes

- **`drwn` not installed**: stop and tell the user to install drwn first.
- **`claude` not installed or no project active**: stop; user must run from a context where Claude Code is configured.
- **`claude mcp list` returns empty**: nothing to import. Suggest `claude mcp add ...` first or the direct `drwn library add mcp` route.
- **Server id collision with built-in registry**: surface and treat as already-in-drwn; offer to activate without library-add.
- **Literal secret inside `headers`**: convert to a `${ENV_VAR}` placeholder and tell the user to export the variable; never register a manifest containing the literal token.
- **`drwn write` reports drift after cleanup**: do not auto-force. Walk back to find the un-removed Claude entry or the modified drwn-managed file. Diagnose with `claude mcp list`, `claude mcp get <name>`, and `drwn doctor --json`.
- **Per-tool auth missing post-import**: report which tool needs auth and the exact command; do not block the import flow.

## Wraps

`claude mcp list`, `claude mcp get`, `claude mcp remove`, `drwn library list mcp`, `drwn library show`, `drwn library add mcp`, `drwn library defaults add mcp`, `drwn add mcp`, `drwn card source add-mcp`, `drwn write --dry-run`, `drwn write`.

## Notes

- The skill never touches OAuth tokens — those live in each tool's own credential store. Re-authenticating via the tool's UI after import is normal.
- For Codex- or Cursor-originated MCP entries, this skill does **not** cover the inverse direction. To extend, add equivalent discovery steps for `codex mcp list` / Cursor config inspection and adjust the cleanup steps per tool.
- Bearer-token `headers` import cleanly on drwn >= 0.6.0 using `${ENV_VAR}` placeholder expansion (the `@remyjkim/fal` card is the reference pattern). Fields with no drwn equivalent (`headersHelper`, OAuth client metadata) still require staying tool-local — don't pretend the import succeeded if auth would silently break.
- Once a server is in the drwn library, future cards can pick it up with `drwn card source add-mcp <card> <name>` — same pattern as analysis 64 / task 46 use for Notion.
