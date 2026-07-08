ABOUTME: Implementation plan to finish the Darwinian Worker skills repo work started by PR #7.
ABOUTME: Covers docs/plugins/lockfile cleanup, mind-skill safety fixes, card composition, validation, smoke tests, and main-repo submodule coordination.

# Close The Darwinian Worker Skills Loop - Implementation Plan

**Status**: Draft, ready for implementation review  
**Created**: 2026-06-27  
**Target repo**: `~/dev/darwinian-harness-skills`  
**Reference CLI repo**: `~/dev/darwinian-harness`  
**Current skills repo base**: `main` at `d77e2a0` (`Merge pull request #7 from remyjkim/feat/base-mind-card`)  
**Current package identity**: `darwinian-worker-skills@0.3.0`  
**Canonical product name**: `Darwinian Worker` for the CLI/tooling ecosystem; `drwn` remains the command name.  
**Primary objective**: Finish the package, docs, plugin, card, skill, validation, and submodule follow-through after the new BaseMind work, without regressing the useful 18-skill inventory now on `origin/main`.

---

## Executive Summary

PR #7 moved the repo meaningfully forward: it renamed package-level metadata to
`darwinian-worker-skills`, added `@darwinian/base-mind@0.1.0`, introduced three
mind-specific skills, and expanded validation to understand the new base-mind
card lane.

The work is structurally valid but not release-polished. The repo currently has
a mixed identity:

- `package.json`, `bundle.json`, and remote URL say `darwinian-worker-skills`.
- `package-lock.json`, README, cards README, plugin display copy, examples, and
  many skill descriptions still say Darwinian Harness / Harness Cards.
- The old `@darwinian/harness-skills` card remains the only broad tools card.
- The new `@darwinian/base-mind` card works and validates, but its supporting
  docs and scripts are not yet complete enough for release confidence.

The closing strategy is:

1. Preserve the useful 18-skill inventory and `@darwinian/base-mind`.
2. Make `Darwinian Worker` the canonical user-facing product name across the
   skills repo and explicitly plan the downstream CLI/docs repo migration.
3. Complete the public rebrand across docs, plugins, lockfiles, and examples.
4. Introduce a primary `@darwinian/mind-skills` tools card while keeping
   `@darwinian/harness-skills` as a temporary compatibility card.
5. Add primary Mind Card skill IDs while keeping old Harness Card IDs as
   compatibility aliases for one release, unless maintainers explicitly decide
   the package has no external users.
6. Fix new mind-skill safety and command-semantics issues.
7. Add validation and smoke tests that catch the exact regressions found here.
8. After the skills repo is accepted, update the main `darwinian-harness`
   submodule pointer and `.gitmodules` URL to the new skills repo remote.

---

## Investigation Findings

### Git State

Skills repo:

```text
## main...origin/main
?? .ai/analyses/03_darwinian-mind-skills-update-strategy.md
```

Recent merged work:

```text
d77e2a0 Merge pull request #7 from remyjkim/feat/base-mind-card
c8f1efd fix(skills): satisfy markdownlint in base-mind skill bodies
3bb61c8 feat(cards): add @darwinian/base-mind v0.1.0
6bcad1a chore(scripts): extend skill inventory validator to recognize base-mind lane
533e539 chore(rename): align package + plugin metadata with darwinian-worker-skills
e454228 Merge pull request #6 from remyjkim/feat/sync-card-skills-skill
```

The only local untracked file is an analysis doc and should not be folded into
implementation unless intentionally requested.

### Current Validation Results

Commands run:

```bash
npm run lint:md
npm run validate:skills
npm pack --dry-run --json
```

Results:

```text
lint:md pass, 52 files
validate:skills pass, 18 skills
npm pack pass, darwinian-worker-skills@0.3.0, 62 entries
```

Current CLI card validations from `~/dev/darwinian-harness`:

```bash
bun run cli/index.ts card validate file:~/dev/darwinian-harness-skills/cards/harness-skills --json
bun run cli/index.ts card validate file:~/dev/darwinian-harness-skills/cards/base-mind --json
bun run cli/index.ts card validate file:~/dev/darwinian-harness-skills/cards/workspace-experimental --json
```

All three passed.

Isolated temp-project smoke passed:

- `drwn init --non-interactive`
- `drwn card apply file:~/dev/darwinian-harness-skills/cards/base-mind`
- `drwn write --dry-run --json`
- `drwn write`
- `drwn mind list --json`
- `drwn mind clear --json`
- `drwn write`

Observed behavior:

- `@darwinian/base-mind` writes per-mind bundles under
  `.agents/drwn/generated/minds/@darwinian/base-mind/`.
- It writes the composed active-stack view under `.agents/drwn/generated/mind/`.
- It projects the three BaseMind skills into Claude/Codex skill dirs.
- `mind clear` removes the composed active view and projected skills while
  preserving the per-mind bundle.

### Concrete Gaps

| Area | Finding |
| --- | --- |
| Package lockfile | `package-lock.json` root still says `darwinian-harness-skills@0.1.0`. |
| README | Still titled `Darwinian Harness Skills`; install commands point at `darwinian-harness-skills`; no `base-mind` card. |
| Cards README | Still only describes two Harness cards; no `base-mind` or future `mind-skills` lane. |
| Plugin manifests | URLs changed, but display copy, keywords, tags, prompts, and versions still say Harness / `0.1.0`. |
| Maintainer docs | Release checklist still references old package name and lacks card validation / smoke checks. |
| Downstream product name | The main CLI repo still uses singular `Darwinian Mind` / `darwinian-mind` across package metadata, docs sites, docs lockfiles, release checks, tests, and submodule docs. Official user-facing naming should be `Darwinian Worker`. |
| Stable card | `@darwinian/harness-skills` remains primary broad tools card; no `@darwinian/mind-skills`. |
| Skill IDs | Card-specific skills are still `apply-harness-card`, `author-harness-card`, `share-harness-card`. |
| Mind stack skill | `manage-active-mind-stack` instructs `drwn mind use` / `clear` before approval for the config mutation. |
| Visibility audit | `audit-mind-visibility` models network remotes as `public` or trusted `internal`; the CLI treats network remotes as `unknown` unless explicitly classified. |
| Mind content authoring | `author-mind-content` covers add commands, but not remove commands or publish validation fully. |
| Materialization/inspection/repair | Existing stable skills do not mention `mind list`, `activeMinds`, `generated/mind`, or `generated/minds`. |
| Support | `store seed` and `store migrate-to-git` are still missing. |
| Sync script | `npm run sync:cards` has no non-mutating `--check` mode. |
| Validation | No card validation script, no package-lock identity check, no CLI smoke script, no docs identity scan. |
| Main repo submodule | `~/dev/darwinian-harness/.gitmodules` still points at `https://github.com/remyjkim/darwinian-harness-skills.git`, and the submodule pointer is still `1aa90cd`. |

---

## Implementation Strategy

### Compatibility Decision

Use a compatibility-forward approach for this closing task.

Primary names should move to Mind Card terminology, but old IDs should not be
deleted in the same PR unless maintainers explicitly decide there are no users.

Recommended shape:

```text
apply-mind-card       primary
author-mind-card      primary
share-mind-card       primary

apply-harness-card    compatibility alias / legacy wrapper
author-harness-card   compatibility alias / legacy wrapper
share-harness-card    compatibility alias / legacy wrapper
```

Why:

- The package has now had multiple merged public-looking PRs.
- Skill IDs are user-facing invocation surfaces in plugin runtimes.
- Deleting old IDs creates avoidable friction.
- Keeping compatibility wrappers for one release lets docs and cards move
  forward without breaking old invocations abruptly.

If maintainers decide this package is still pre-public, the implementation can
skip aliases and do a clean rename. The default plan below assumes aliases.

### Card Strategy

Use three lanes:

```text
@darwinian/mind-skills          primary tools-only skills card
@darwinian/base-mind            rich mind card with persona/beliefs + three mind skills
@darwinian/workspace-experimental
```

Keep `@darwinian/harness-skills` for one compatibility release:

```text
@darwinian/harness-skills       compatibility tools card
```

The new primary `@darwinian/mind-skills` should include the full stable skill
portfolio, including the new mind-specific skills. `@darwinian/base-mind`
should remain smaller and opinionated: persona, beliefs, and the three mind
operator skills only.

### Canonical Product Naming Policy

Do not blindly replace every instance of "harness".

Use:

- `Darwinian Worker` for the CLI/tooling ecosystem's official user-facing
  product name.
- `Darwinian Worker Skills` for the skills package/plugin display identity.
- `Mind Card` for the card unit.
- `darwinian-minds-*` slugs for renamed downstream repos, packages, docs
  packages, plugins, and lockfile identities where the published artifact is
  being migrated.
- `darwinian-worker-skills` for this skills package/repo/install identity.
- `harness` only when referring to the generic local control-plane layer,
  generated harness state, or the historical/current CLI repo path.

Preserve these intentionally singular or code-level terms unless the CLI
surface itself changes:

- `drwn` command name.
- `mind` command namespace.
- `activeMinds` config key.
- `generated/mind` and `generated/minds` output paths.
- `BaseMind` card name.
- `Mind Card` and `Mind Cards` as the artifact type.

Examples:

- Change "Harness Card" to "Mind Card".
- Change "Darwinian Mind" product copy to "Darwinian Worker".
- Change public install commands to `darwinian-worker-skills`.
- Preserve `materialize-harness` and `repair-harness` names for now because
  they are control-plane operations, not card-unit names.
- Preserve `~/dev/darwinian-harness` as a local reference to the
  CLI checkout until that repo path changes.

### Safety Policy For `drwn mind use/clear`

The CLI does not support `--dry-run` for `mind use` or `mind clear`.

Therefore the skill must not claim to preview the proposed stack before the
activation mutation. It should:

1. Read `drwn mind list --json`.
2. Summarize current state and proposed active stack.
3. Ask for approval before running `drwn mind use --json ...` or
   `drwn mind clear --json`.
4. Then run `drwn write --dry-run --json` to preview downstream projection.
5. Ask again before `drwn write`.
6. If the user rejects the downstream write after activation, offer to restore
   the previous explicit stack with another `mind use` or `mind clear`. If the
   previous state was the absent default, explain that there is currently no CLI
   command to return to absent/default state.

For users who require a true pre-mutation projection preview, document the
heavier option: copy the project to a temporary directory, run the proposed
activation and write dry-run there, and then apply in the real project after
approval.

### Visibility Policy

Align with the current CLI gate:

```text
local/file remote      => private
network remote         => unknown unless the user supplies --remote-visibility
tools-only card        => no gate
visibility-bearing card => gate uses strictest section visibility
```

Do not teach a local trusted-organization classifier unless the CLI actually
supports one. The safe user-facing path is to make the user classify the remote
explicitly with `--remote-visibility private|internal|public|unknown`.

---

## Phase 1 - Release Identity, Lockfile, Docs, And Plugins

### Files

```text
package-lock.json
README.md
cards/README.md
examples/cards/README.md
examples/cards/minimal-card/card.json
MAINTAINERS.md
CLAUDE.md
.claude-plugin/plugin.json
.claude-plugin/marketplace.json
.codex-plugin/plugin.json
```

### Tasks

1. Regenerate the package lock root metadata:

   ```bash
   npm install --package-lock-only --ignore-scripts
   ```

   Expected root identity:

   ```text
   darwinian-worker-skills@0.3.0
   ```

2. Update README:
   - Title: `Darwinian Worker Skills`.
   - Package/repo commands: `remyjkim/darwinian-worker-skills`.
   - Local library command: `drwn library add skill <path-to-this-repo>`.
   - Skill inventory: 18 top-level skills, with stable/compatibility lanes
     clearly labeled.
   - Cards: document `@darwinian/mind-skills`, `@darwinian/base-mind`,
     `@darwinian/harness-skills` compatibility, and
     `@darwinian/workspace-experimental`.
   - Development commands: include card validation and smoke tests.

3. Update cards README:
   - Change title to reusable Mind Cards.
   - Add `@darwinian/base-mind`.
   - Add planned/implemented `@darwinian/mind-skills`.
   - Mark `@darwinian/harness-skills` as compatibility if kept.

4. Update plugin manifests:
   - Version fields to `0.3.0` unless plugin-versioning policy intentionally
     differs from package version.
   - Display name: `Darwinian Worker Skills`.
   - Keywords/tags: `darwinian-minds`, `mind-cards`, `drwn`.
   - Descriptions: mention Mind Cards and BaseMind.
   - Keep plugin namespace `darwinian`; do not change invocation prefix.

5. Update maintainer docs:
   - Replace old package name in release checks.
   - Add package-lock identity check.
   - Add card validation through current `drwn`.
   - Add isolated BaseMind smoke.
   - Add main-repo submodule update step.

6. Update examples:
   - Rename "Harness Card" examples to "Mind Card".
   - Keep examples structurally minimal.

### Verification

```bash
npm run lint:md
npm run validate:skills
node -e 'const p=require("./package-lock.json"); if (p.name !== "darwinian-worker-skills") process.exit(1)'
npm pack --dry-run --json
```

---

## Phase 2 - Primary Mind Card Skill IDs And Compatibility

### Files

```text
skills/apply-mind-card/SKILL.md
skills/author-mind-card/SKILL.md
skills/share-mind-card/SKILL.md
skills/apply-harness-card/SKILL.md
skills/author-harness-card/SKILL.md
skills/share-harness-card/SKILL.md
bundle.json
README.md
cards/*/card.json
scripts/sync-card-skills.mjs
scripts/validate-skills.mjs
```

### Tasks

1. Add primary Mind Card skill directories:
   - `apply-mind-card`
   - `author-mind-card`
   - `share-mind-card`

2. Convert old Harness Card skill dirs into compatibility wrappers:
   - Keep frontmatter names matching old directories.
   - Description should say compatibility alias.
   - Body should redirect to the corresponding Mind Card skill and explain the
     rename.
   - Do not duplicate full procedure bodies in aliases.

3. Update internal references:
   - `apply-harness-card` -> `apply-mind-card` where primary workflow is meant.
   - `author-harness-card` -> `author-mind-card`.
   - `share-harness-card` -> `share-mind-card`.
   - Keep references to old names only in compatibility notes.

4. Update bundle:
   - Include primary Mind Card skill IDs.
   - Include compatibility aliases only if maintainers want plugin installs to
     expose them. If included, mark clearly in README as compatibility.

5. Update card include lists according to card strategy:
   - `@darwinian/mind-skills`: primary stable set.
   - `@darwinian/harness-skills`: compatibility set.

### Verification

```bash
npm run sync:cards
npm run lint:md
npm run validate:skills
```

Also inspect trigger descriptions manually to make sure aliases do not compete
with primary skills for new user requests.

---

## Phase 3 - Mind Skills Safety And Semantic Fixes

### Files

```text
skills/manage-active-mind-stack/SKILL.md
skills/author-mind-content/SKILL.md
skills/audit-mind-visibility/SKILL.md
cards/base-mind/skills/*/SKILL.md
cards/base-mind/beliefs/*.md
```

### Tasks

1. Fix `manage-active-mind-stack`:
   - Remove "preview before activation" language.
   - Add approval before `drwn mind use --json` and `drwn mind clear --json`.
   - Preserve previous active stack in the procedure.
   - Add post-activation `drwn write --dry-run --json`.
   - Add second approval before `drwn write`.
   - Add rollback guidance if the write preview is rejected.
   - Clarify absent default cannot currently be restored by CLI.
   - Add optional temp-project preview path for strict workflows.

2. Patch `author-mind-content`:
   - Add remove command coverage:

     ```text
     drwn card source remove-persona
     drwn card source remove-belief
     drwn card source remove-memory --layer
     ```

   - Add `--keep-files` decision points.
   - Add publish validation expectations:
     `card source doctor`, `card publish`, `card validate`.
   - Clarify that in-repo card sources can be hand-edited then validated with
     `drwn card validate file:<path> --json`.
   - Correct any over-specific or unimplemented doctor issue names.

3. Patch `audit-mind-visibility`:
   - Align remote classification with CLI:
     local/file -> private; network -> unknown unless user classifies.
   - Replace trusted-org classifier language with explicit
     `--remote-visibility`.
   - Report recommended commands for blocked/unknown pushes.
   - Keep read-only contract.

4. Patch BaseMind beliefs if needed:
   - Ensure visibility guidance matches CLI `unknown` remote semantics.
   - Keep beliefs concise and public-safe.

### Verification

```bash
npm run sync:cards
npm run lint:md
npm run validate:skills
diff -qr skills/manage-active-mind-stack cards/base-mind/skills/manage-active-mind-stack
diff -qr skills/author-mind-content cards/base-mind/skills/author-mind-content
diff -qr skills/audit-mind-visibility cards/base-mind/skills/audit-mind-visibility
```

---

## Phase 4 - Patch Existing Stable Skills For Mind-Aware Workflows

### Files

```text
skills/apply-mind-card/SKILL.md
skills/author-mind-card/SKILL.md
skills/share-mind-card/SKILL.md
skills/bootstrap-project/SKILL.md
skills/install-harness-project/SKILL.md
skills/materialize-harness/SKILL.md
skills/inspect-harness/SKILL.md
skills/repair-harness/SKILL.md
skills/recommend-harness/SKILL.md
skills/support-harness/SKILL.md
skills/sync-card-skills/SKILL.md
skills/import-mcp-from-claude/SKILL.md
```

### Tasks

1. `apply-mind-card`:
   - Explain installed cards versus active stack.
   - After card mutation, inspect `drwn mind list --json` when relevant.
   - If explicit `activeMinds` excludes a newly added card, redirect to
     `manage-active-mind-stack`.
   - Update terminology from Harness Card to Mind Card.

2. `author-mind-card`:
   - Own card source lifecycle and local publish.
   - Delegate persona/belief/memory content details to `author-mind-content`,
     or include a concise section that points to it.
   - Include source doctor/publish/validate flow.

3. `share-mind-card`:
   - Add visibility gate flow before push:
     `card show`, strictest visibility summary, remote list, explicit
     `--remote-visibility` when network remote is unknown.
   - Add second approval before `--unsafe-push-public`.
   - Keep catalog publication coverage.

4. `materialize-harness`:
   - Explain write outputs:

     ```text
     generated/minds/ => per-installed-mind bundles
     generated/mind/  => composed active-stack view
     ```

   - Mention `drwn mind list --json` when diagnosing active projection.
   - Redirect stack changes to `manage-active-mind-stack`.

5. `inspect-harness`:
   - Add `drwn mind list --json`.
   - Inspect `generated/minds.json`, generated per-mind `mind.json`, and
     composed `generated/mind/mind.json` when the user asks about minds.
   - Explain absent/default all-active versus explicit empty stack.

6. `repair-harness`:
   - Add active stack mismatch as a diagnostic category.
   - Treat `mind clear` / no composed mind as expected when `activeMinds: []`.
   - Do not automatically add a card to the active stack as "repair".

7. `bootstrap-project` and `install-harness-project`:
   - Mention default all-active behavior after applying/installing cards.
   - Handoff to `manage-active-mind-stack` for selection.

8. `recommend-harness`:
   - Recommend Mind Cards.
   - Distinguish apply/install from active stack switching.

9. `support-harness`:
   - Add `drwn store seed --from <path> [--force]`.
   - Add `drwn store migrate-to-git --dry-run --json` and real migration.
   - Treat both as explicit store-scope operations with approvals.

10. `sync-card-skills` and `import-mcp-from-claude`:

    - Rebrand card-unit language to Mind Card where appropriate.
    - Preserve their current workflow boundaries.

### Verification

```bash
npm run sync:cards
npm run lint:md
npm run validate:skills
rg -n "Harness Card|harness card|harness-cards|darwinian-harness-skills|Darwinian Harness Skills" README.md cards examples .claude-plugin .codex-plugin skills
```

The scan should show only intentional compatibility or historical references.

---

## Phase 5 - Card Lane Rework

### Files

```text
cards/mind-skills/card.json
cards/mind-skills/package.json
cards/harness-skills/card.json
cards/harness-skills/package.json
cards/base-mind/card.json
cards/README.md
scripts/sync-card-skills.mjs
scripts/validate-skills.mjs
```

### Tasks

1. Add `cards/mind-skills` as the primary tools-only card.
2. Include the stable primary skill set:
   - bootstrap/install/materialize/inspect/repair/recommend/support
   - library/defaults/import/sync
   - `apply-mind-card`, `author-mind-card`, `share-mind-card`
   - `manage-active-mind-stack`, `author-mind-content`, `audit-mind-visibility`
3. Keep `cards/base-mind` as the rich mind card:
   - persona
   - beliefs
   - three mind operator skills
4. Decide exact compatibility behavior for `cards/harness-skills`:
   - Recommended: keep for one release and mark as compatibility.
   - Include primary skills plus alias wrappers if old invocations must work
     when only this card is applied.
5. Update scripts to use a declarative card map rather than hard-coded
   `harness-skills` assumptions.

### Verification

```bash
npm run sync:cards
npm run validate:skills
bun run ~/dev/darwinian-harness/cli/index.ts card validate file:~/dev/darwinian-harness-skills/cards/mind-skills --json
bun run ~/dev/darwinian-harness/cli/index.ts card validate file:~/dev/darwinian-harness-skills/cards/base-mind --json
bun run ~/dev/darwinian-harness/cli/index.ts card validate file:~/dev/darwinian-harness-skills/cards/workspace-experimental --json
```

Validate `harness-skills` too if compatibility card remains.

---

## Phase 6 - Validation Scripts, Check Mode, And CI

### Files

```text
package.json
scripts/sync-card-skills.mjs
scripts/validate-skills.mjs
scripts/validate-cards.mjs
scripts/smoke-cli.mjs
scripts/check-identity.mjs
.github/workflows/ci.yml
```

### Tasks

1. Add `sync:cards -- --check`:
   - In normal mode, copy canonical skills into card dirs.
   - In check mode, compare source and destination recursively and exit nonzero
     on drift without modifying files.

2. Add identity validation:
   - Package name/version match `VERSION`.
   - `package-lock.json` root matches `package.json`.
   - Plugin manifest versions match intended policy.
   - `bundle.json` name/version match package.

3. Add card validation script:
   - Use `DRWN_BIN` if set.
   - Else use `drwn` if available.
   - If neither exists, fail locally or skip in CI according to policy.
   - Validate every card source listed in a declarative card map.

4. Add isolated CLI smoke:
   - Creates temp `HOME` and project.
   - Applies `file:<repo>/cards/base-mind`.
   - Runs write dry-run and write.
   - Asserts generated per-mind and composed mind artifacts exist.
   - Runs `mind clear`, write, and asserts composed `generated/mind/` is gone
     while per-mind bundle remains.

5. Update `package.json` scripts:

   ```json
   {
     "check:identity": "node scripts/check-identity.mjs",
     "validate:cards": "node scripts/validate-cards.mjs",
     "smoke:cli": "node scripts/smoke-cli.mjs"
   }
   ```

6. Update CI:
   - Always run `lint:md`, `validate:skills`, `sync:cards -- --check`,
     `check:identity`.
   - Run CLI card/smoke tests only when a CLI is available, or document them as
     required local pre-release checks.

### Verification

```bash
npm run sync:cards -- --check
npm run check:identity
npm run lint:md
npm run validate:skills
DRWN_BIN="bun ~/dev/darwinian-harness/cli/index.ts" npm run validate:cards
DRWN_BIN="bun ~/dev/darwinian-harness/cli/index.ts" npm run smoke:cli
npm pack --dry-run --json
```

---

## Phase 7 - Main Repo And Downstream Naming Follow-Through

This phase belongs in `~/dev/darwinian-harness` after the skills
repo changes are merged or otherwise accepted.

### Files

```text
.gitmodules
darwinian-harness-skills
README.md
CONTRIBUTING.md
package.json
bun.lock
lychee.toml
scripts/verify-release-readiness.ts
docs/**
docs-astro/package.json
docs-astro/bun.lock
docs-astro/src/**
docs-astro/wrangler.toml
docs-docusaurus/package.json
docs-docusaurus/bun.lock
docs-docusaurus/docusaurus.config.ts
docs-docusaurus/docs/**
test/**
package/docs/readiness checks if they assert submodule URL or content
```

### Tasks

1. Update `.gitmodules` URL:

   ```text
   https://github.com/remyjkim/darwinian-worker-skills.git
   ```

2. Update the submodule pointer to the accepted skills repo commit.
3. Decide whether to rename the submodule path from `darwinian-harness-skills`
   to `darwinian-worker-skills`.
   - Recommended for this phase: update URL and pointer only; path rename can
     be separate because it is more disruptive.
4. Apply the official user-facing product name `Darwinian Worker` across README,
   docs, docs sites, alt text, titles, descriptions, maintainer docs, tests,
   and generated docs copy.
5. Migrate downstream slugs deliberately:
   - CLI package/repo/homepage/docs links from `darwinian-mind` to
     `darwinian-minds` where the public artifact is being renamed.
   - Docs packages from `darwinian-mind-docs` to `darwinian-minds-docs`.
   - Skills submodule docs from `darwinian-mind-skills` to
     `darwinian-worker-skills`.
   - Lockfiles (`bun.lock`, `docs-astro/bun.lock`, `docs-docusaurus/bun.lock`)
     after package metadata changes.
6. Update release-readiness scripts and tests so they enforce the new
   Darwinian Worker identity instead of the singular legacy identity.
7. Review subpath import examples and tests such as
   `darwinian-mind/hook-policy`.
   - If the npm package slug changes to `darwinian-minds`, update examples and
     tests to the new import path.
   - If backward compatibility is required, add an explicit compatibility plan
     instead of leaving the singular import path accidental.
8. Run main repo readiness checks that cover docs/package/submodule state.

### Verification

```bash
git submodule sync
git submodule update --init --recursive
bundledocs="bun.lock docs-astro/bun.lock docs-docusaurus/bun.lock"
rg -n "Darwinian Mind|darwinian-mind|darwinian-mind-docs|darwinian-mind-skills" README.md package.json $bundledocs docs docs-astro docs-docusaurus scripts test CONTRIBUTING.md lychee.toml
git status --short --branch --untracked-files=all
bun test test/package-readiness.test.ts test/docs-readiness.test.ts
bun run verify:release --json
```

---

## Final Verification Matrix

Run from skills repo:

```bash
npm run sync:cards
npm run sync:cards -- --check
npm run check:identity
npm run lint:md
npm run validate:skills
DRWN_BIN="bun ~/dev/darwinian-harness/cli/index.ts" npm run validate:cards
DRWN_BIN="bun ~/dev/darwinian-harness/cli/index.ts" npm run smoke:cli
npm pack --dry-run --json
git status --short --branch --untracked-files=all
```

Run from CLI repo after submodule update:

```bash
git submodule status
bun test test/package-readiness.test.ts test/docs-readiness.test.ts
bun run verify:release --json
git status --short --branch --untracked-files=all
```

---

## Acceptance Criteria

- Package identity is consistent across `package.json`, `package-lock.json`,
  `VERSION`, `bundle.json`, plugin manifests, README, and maintainer docs.
- Public docs use Darwinian Worker / Mind Card terminology, with only intentional
  legacy or generic control-plane `harness` references remaining.
- Plugin metadata is current and no longer advertises Harness Cards as the
  primary product unit.
- `@darwinian/base-mind` remains valid and smoke-tested.
- `@darwinian/mind-skills` exists as the primary tools-only card.
- `@darwinian/harness-skills` is either intentionally retained as a documented
  compatibility card or intentionally removed with a clear migration note.
- Mind-specific skills use correct CLI semantics and user-ask points:
  activation mutation approval before `mind use/clear`, write dry-run before
  `write`, visibility audit aligned with `unknown` remote gate.
- Existing stable skills are mind-aware where relevant.
- `support-harness` covers `store seed` and `store migrate-to-git`.
- `sync:cards -- --check`, identity checks, card validation, and isolated CLI
  smoke tests exist and pass.
- Main repo submodule URL/pointer update plan is complete after skills repo
  acceptance.
- Downstream CLI/docs repos have a concrete Darwinian Worker naming migration
  path, including package metadata, docs packages, docs lockfiles,
  release-readiness checks, tests, and compatibility/deprecation notes for any
  intentionally retained singular slugs.

---

## Out Of Scope

- Publishing real GitHub card remotes or catalogs.
- Removing compatibility skill IDs before maintainers explicitly approve.
- Renaming the main repo submodule path in the same change, unless explicitly
  requested.
- Building a richer `@darwinian/operator-mind` card beyond BaseMind.
- Changing `drwn` CLI behavior.
- Renaming the `drwn` binary or `mind` command namespace.

---

## Notes For Implementer

- Use `apply_patch` for manual file edits.
- Do not overwrite `.ai/analyses/03_darwinian-mind-skills-update-strategy.md`
  unless explicitly asked; it is currently untracked local planning work.
- Keep card-bundled skill copies synchronized after every canonical skill edit.
- Avoid adding broad new abstractions unless they simplify the card lane maps or
  validation scripts.
- Treat documentation strings as release surface: plugin metadata, README, and
  card descriptions are what users will see first.
