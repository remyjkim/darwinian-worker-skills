# Darwinian Harness CLI Alignment Audit

**Date**: 2026-06-03  
**Target repo**: `~/dev/beginning-harness-skills`  
**Reference CLI repo**: `~/dev/darwinian-harness`  
**Reference CLI state**: local `remyjkim/harness-card-v1.1`, latest local commits through `e702629 Refresh knowledge and publishing notes`  
**Purpose**: Determine whether this skills repo is aligned with the current `darwinian-harness` / `drwn` CLI tooling.

**Post-audit migration note**: The repo was subsequently renamed locally to
`~/dev/darwinian-harness-skills`, active content was migrated to
Darwinian Harness Skills / `drwn`, card scopes were updated to `@darwinian/*`,
and `bundle.json` support was added. The findings below describe the
pre-migration state that motivated the change.

## Executive Summary

The repo is structurally healthy as a skills-and-cards repository, but it is **not aligned with the current Darwinian Harness CLI surface**.

The main blocker is a hard command-name mismatch: this repo still wraps `bgng`, while the current CLI package exposes `drwn` and `drwn-hx`, not `bgng`. The audit found 423 `bgng` references, 28 `beginning-harness` references, 27 `Beginning Harness` references, and zero `drwn` / `darwinian-harness` references in the target repo content. Any skill that follows its current instructions will fail on a current Darwinian Harness install unless the user has an old local `bgng` alias.

The card source directories themselves are valid against the current CLI. All three checked `file:` card refs validate successfully:

- `cards/harness-skills`
- `cards/workspace-experimental`
- `examples/cards/minimal-card`

The local validation scripts also pass:

- `npm run validate:skills`: pass, 8 skills found
- `npm run lint:md`: pass, 22 Markdown files

The second major gap is distribution alignment. The repo packages skills for plugin and generic skill-distribution channels, but it is not ingestible through the current `drwn library add skill` / `drwn skills packages add` package-backed bundle model because it lacks `bundle.json`.

Naming direction from the current review: rename the repo/product presentation to **Darwinian Harness Skills** instead of the current `beginning-harness-skills` / Beginning Harness Skills naming. Preserve compatibility names only when they are intentionally user-facing install or invocation paths.

## Verdict

**Partially aligned, not ready for current `darwinian-harness` users.**

Aligned:

- Skill directory shape is valid.
- `SKILL.md` frontmatter passes the repo validator.
- Stable and experimental card copies are synchronized with canonical `skills/`.
- Card manifests are valid under current `drwn card validate file:...`.
- Current safety posture is mostly sound: mutating skills require approval and read-only skills stay read-only.

Not aligned:

- The repo documents and instructs `bgng`; current CLI is `drwn`.
- Paths use `~/.agents/bgng`; current store is `~/.agents/drwn`.
- `author-harness-card` predates `drwn card source ...` and instructs manual source inspection instead of using the new source-authoring commands.
- `bootstrap-project` says card search does not exist; current CLI has `drwn search card`.
- Maintainer docs point at `~/dev/beginning-harness`; current local authority is `~/dev/darwinian-harness`.
- Package metadata, plugin metadata, docs, and card descriptions still say `Beginning Harness` / `bgng`.
- The repo is not a current `drwn` package-backed skill bundle because it has no `bundle.json`.

## Investigation Scope

Reviewed:

- Root docs: `README.md`, `CLAUDE.md`, `MAINTAINERS.md`
- Package metadata: `package.json`, `package-lock.json`, `VERSION`
- Plugin metadata: `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.codex-plugin/plugin.json`
- Skill bodies under `skills/`
- Card sources under `cards/`
- Example card under `examples/cards/minimal-card`
- Scripts: `scripts/validate-skills.mjs`, `scripts/sync-card-skills.mjs`
- Current Darwinian Harness command help and bundle docs from `~/dev/darwinian-harness`

Commands run:

```bash
git status --short --branch
rg --files
rg -n "beginning|bgng|darwinian|drwn|harness|\\.agents|skills packages|library add skill|card source|~/.agents|AGENTS_REPO_ROOT|DRWN|BGNG|write --dry-run|mcp|card"
npm run validate:skills
npm run lint:md
npm pack --dry-run --json
diff -qr skills cards/harness-skills/skills
diff -qr skills/organize-workspace cards/workspace-experimental/skills/organize-workspace
```

Current CLI checks run from `~/dev/darwinian-harness`:

```bash
bun run drwn -- --help
bun run drwn -- card --help
bun run drwn -- card source --help
bun run drwn -- status --help
bun run drwn -- search --help
bun run drwn -- library defaults add skill --help
bun run drwn -- library add skill --help
bun run drwn -- card new --help
bun run drwn -- card source set --help
bun run drwn -- card source add-skill --help
bun run drwn -- card validate file:~/dev/beginning-harness-skills/cards/harness-skills --json
bun run drwn -- card validate file:~/dev/beginning-harness-skills/cards/workspace-experimental --json
bun run drwn -- card validate file:~/dev/beginning-harness-skills/examples/cards/minimal-card --json
bun run drwn -- library add skill ~/dev/beginning-harness-skills --json
```

## Current CLI Baseline

The current CLI is:

```text
drwn - 0.1.0
```

Current package binaries:

```json
{
  "drwn": "cli/index.ts",
  "drwn-hx": "cli/index.ts"
}
```

There is no `bgng` binary in the current package metadata.

Relevant current command surface:

- `drwn status [--json] [--explain] [--why <query>]`
- `drwn doctor [--json]`
- `drwn init [--force] [--guided] [--non-interactive] [--minimal] [--no-default-catalogs]`
- `drwn write [--dry-run] [--json] [--mcp-only] [--skills-only] [--target <target>] [--force]`
- `drwn apply [--write] <specs> ...`
- `drwn update [--write]`
- `drwn search skill [--library] [--catalog] [--json] <query>`
- `drwn search mcp [--library] [--catalog] [--json] <query>`
- `drwn search card [--scope <scope>] [--json] <query>`
- `drwn card new [--from-project] [--scope <scope>] [--no-git] <name> [projectPath]`
- `drwn card publish <name>`
- `drwn card show [--json] <ref>`
- `drwn card diff [--json] <before> <after>`
- `drwn card deprecate [--message <message>] <ref>`
- `drwn card validate [--json] <ref>`
- `drwn card source list [--json]`
- `drwn card source show [--json] <name>`
- `drwn card source doctor [--json] [name]`
- `drwn card source add-skill [--from <path>] [--replace] [--dry-run] [--json] <cardName> <skillName>`
- `drwn card source remove-skill [--keep-files] [--dry-run] [--json] <cardName> <skillName>`
- `drwn card source set [--description ...] [--version ...] [--license ...] [--harness-min-version ...] [--stability ...] [--last-validated-with ...] [--test-status-badge ...] [--dry-run] [--json] <cardName>`
- `drwn card source add-mcp [--from <path>] [--replace] [--dry-run] [--json] <cardName> <serverId>`
- `drwn card source remove-mcp [--keep-files] [--dry-run] [--json] <cardName> <serverId>`
- `drwn library add skill [--json] <packageSpec>`
- `drwn skills packages add [--json] <packageSpec>`

Current store paths:

- editable card sources: `~/.agents/drwn/sources/...`
- published cards: `~/.agents/drwn/cards/...`
- machine defaults: `~/.agents/drwn/machine.json`
- package-backed skills: `~/.agents/drwn/skills`
- user MCP definitions: `~/.agents/drwn/mcp-servers`

## Findings

### F1. Critical: repo wraps the removed/old `bgng` binary

Evidence:

- `package.json` description: "Agent skills wrapping the bgng CLI..."
- `README.md`: "Agent skills wrapping the `bgng` CLI..."
- Every canonical skill uses `bgng` in its procedure and `Wraps` section.
- Count scan found 423 `bgng` references and zero `drwn` references.
- Current `darwinian-harness/package.json` exposes `drwn` and `drwn-hx`; no `bgng`.

Impact:

Every skill procedure that asks an agent to run `bgng ...` is stale for current users. This is a functional break, not just branding drift.

Recommended fix:

Replace command references from `bgng` to `drwn`, unless this repo intentionally decides to maintain an old compatibility branch. Update user-facing failure wording from "bgng missing" to "`drwn` missing".

### F2. Critical: store paths use `~/.agents/bgng` instead of `~/.agents/drwn`

Evidence:

- `skills/author-harness-card/SKILL.md` says `~/.agents/bgng/sources/<name>/`.
- `skills/manage-defaults/SKILL.md` says `~/.agents/bgng/machine.json`.
- `examples/cards/README.md` copies to `~/.agents/bgng/sources/@me/minimal-card`.
- `cards/README.md` tells maintainers to copy sources into `~/.agents/bgng/sources/...`.

Impact:

Manual instructions will put files in the wrong store. Current `drwn` commands read/write under `~/.agents/drwn`.

Recommended fix:

Use current paths:

- `~/.agents/drwn/sources/<scope>/<name>/`
- `~/.agents/drwn/machine.json`
- `~/.agents/drwn/skills`
- `~/.agents/drwn/mcp-servers`

### F3. High: `author-harness-card` predates `drwn card source ...`

Evidence:

`skills/author-harness-card/SKILL.md` says that before first publish, the skill should inspect the source manifest directly from the source directory because `card show` only works for already-published versions.

Current CLI now provides:

- `drwn card source list`
- `drwn card source show`
- `drwn card source doctor`
- `drwn card source add-skill`
- `drwn card source remove-skill`
- `drwn card source set`
- `drwn card source add-mcp`
- `drwn card source remove-mcp`

Impact:

The authoring skill does not use the semantic source-authoring API. It will push agents toward manual filesystem edits, which the latest CLI explicitly replaces.

Recommended fix:

Rewrite `author-harness-card` around this lifecycle:

```bash
drwn card new @scope/name --no-git
drwn card source show @scope/name --json
drwn card source add-skill @scope/name <skill> [--from <path>] --dry-run --json
drwn card source add-skill @scope/name <skill> [--from <path>]
drwn card source add-mcp @scope/name <serverId> [--from <path>] --dry-run --json
drwn card source set @scope/name --description "..." --version 0.1.0 --stability stable --last-validated-with 0.1.0 --dry-run --json
drwn card source doctor @scope/name --json
drwn card publish @scope/name
```

Add explicit user-ask points before non-dry-run `add-skill`, `remove-skill`, `set`, `add-mcp`, `remove-mcp`, `publish`, and `deprecate`.

### F4. High: `bootstrap-project` incorrectly says card search does not exist

Evidence:

`skills/bootstrap-project/SKILL.md` says:

```text
There is no `bgng search card` today, so filter published local cards heuristically...
```

Current CLI has:

```bash
drwn search card [--scope <scope>] [--json] <query>
```

Impact:

The skill will provide weaker recommendations than the current CLI supports. It may miss registered catalog cards.

Recommended fix:

Use:

```bash
drwn search card "<query>" --json
drwn search card "<query>" --scope @team --json
```

Keep `drwn card list --json` as local store inventory, but do not present it as the only card discovery surface.

### F5. High: current repo is not a `drwn` package-backed skill bundle

Evidence:

Running:

```bash
bun run drwn -- library add skill ~/dev/beginning-harness-skills --json
```

fails with:

```text
Missing bundle.json at .../package
```

Current `drwn` bundle contract requires:

```text
package.json
bundle.json
skills/
```

with `bundle.json` shape:

```json
{
  "schemaVersion": 1,
  "bundleName": "package-name",
  "version": "0.1.0",
  "displayName": "Display Name",
  "description": "Optional",
  "skills": [
    {
      "name": "skill-name",
      "scope": "shared",
      "path": "skills/skill-name"
    }
  ]
}
```

Impact:

The repo can be consumed through plugin-specific and generic skills channels, but not through the first-class current `drwn` package-backed skill bundle flow.

Recommended fix:

Decide whether this repo should support `drwn library add skill` / `drwn skills packages add`.

If yes, add `bundle.json` at the package root and include it in package contents. For the current layout, likely entries are:

```json
{
  "schemaVersion": 1,
  "bundleName": "beginning-harness-skills",
  "version": "0.1.0",
  "displayName": "Darwinian Harness Skills",
  "description": "Agent skills for operating Darwinian Harness.",
  "skills": [
    { "name": "bootstrap-project", "scope": "shared", "path": "skills/bootstrap-project" },
    { "name": "apply-harness-card", "scope": "shared", "path": "skills/apply-harness-card" },
    { "name": "author-harness-card", "scope": "shared", "path": "skills/author-harness-card" },
    { "name": "inspect-harness", "scope": "shared", "path": "skills/inspect-harness" },
    { "name": "repair-harness", "scope": "shared", "path": "skills/repair-harness" },
    { "name": "manage-defaults", "scope": "shared", "path": "skills/manage-defaults" },
    { "name": "recommend-harness", "scope": "shared", "path": "skills/recommend-harness" },
    { "name": "organize-workspace", "scope": "experimental", "path": "skills/organize-workspace" }
  ]
}
```

Open design question: whether `organize-workspace` should be omitted from the root bundle or included as `experimental`. The current card model intentionally keeps it out of the stable card.

### F6. Medium: plugin and package metadata still describe the old product

Evidence:

- `.claude-plugin/plugin.json` description says "cards-era bgng CLI".
- `.codex-plugin/plugin.json` says "cards-era bgng CLI for Codex".
- plugin keywords include `bgng` and `beginning-harness`.
- `package.json` name and repository remain `beginning-harness-skills`.
- README title remains `Beginning Harness Skills`.

Impact:

This is partly product/brand strategy, not purely technical. The plugin namespace `beginning` may be intentionally stable, as `CLAUDE.md` warns that renaming it breaks invocation paths like `/beginning:bootstrap-project`. However, metadata that says the wrapped CLI is `bgng` is stale.

Recommended fix:

Separate stable distribution identity from current wrapped tool:

- Rename the repo/product presentation to **Darwinian Harness Skills**.
- Keep plugin namespace `beginning` if backward compatibility matters.
- Update descriptions to "skills for the `drwn` CLI" or "Darwinian Harness (`drwn`) CLI".
- Add compatibility wording if old `bgng` installs are intentionally supported by a legacy branch.
- Prefer a package/repo rename to `darwinian-harness-skills`; if a transition period is needed, document that `beginning` is a legacy compatibility namespace while `darwinian-harness` is the CLI package and current product name.

### F7. Medium: `CLAUDE.md` points maintainers at the wrong authoritative checkout

Evidence:

`CLAUDE.md` says:

```text
The companion CLI lives in `beginning-harness`. When available locally, use the
sibling checkout at `~/dev/beginning-harness`.
```

Current reference repo is:

```text
~/dev/darwinian-harness
```

Impact:

Future maintenance work will use stale docs/code as the command authority.

Recommended fix:

Update the authority section to point to:

```text
~/dev/darwinian-harness
```

and to current docs:

- `README.md`
- `.ai/knowledges/01_agents-cli-usage-guide.md`
- `.ai/knowledges/03_npm-skill-bundles-guide.md`
- `docs-docusaurus/docs/reference/cli/card.md`

### F8. Medium: card names and descriptions still use `@beginning/...`

Evidence:

- `cards/harness-skills/card.json`: `@beginning/harness-skills`
- `cards/workspace-experimental/card.json`: `@beginning/workspace-experimental`
- README documents those names as the shipped cards.

Impact:

Technically valid: current `drwn` accepts the card names, and file-ref validation passes. Strategically unclear: if the product has rebranded to Darwinian Harness, the card namespace may need to move to `@darwinian/...`, `@drwn/...`, or another chosen scope.

Recommended fix:

Make an explicit naming decision:

- **Compatibility-first**: keep `@beginning/...`, but update descriptions to say these are cards for Darwinian Harness / `drwn`.
- **Rebrand-first**: introduce new card names and provide a deprecation or migration note for `@beginning/...`.

Avoid silently renaming card scopes without a migration plan because existing project configs may reference the old names.

### F9. Low: local package publish contents are broad

Evidence:

`npm pack --dry-run --json` includes 40 files, including:

- `.github/workflows/*`
- `.editorconfig`
- `.markdownlint.yaml`
- both plugin manifests
- cards
- examples
- scripts
- skills

It also warns:

```text
npm warn gitignore-fallback No .npmignore file found, using .gitignore for file exclusion.
```

Impact:

If npm package distribution is intended, publish contents should be deliberate. This matters more if the repo becomes a `drwn` package-backed skill bundle.

Recommended fix:

Add either:

- `package.json.files`, or
- `.npmignore`

For `drwn` package-backed bundle support, include at least:

- `package.json`
- `bundle.json`
- `skills/**`
- `README.md`
- `LICENSE`

Cards and plugin manifests can be included only if the npm package is meant to be a multi-channel artifact.

## Validation Results

### Repo-local validation

```text
npm run validate:skills
PASS: All skills valid (8 found)
```

```text
npm run lint:md
PASS: 22 Markdown files, 0 errors
```

### Skill/card copy sync

```text
diff -qr skills cards/harness-skills/skills
Only in skills: organize-workspace
```

This is expected because `organize-workspace` belongs only to `workspace-experimental`.

```text
diff -qr skills/organize-workspace cards/workspace-experimental/skills/organize-workspace
PASS: no differences
```

### Current `drwn` card validation

```json
{
  "ok": true,
  "card": {
    "name": "@beginning/harness-skills",
    "version": "0.1.0",
    "integrity": "sha256-a12fbdfc7f3383dc38ddbd037b3ea54fe84141e6a33fd452d9cc444cbcb7cef6",
    "origin": "file"
  }
}
```

```json
{
  "ok": true,
  "card": {
    "name": "@beginning/workspace-experimental",
    "version": "0.1.0",
    "integrity": "sha256-8c14918ae65b1d8ef879019990682551ddf1b883adb8ffc2ef4aaf9e73c49649",
    "origin": "file"
  }
}
```

```json
{
  "ok": true,
  "card": {
    "name": "@me/minimal-card",
    "version": "0.1.0",
    "integrity": "sha256-5624f43e3961ee5b6d80bf71fc32493a5b475c275045a2b4ed5d76f4cdd5c718",
    "origin": "file"
  }
}
```

### Current `drwn` bundle ingestion

```text
drwn library add skill ~/dev/beginning-harness-skills --json
FAIL: Missing bundle.json
```

## Skill-by-Skill Alignment Notes

### `apply-harness-card`

Current behavior is mostly still conceptually aligned after command rename:

- `drwn card status --json`: valid
- `drwn card list --json`: valid
- `drwn apply`: valid
- `drwn card add/pin/remove/detach/update`: valid
- `drwn card outdated --json`: valid
- `drwn write --dry-run --json`: valid
- `drwn status --why`: valid

Needed changes:

- Replace `bgng` with `drwn`.
- Consider mentioning `drwn card apply --write`, `drwn card add --write`, etc. Current CLI can chain write after project card mutations via `--write`, but keeping the current separate preview/write approval model is safer.

### `author-harness-card`

Most stale skill relative to current CLI.

Needed changes:

- Replace manual manifest/source inspection with `drwn card source show`.
- Add `drwn card source doctor`.
- Add source mutation commands for skills, MCP servers, and manifest fields.
- Add quality field support: `--stability`, `--last-validated-with`, `--test-status-badge`.
- Update source path to `~/.agents/drwn/sources/...`.
- Keep `drwn card publish`, `show`, `diff`, `deprecate`, `validate`.

### `bootstrap-project`

Mostly aligned after command rename, except card discovery.

Needed changes:

- Use `drwn`, not `bgng`.
- Replace the "no search card" note with `drwn search card`.
- Keep `drwn card list --json` for local published inventory.
- Consider adding `drwn add skill <query> --yes` and `drwn add mcp <query> --yes` only if the skill should handle catalog-backed project additions.

### `inspect-harness`

Conceptually aligned after command rename.

Current CLI supports:

- `drwn status --json`
- `drwn status --why`
- `drwn status --explain`
- `drwn doctor --json`
- `drwn card status --explain`
- `drwn store status --json`
- `drwn extensions status <name> --json`
- `drwn extensions doctor <name> --json`

Needed changes:

- Replace `bgng` with `drwn`.
- Replace "Not in a bgng project" wording.

### `manage-defaults`

Mostly aligned after command rename, but path and package-bundle docs need updates.

Current CLI supports:

- `drwn library defaults list --json`
- `drwn library list --json`
- `drwn skills list --json`
- `drwn library defaults add/remove skill --dry-run --json`
- `drwn library defaults add/remove mcp --dry-run --json`
- `drwn library add skill --json`
- `drwn library add mcp --dry-run --json`
- `drwn skills curate --json`
- `drwn skills uncurate --json`

Needed changes:

- Use `~/.agents/drwn/machine.json`.
- Explain package-backed skill bundles require `bundle.json`.
- Clarify that `drwn library add skill` does not have `--dry-run`; current prose already accounts for commands without dry-run.

### `organize-workspace`

Conceptually aligned as a placeholder. Current `drwn scan --json` is still a placeholder.

Needed changes:

- Replace `bgng scan` with `drwn scan`.
- Update product wording from Beginning Harness to Darwinian Harness if rebranding the skills.

### `recommend-harness`

Mostly aligned after command rename, but missing card catalog search.

Needed changes:

- Use `drwn`.
- Add `drwn search card "<query>" --json`.
- Keep strict read-only behavior.

### `repair-harness`

Mostly aligned after command rename.

Needed changes:

- Use `drwn`.
- Replace "BGNG-owned drift" with "drwn-owned drift".
- Keep `drwn write --force` approval warning.

## Recommended Migration Plan

### Phase 1: Make current instructions runnable

1. Replace command references from `bgng` to `drwn` across:
   - `skills/`
   - `cards/**/skills/`
   - `README.md`
   - `cards/README.md`
   - `examples/cards/README.md`
   - plugin descriptions
   - maintainer docs
2. Replace store paths:
   - `~/.agents/bgng` -> `~/.agents/drwn`
   - `.agents/bgng` -> `.agents/drwn`
3. Update `CLAUDE.md` authority section to point to `~/dev/darwinian-harness`.
4. Run the local checks.
5. Validate all card refs with current `drwn card validate file:...`.

```bash
npm run sync:cards
npm run lint:md
npm run validate:skills
```

### Phase 2: Use current card source authoring

1. Rewrite `author-harness-card` around `drwn card source`.
2. Update `cards/README.md` and `examples/cards/README.md` to use `drwn card source show/doctor/set/add-skill/add-mcp` where relevant.
3. Add quality-field guidance for:
   - `--stability`
   - `--last-validated-with`
   - `--test-status-badge`
4. Keep direct `file:` card application docs because current cards validate as file refs.

### Phase 3: Update discovery and recommendation flows

1. Replace the stale "no card search" guidance with `drwn search card`.
2. Use `drwn library catalog list/add/refresh` in maintainer or recommendation docs if this repo expects team card catalogs.
3. Keep `drwn card list --json` for local store inventory only.

```bash
drwn search card "<query>" --json
```

### Phase 4: Decide distribution strategy

Choose one or both:

#### Plugin-first only

- Keep `.claude-plugin` and `.codex-plugin` as primary distribution.
- Update metadata to say the skills operate the `drwn` CLI.
- Document that the repo is not currently a `drwn` package-backed skill bundle.

#### Plugin + `drwn` package-backed bundle

- Add root `bundle.json`.
- Add `package.json.files` or `.npmignore`.
- Test the package-backed path.
- Decide whether `organize-workspace` belongs in the root bundle as `experimental` or only in the experimental card.

```bash
drwn library add skill ~/dev/beginning-harness-skills --json
drwn library show beginning-harness-skills --json
drwn add skill inspect-harness --dry-run --json
```

### Phase 5: Naming decision

Make an explicit product/compatibility decision:

- Rename the repository/product presentation to **Darwinian Harness Skills**.
- Prefer `darwinian-harness-skills` for the repo/package name.
- If `/beginning:*` plugin commands and `@beginning/*` cards remain compatibility names, keep them intentionally and document that they operate Darwinian Harness / `drwn`.
- Introduce new package/card names deliberately and preserve a migration note for old project refs and plugin commands.

## Suggested Acceptance Criteria For Alignment

The repo should be considered aligned when:

- The repo/product presentation says **Darwinian Harness Skills**.
- No active skill instructs users to run `bgng`.
- No active docs point users to `~/.agents/bgng`.
- `author-harness-card` uses `drwn card source` for source inspection and mutation.
- `bootstrap-project` and `recommend-harness` know about `drwn search card`.
- Root docs and plugin metadata correctly name `darwinian-harness` / `drwn` as the wrapped CLI.
- `npm run sync:cards`, `npm run lint:md`, and `npm run validate:skills` pass.
- `drwn card validate file:...` passes for every card under `cards/` and `examples/cards/`.
- If package-backed distribution is in scope, `drwn library add skill <repo-or-tarball> --json` succeeds.

## Bottom Line

The repo has good internal hygiene and valid card content, but it is still written for the previous `beginning-harness` / `bgng` CLI era. The minimum alignment patch is a command/path/product-doc migration to `darwinian-harness` / `drwn`. The highest-value functional patch is updating `author-harness-card` to use the new `drwn card source` authoring namespace. The main strategic decision is whether this repo should remain plugin-first only or also become a first-class `drwn` package-backed skill bundle via `bundle.json`.
