---
status: draft
date: 2026-06-26
target_repo: ~/dev/darwinian-harness-skills
reference_cli_repo: ~/dev/darwinian-harness
scope: skills-repo-design-and-update-strategy
---

# Darwinian Worker Skills Update Strategy

ABOUTME: Investigates the current skills repo design, usage scenarios, and alignment gaps against the current Darwinian Worker CLI.
ABOUTME: Recommends a strategy for updating skill names, skill scopes, card composition, validation, and mind-card workflow coverage.

## Executive Summary

The skills repo is structurally sound. Its strongest design decision is that skills are workflow-shaped rather than command-shaped: each skill owns a user intent, declares blast radius, previews mutations where the CLI supports dry-run, asks before consequential writes, verifies afterward, and redirects to sibling skills instead of becoming a catch-all.

That structure should be preserved.

The current standalone repo, however, is not yet the right Darwinian Worker skills package. It has two important divergences:

1. The standalone repo at `~/dev/darwinian-harness-skills` is on `feat/sync-card-skills-skill` with 15 valid skills and the freshest functional coverage, but it still uses `darwinian-harness-skills`, Harness Card terminology, and old card-skill names.
2. The checked-out submodule inside `~/dev/darwinian-harness/darwinian-harness-skills` has a rebrand commit to the singular `darwinian-mind-skills` name and `apply/author/share-mind-card`, but that submodule commit is older and lacks later standalone repo work such as `import-mcp-from-claude`, `sync-card-skills`, stronger catalog publication coverage, and the current 15-skill validation model.

The best base is the standalone 15-skill branch, with the Darwinian Worker rebrand ported forward onto it. Starting from the submodule rebrand snapshot would regress useful coverage.

The substantive product gap is now mind-card behavior. The skills repo should add one new project-level skill for active mind stack management, patch the card authoring/sharing/materialization/inspection/repair skills for mind-aware behavior, and keep the core portfolio small enough that an agent can select the right skill without confusion.

Recommended target:

- Port the rebrand forward onto the current 15-skill standalone branch.
- Rename the card-specific skills to `apply-mind-card`, `author-mind-card`, and `share-mind-card`.
- Add exactly one new stable skill: `manage-active-mind-stack`.
- Patch `author-mind-card` rather than adding a separate `author-mind-content` skill in the first pass.
- Patch `share-mind-card` for visibility-gated push workflows.
- Patch `materialize-harness`, `inspect-harness`, and `repair-harness` for generated `mind/` and `minds/` semantics.
- Patch `support-harness` for `store seed` and `store migrate-to-git`.
- Rename or supplement the stable skills card so the primary card is no longer `@darwinian/harness-skills`.
- Add a true non-mutating sync check and CLI-backed smoke tests that exercise mind-card authoring, activation, write, and generated artifact inspection in an isolated project.

## Evidence Reviewed

### Standalone Skills Repo

Path:

```text
~/dev/darwinian-harness-skills
```

Observed branch:

```text
feat/sync-card-skills-skill
```

Recent commits:

```text
042b329 test(skills): validate bundle and card inventory
471869e docs(skills): align workflows with current cli features
7d3000c feat(skills): include sync-card-skills in stable bundle
84bd9af feat(skills): add import-mcp-from-claude
```

Validation:

```bash
npm run validate:skills
```

Result:

```text
All skills valid (15 found)
```

This is the freshest functional skills branch.

### Darwinian Worker Submodule Snapshot

Path:

```text
~/dev/darwinian-harness/darwinian-harness-skills
```

Observed branch:

```text
remyjkim/rebrand-darwinian-mind-skills-task-52
```

Recent commits:

```text
1aa90cd chore(rebrand): rename skills package to darwinian mind
54b5f1a docs: refine harness card publishing workflows
```

Validation:

```bash
npm run validate:skills
```

Result:

```text
All skills valid (13 found)
```

This snapshot has partial singular Darwinian Mind naming, but it is not the best implementation base because it is missing later skills and workflow refinements.

### Reference CLI State

Reference repo:

```text
~/dev/darwinian-harness
```

Observed CLI:

```text
drwn - 0.2.2
```

Relevant current command surface:

```text
drwn card new
drwn card source add-persona|remove-persona
drwn card source add-belief|remove-belief
drwn card source add-memory|remove-memory
drwn card push --remote-visibility <private|internal|public|unknown>
drwn card push --unsafe-push-public
drwn mind list
drwn mind use
drwn mind clear
drwn write
drwn store seed
drwn store migrate-to-git
```

Current mind semantics from docs:

```text
activeMinds absent => all installed cards active
activeMinds []     => explicitly no active cards
activeMinds [...]  => explicit ordered active stack
```

Current write artifacts:

```text
.agents/drwn/generated/minds.json
.agents/drwn/generated/minds/<scope>/<name>/
.agents/drwn/generated/mind/
```

The plural `minds/` directory is the isolated per-installed-card bundle set. The singular `mind/` directory is the composed active-stack mount view.

## Existing Skill Design Pattern

The current 15 top-level skills are consistent and should keep their shape.

Common structure:

```text
frontmatter: name + description only
Purpose
Procedure
User-Ask Points
Wraps
Scope
Failure Modes
Related Skills
```

The design conventions are good:

- Skills map to workflows, not individual commands.
- Mutating skills name their blast radius.
- Read-only skills stay read-only.
- Procedures prefer `--dry-run --json` when the CLI supports it.
- Commands that lack dry-run are guarded by prose summary plus explicit approval.
- Skills redirect to sibling skills when the user intent crosses scope.
- `Wraps` lists the actual command families used.
- `Failure Modes` teach an agent when to stop instead of improvising.

These conventions are more valuable than the current names. The update should preserve the grammar and update the bodies.

## Current Portfolio Assessment

### Strong Boundaries To Preserve

| Current Skill | Boundary To Preserve |
| --- | --- |
| `bootstrap-project` | New project setup, starter recommendations, extension setup, first write. |
| `install-harness-project` | Clone/bootstrap from existing `card.lock`, without changing card intent. |
| `apply-harness-card` | Project card set mutation: apply/add/pin/remove/update/detach/trust. |
| `author-harness-card` | Editable card source lifecycle and local immutable publish. |
| `share-harness-card` | Git remote, push/fetch/clone, and catalog publication. |
| `materialize-harness` | Project or machine downstream generated state writes. |
| `inspect-harness` | Read-only state/provenance/drift inspection. |
| `repair-harness` | Mutating repair after diagnostics. |
| `manage-harness-library` | Machine inventory: skill bundles, loose skills, MCP definitions, catalogs. |
| `manage-defaults` | Machine defaults and curation. |
| `recommend-harness` | Read-only discovery and recommendations. |
| `support-harness` | Sessions, analyzer auth/upload, support exports, store support. |
| `import-mcp-from-claude` | Cross-tool MCP migration into drwn-managed inventory. |
| `sync-card-skills` | Refresh card-bundled skill copies from canonical skill sources. |
| `organize-workspace` | Honest experimental placeholder for future workspace scan behavior. |

### Gaps Against Current CLI

| Gap | Why It Matters |
| --- | --- |
| No active mind stack owner | `drwn mind list/use/clear` is now a core user workflow and should not be hidden inside card application or write. |
| Card authoring lacks persona/belief/memory procedures | A current Mind Card can contain persona, beliefs, and layered memory; skills must teach this source-authoring path. |
| Sharing lacks visibility gate behavior | Cards can contain private/internal/public mind content; unsafe public pushes need a deliberate approval path. |
| Materialization docs are not mind-aware | `drwn write` now writes per-mind and composed mind artifacts, not just downstream skills/MCP files. |
| Inspection/repair are not mind-aware | Diagnosing "why is this active?" now includes active stack state, generated `mind/`, generated `minds/`, and default-all semantics. |
| Support misses `store seed` and `store migrate-to-git` | Current store commands are not fully represented. |
| Standalone repo is not rebranded | Users searching for Darwinian Worker and Mind Cards will see stale Harness naming. |
| Stable card is still `@darwinian/harness-skills` | The package card advertises the old unit, even if some harness terms remain valid internally. |
| Sync script lacks `--check` | CI cannot fail on stale card-bundled copies without mutating the tree. |

## Usage Scenarios The Updated Skills Must Serve

### Scenario 1: New User Bootstraps A Project

User asks:

```text
Set up Darwinian Worker in this repo.
Recommend a starter card.
Apply this card and write the generated files.
```

Primary skill:

```text
bootstrap-project
```

Expected behavior after update:

- Still verifies `drwn`, `status`, and store health.
- Still owns `init`, starter discovery, extension setup, card apply, and first write.
- Should speak in Darwinian Worker / Mind Card terms.
- After applying cards and before/after write, should tell the user that absent `activeMinds` means all installed cards are active.
- Should optionally run `drwn mind list --json` after write when cards are applied, so the user sees installed and active minds.
- Should redirect to `manage-active-mind-stack` when the user asks to choose or switch an active stack.

Do not move normal stack switching into `bootstrap-project`. Bootstrap should introduce the concept and hand off.

### Scenario 2: Team Member Clones A Locked Project

User asks:

```text
I cloned this repo. Install the locked cards and make it ready.
```

Primary skill:

```text
install-harness-project
```

Expected behavior after update:

- Keep the lockfile-centered boundary.
- Run frozen/no-apply feasibility first.
- Fetch or refresh local card store only after approval.
- Preview write before downstream materialization.
- After write, run or recommend `drwn mind list --json`.
- Explain that locked cards are installed; active projection is controlled by `activeMinds`.
- If `activeMinds` is absent, explain default all-active.
- If `activeMinds` names missing cards, redirect to `repair-harness`.

### Scenario 3: User Applies Or Changes Project Cards

User asks:

```text
Apply this Mind Card.
Add this card.
Pin this version.
Remove a card.
Update cards.
```

Primary renamed skill:

```text
apply-mind-card
```

Expected behavior after update:

- Rename from `apply-harness-card`.
- Continue to own card set mutation.
- Explain that applying/removing cards changes the installed mind set.
- After card mutation, run `drwn write --dry-run --json` and include mind-related generated changes in the summary.
- If the project has an explicit active stack, warn when a newly added card will not project until included with `drwn mind use`.
- If the project has absent `activeMinds`, explain the default all-active behavior.
- Redirect to `manage-active-mind-stack` when the user's real intent is "switch which minds are active" rather than "change which cards are installed."

This prevents `apply-mind-card` from becoming the activation skill.

### Scenario 4: User Switches Context Without Changing Installed Cards

User asks:

```text
Use only the backend mind.
Layer base then frontend.
Clear all active minds.
What minds are active?
```

New primary skill:

```text
manage-active-mind-stack
```

Why this should be a new skill:

- The scope is project activation, not card installation.
- It mutates project config but not card lock intent.
- It has different mental model and failure modes from `apply-mind-card`.
- It is likely to be invoked directly and repeatedly.

Required coverage:

```text
drwn mind list --json
drwn mind use --json <names> ...
drwn mind clear --json
drwn write --dry-run --json
drwn write
```

Recommended behavior:

1. Run `drwn mind list --json`.
2. Summarize installed minds, current active stack, and whether the active stack is the default all-active state.
3. For `mind use`, confirm the exact ordered stack.
4. For `mind clear`, explain that installed bundles remain but active projection and composed `generated/mind/` are removed on next write.
5. Run the selected `drwn mind ... --json` command after approval. These commands do not have dry-run, so the approval step must be prose-based.
6. Preview downstream impact with `drwn write --dry-run --json`.
7. On approval, run `drwn write`.
8. Verify with `drwn mind list --json`, `drwn status --json`, and, when relevant, generated artifact inspection.

Failure modes:

- No project config: redirect to `bootstrap-project`.
- No installed minds: redirect to `apply-mind-card` or `install-harness-project`.
- Named mind not installed: show installed names and stop.
- User asks to install a new mind: redirect to `apply-mind-card`.
- User asks to edit mind content: redirect to `author-mind-card`.

### Scenario 5: User Authors A Rich Mind Card

User asks:

```text
Create a Mind Card.
Add a persona.
Add engineering beliefs.
Add private L6 memory.
Publish it.
```

Primary renamed skill:

```text
author-mind-card
```

Recommendation: patch this skill rather than adding a separate `author-mind-content` skill in the first implementation.

Reasoning:

- Persona, beliefs, and memory are source mutations on the same editable card source lifecycle.
- A separate authoring skill would overlap heavily with `author-mind-card` and cause routing ambiguity.
- The existing `author-harness-card` body is already long, but it has the right source lifecycle boundary and can absorb a dedicated mind-content section.
- If the skill becomes too long after implementation, split later using a clear delegation rule: `author-mind-card` for lifecycle/release, `author-mind-content` for content sections only. Do not start there unless routing pressure appears in practice.

Required coverage:

```text
drwn card source add-persona <card> <entry> --visibility <private|internal|public> --dry-run --json
drwn card source add-belief <card> <entry> --visibility <private|internal|public> --dry-run --json
drwn card source add-memory <card> <entry> --layer <l4|l5|l6> --visibility <private|internal|public> [--format md|jsonl|mixed] --dry-run --json
drwn card source remove-persona <card> <entry> [--keep-files] --dry-run --json
drwn card source remove-belief <card> <entry> [--keep-files] --dry-run --json
drwn card source remove-memory <card> <entry> --layer <l4|l5|l6> [--keep-files] --dry-run --json
drwn card source doctor <card> --json
drwn card publish <card>
drwn card validate <card>@<version> --json
```

Content authoring rules:

- Always require explicit visibility.
- Prefer `private` for raw L6 memory unless the user deliberately chooses otherwise.
- Explain that `--format jsonl` expects valid JSONL content before publish.
- Run `card source doctor` before publish.
- Test a rich card in a scratch project before publish when the user is preparing a real release.

### Scenario 6: User Shares A Mind Card

User asks:

```text
Push this card.
Publish it to a catalog.
Make it public.
```

Primary renamed skill:

```text
share-mind-card
```

Required coverage:

```text
drwn card push <name> --remote <remote>
drwn card push <name> --remote-visibility private|internal|public|unknown
drwn card push <name> --unsafe-push-public
drwn card catalog publish ...
drwn catalog validate ...
```

Required policy:

- Before push, inspect card content and strictest visibility.
- If persona/belief/memory content exists, classify the remote visibility.
- Never infer a network Git remote is public-safe without either remote visibility evidence or explicit user classification.
- Use `--unsafe-push-public` only after a second explicit approval that names the card visibility and remote visibility mismatch.
- For public catalogs, prefer HTTPS install URLs over SSH URLs.

This skill is the safety boundary for publication.

### Scenario 7: User Runs Routine Materialization

User asks:

```text
Write the generated files.
Sync the downstream state.
Update Claude/Codex/Cursor from the active stack.
```

Primary skill:

```text
materialize-harness
```

Expected behavior after update:

- Keep the generic harness/materialization name. This is not just cards or minds; it writes downstream tool state.
- Explain the generated mind artifacts:

```text
generated/minds/  => per-installed-mind bundles
generated/mind/   => composed active-stack view
```

- Summarize `drwn write --dry-run --json` changes in terms of skills, MCP, hooks, and mind outputs.
- If the user's intent is to switch active minds, redirect to `manage-active-mind-stack`.
- If the user's intent is only to inspect what would happen, redirect to `inspect-harness`.

### Scenario 8: User Diagnoses Or Repairs Mind Projection

User asks:

```text
Why is this skill active?
Why is this persona in generated/mind?
Why did clearing minds not remove the generated view?
Fix stale generated mind output.
```

Primary skills:

```text
inspect-harness
repair-harness
```

Expected inspection additions:

- `drwn mind list --json`
- `drwn status --explain`
- `drwn card status --explain`
- `drwn write --dry-run --json`
- Generated artifact checks for:

```text
.agents/drwn/generated/minds.json
.agents/drwn/generated/minds/<scope>/<name>/mind.json
.agents/drwn/generated/mind/mind.json
.agents/drwn/generated/mind/persona.md
```

Expected repair additions:

- Classify active stack mismatch separately from stale generated output.
- If explicit active stack excludes a card, do not "repair" by adding it automatically.
- If `mind clear` was intentional, generated `mind/` absence is expected after write.
- Use `drwn write --force` only for normal managed-region drift rules, with separate approval.

### Scenario 9: User Maintains Store Or Support Artifacts

User asks:

```text
Back up the store.
Seed the store from an archive.
Migrate old card dirs to Git-backed store.
Export sessions.
Upload sessions to the analyzer.
```

Primary skill:

```text
support-harness
```

Expected additions:

```text
drwn store seed --from <path> [--force]
drwn store migrate-to-git --dry-run --json
drwn store migrate-to-git --json
```

Recommended boundary:

- `store seed` is medium/high blast radius because it populates an empty store and can overwrite with `--force`.
- `migrate-to-git` should preview first and should be treated like a store maintenance operation, not general repair.
- If migration reveals corruption, redirect to `repair-harness`.

### Scenario 10: Skills Repo Maintainer Updates Bundled Card Copies

User asks:

```text
I changed skill docs. Refresh the card bundled copies and validate.
```

Primary skill:

```text
sync-card-skills
```

Expected behavior:

- Keep this skill. It is absent from the older rebrand submodule snapshot but useful in the standalone branch.
- Rebrand "Harness Card" to "Mind Card".
- Keep its CLI-source workflow centered on `drwn card source add-skill --replace`.
- Keep the local repo script `npm run sync:cards` for this package's direct copy model.
- Add repo-level `sync:cards -- --check` so maintainers can validate without mutation.

## Recommended Target Skill Portfolio

### Stable Skills

Target stable set:

```text
bootstrap-project
install-harness-project
apply-mind-card
manage-active-mind-stack
author-mind-card
sync-card-skills
share-mind-card
materialize-harness
inspect-harness
repair-harness
manage-harness-library
manage-defaults
recommend-harness
support-harness
import-mcp-from-claude
```

This is 15 stable skills if `organize-workspace` stays experimental.

Rationale:

- Add only one new workflow owner for the new mind activation surface.
- Preserve the useful latest standalone skills.
- Avoid creating overlapping authoring skills until real trigger ambiguity proves the split necessary.
- Keep `harness` in names where it means the general local harness layer, not the card unit.

### Experimental Skills

Keep:

```text
organize-workspace
```

It remains honest as long as `drwn scan` is a placeholder.

### Compatibility Aliases

If this repo has public users already invoking old skill IDs, consider a one-release compatibility lane:

```text
apply-harness-card    -> points users to apply-mind-card
author-harness-card   -> points users to author-mind-card
share-harness-card    -> points users to share-mind-card
```

However, do not include alias skills in the primary stable card unless compatibility is a real requirement. Alias skills increase trigger ambiguity. If included, their descriptions should say "Compatibility alias" and immediately redirect.

## Recommended Card Composition

### Primary Skills Card

The primary skills card should be renamed or supplemented.

Current standalone card:

```text
@darwinian/harness-skills
```

Recommended primary card:

```text
@darwinian/mind-skills
```

Contents:

```text
all stable skills except organize-workspace
```

This card remains a tools-only Mind Card. That is acceptable, but the docs should say so explicitly:

```text
This card installs Darwinian Worker operator skills. It does not itself carry persona, belief, or memory content.
```

### Compatibility Skills Card

If existing users depend on `@darwinian/harness-skills`, keep it temporarily as a compatibility card that includes the same stable skills or old alias wrappers. Mark it deprecated in docs when the replacement is ready.

### Rich Operator Mind Card

Do not overload the skills card with persona/belief/memory content.

Create a separate rich mind card, for example:

```text
@darwinian/operator-mind
```

Purpose:

- Demonstrate the canonical Mind Card model.
- Carry persona, beliefs, and memory guidance for operating the Darwinian Worker CLI.
- Include or depend on the operator skills as appropriate.

This preserves a clean separation:

```text
@darwinian/mind-skills    => tools-only operator skill bundle
@darwinian/operator-mind  => rich persona/belief/memory operator mind
```

The existing analysis in the CLI repo, `.ai/analyses/77_darwinian-operator-mind-card-investigation-and-strategy.md`, is the right starting point for this separate card.

## Recommended Implementation Sequence

### Phase 0: Choose The Base And Avoid Regression

Use this standalone repo branch as the base:

```text
feat/sync-card-skills-skill
```

Do not start from the submodule rebrand snapshot because it lacks newer skill coverage.

Port forward from the submodule rebrand:

- package/plugin/bundle identity
- README install refs
- `apply-harness-card` -> `apply-mind-card`
- `author-harness-card` -> `author-mind-card`
- `share-harness-card` -> `share-mind-card`
- Mind Card terminology

Preserve standalone-only newer work:

- `import-mcp-from-claude`
- `sync-card-skills`
- catalog publication in sharing
- expanded validation script
- current card inventory validation

### Phase 1: Rebrand Metadata And Card-Specific Skill IDs

Update:

```text
package.json
package-lock.json
VERSION
bundle.json
README.md
MAINTAINERS.md
CLAUDE.md
.claude-plugin/*
.codex-plugin/*
cards/README.md
cards/*/card.json
cards/*/package.json
skills/apply-harness-card -> skills/apply-mind-card
skills/author-harness-card -> skills/author-mind-card
skills/share-harness-card -> skills/share-mind-card
card-bundled copies
scripts/sync-card-skills.mjs
scripts/validate-skills.mjs
```

Keep names such as `inspect-harness`, `repair-harness`, and `materialize-harness` unless there is a deliberate broader renaming plan. In current docs, "harness" still describes the local control plane and generated state machinery.

### Phase 2: Add `manage-active-mind-stack`

Create:

```text
skills/manage-active-mind-stack/SKILL.md
```

Add to:

```text
bundle.json
primary stable card include list
sync-card-skills.mjs stable skill list
validate-skills inventory expectations
README skill table
Related Skills sections
```

Core procedure:

```text
drwn mind list --json
drwn mind use --json <names> ...
drwn mind clear --json
drwn write --dry-run --json
drwn write
```

### Phase 3: Patch Existing Skills For Mind Semantics

Patch:

```text
author-mind-card
share-mind-card
apply-mind-card
materialize-harness
inspect-harness
repair-harness
bootstrap-project
install-harness-project
recommend-harness
support-harness
sync-card-skills
import-mcp-from-claude
```

Minimum changes by skill:

| Skill | Required Change |
| --- | --- |
| `author-mind-card` | Add persona/belief/memory source authoring procedures, visibility rules, publish validation expectations, and scratch-project validation guidance. |
| `share-mind-card` | Add `--remote-visibility`, `--unsafe-push-public`, strictest visibility review, and public catalog URL guidance. |
| `apply-mind-card` | Explain installed minds versus active stack; warn when explicit stack excludes newly added cards. |
| `manage-active-mind-stack` | New owner for `mind list/use/clear`. |
| `materialize-harness` | Summarize per-mind and composed generated outputs during write previews. |
| `inspect-harness` | Include `mind list`, active stack, generated `minds.json`, generated `mind/mind.json`, and default-all semantics. |
| `repair-harness` | Add active-stack mismatch and stale composed mind repair paths. |
| `bootstrap-project` | Mention default all-active after applying cards; hand off stack selection. |
| `install-harness-project` | Verify active mind state after locked install/write. |
| `recommend-harness` | Recommend Mind Cards and explain whether follow-up is apply, stack switch, or authoring. |
| `support-harness` | Add `store seed` and `store migrate-to-git`. |
| `sync-card-skills` | Rebrand to Mind Card and keep source-copy workflow. |
| `import-mcp-from-claude` | Rebrand prose; keep MCP migration boundary. |

### Phase 4: Update Card Composition

Preferred:

```text
cards/mind-skills/card.json
cards/mind-skills/package.json
```

Then either:

- keep `cards/harness-skills` as compatibility, or
- rename it if there is no compatibility need.

The validation script should not hard-code one card name forever. Prefer a small declarative map, for example:

```js
const cardMaps = [
  { name: "mind-skills", lane: "stable", include: "stable" },
  { name: "workspace-experimental", lane: "experimental", include: ["organize-workspace"] },
];
```

This avoids repeating the current `harness-skills` assumption across sync and validation code.

### Phase 5: Add Better Validation And Smoke Tests

Add or extend:

```text
npm run validate:skills
npm run sync:cards -- --check
npm run validate:cards
npm run smoke:cli
```

Recommended checks:

1. Validate every top-level skill frontmatter.
2. Validate bundle inventory against skills directory.
3. Validate stable and experimental card include lists.
4. Verify card-bundled skill copies match top-level sources.
5. Validate cards through the current `drwn` CLI.
6. Run `npm pack --dry-run --json`.
7. Run a Bash smoke test in an isolated temp `HOME` and project.

Smoke test should exercise:

```text
drwn card new @test/operator --no-git
drwn card source add-persona @test/operator voice --visibility internal --dry-run --json
drwn card source add-persona @test/operator voice --visibility internal
drwn card source add-belief @test/operator engineering --visibility public
drwn card source add-memory @test/operator raw --layer l6 --visibility private --format jsonl
drwn card source doctor @test/operator --json
drwn card publish @test/operator
drwn init --non-interactive
drwn card apply @test/operator@<version>
drwn write --dry-run --json
drwn write
drwn mind list --json
drwn mind use --json @test/operator
drwn write
test -f .agents/drwn/generated/mind/mind.json
drwn mind clear --json
drwn write
test ! -e .agents/drwn/generated/mind
```

Use an environment variable such as `DRWN_BIN` to point the skills repo smoke tests at a local development CLI without adding a package dependency on the CLI repo.

## Testing Strategy

### Fast Local Checks

Run on every edit:

```bash
npm run lint:md
npm run validate:skills
npm run sync:cards -- --check
```

### CLI Integration Checks

Run before PR:

```bash
DRWN_BIN=~/dev/darwinian-harness/cli/index.ts npm run smoke:cli
```

If the smoke script invokes Bun directly, document that requirement.

### Card Validation

Run:

```bash
drwn card validate file:~/dev/darwinian-harness-skills/cards/mind-skills --json
drwn card validate file:~/dev/darwinian-harness-skills/cards/workspace-experimental --json
```

If a compatibility `harness-skills` card remains, validate it too.

### Package Validation

Run:

```bash
npm pack --dry-run --json
```

Then, in an isolated `HOME`, run:

```bash
drwn library add skill ~/dev/darwinian-harness-skills --json
drwn skills packages show darwinian-worker-skills --json
```

## Open Decisions

### Decision 1: Compatibility Aliases

Question:

```text
Should old skill IDs remain as compatibility aliases for one release?
```

Recommendation:

- If the package has meaningful external use, keep alias skills for one compatibility release but exclude them from the primary card if possible.
- If this is still effectively pre-public, rename cleanly and skip aliases.

### Decision 2: Stable Card Name

Question:

```text
Should @darwinian/harness-skills remain, or should @darwinian/mind-skills become the only stable card?
```

Recommendation:

- Create `@darwinian/mind-skills`.
- Keep `@darwinian/harness-skills` only as a compatibility card if needed.

### Decision 3: Separate `author-mind-content`

Question:

```text
Should persona/belief/memory authoring be its own skill?
```

Recommendation:

- Not in the first pass.
- Patch `author-mind-card`.
- Reconsider only if the final `author-mind-card` becomes too long or trigger ambiguity shows up in real use.

### Decision 4: Rich Operator Mind Card Timing

Question:

```text
Should @darwinian/operator-mind ship in the same PR as the skills update?
```

Recommendation:

- No, unless the PR is explicitly scoped to include it.
- First make the skills package current.
- Then create the rich operator card as a separate reviewable card-source task.

## Risks And Mitigations

| Risk | Mitigation |
| --- | --- |
| Rebrand port regresses later functional coverage | Start from standalone `feat/sync-card-skills-skill`; port rebrand forward; preserve 15-skill inventory. |
| Skill routing becomes ambiguous | Add only `manage-active-mind-stack`; patch existing author/share/apply/materialize skills rather than splitting too early. |
| Old Harness names linger in user-facing package surfaces | Use a targeted terminology scan after edits; allow generic "harness" only for control-plane concepts, not card-unit/product identity. |
| Unsafe card publication guidance | Make `share-mind-card` visibility classification mandatory before mind-content push. |
| Tests mutate the developer's real store | Smoke tests must run with isolated `HOME` or `AGENTS_DIR`; never use the real store for destructive tests. |
| Card-bundled skill copies drift | Add real `sync:cards -- --check`; validate copies in CI. |
| Rich operator card bloats tools-only skills card | Keep tools-only skills card separate from `@darwinian/operator-mind`. |

## Recommended Immediate Next Task

Draft and execute an implementation plan with this sequence:

1. Reconcile the standalone 15-skill branch with the Darwinian Worker rebrand.
2. Add `manage-active-mind-stack`.
3. Patch `author-mind-card`, `share-mind-card`, `apply-mind-card`, `materialize-harness`, `inspect-harness`, `repair-harness`, and `support-harness`.
4. Rename or supplement the stable card as `@darwinian/mind-skills`.
5. Add `sync:cards -- --check`, card validation scripts, and isolated CLI smoke tests.
6. Validate with lint, skills validation, card validation through current `drwn`, package dry-run, and the isolated mind-card Bash smoke.

This approach updates the repo with minimal conceptual churn while covering the core current Darwinian Worker CLI workflows.
