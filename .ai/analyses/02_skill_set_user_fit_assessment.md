# Darwinian Harness Skills User-Fit Assessment

**Date**: 2026-06-03  
**Target repo**: `~/dev/darwinian-harness-skills`  
**Reference CLI repo**: `~/dev/darwinian-harness`  
**Purpose**: Assess whether the current skills are the most useful and
well-scoped public skill set for Darwinian Harness users.

**Implementation update**: The recommended portfolio expansion has been applied
in this repo. The stable lane now contains twelve workflow skills:
`bootstrap-project`, `apply-harness-card`, `author-harness-card`,
`install-harness-project`, `inspect-harness`, `materialize-harness`,
`manage-harness-library`, `repair-harness`, `manage-defaults`,
`recommend-harness`, `share-harness-card`, and `support-harness`.
`organize-workspace` remains experimental.

## Executive Summary

The current skill set is a strong stable-lane MVP, but it is not yet the most
ideal public skill portfolio for the workflows described by the local knowledge
docs.

The existing stable skills cover the core lifecycle:

- new project setup
- card consumption
- card authoring
- inspection
- repair
- machine defaults
- recommendation and discovery

That is the correct center of gravity. The skill set is also appropriately
conservative: read-only skills remain read-only, mutating skills require
approval, and the stable card excludes the workspace placeholder.

The gap is that several high-value user workflows called out by the knowledge
docs do not have a clear skill owner:

- bootstrapping a cloned project from `card.lock` with `drwn install`
- routine downstream materialization with targeted `drwn write` / `drwn mcp write`
- sharing cards through Git remotes with `card remote`, `push`, `fetch`, and
  `clone`
- managing card catalogs before `drwn search card`
- exporting support artifacts and session logs
- direct project-level addition of individual skills and MCP servers

Verdict: **keep the current core, but expand and sharpen it before treating the
package as the ideal user-facing portfolio**.

## Source Basis

This assessment used the local knowledge docs rather than external assumptions:

- [`01_agents-cli-usage-guide.md`](../../../darwinian-harness/.ai/knowledges/01_agents-cli-usage-guide.md)
- [`02_per-project-config-guide.md`](../../../darwinian-harness/.ai/knowledges/02_per-project-config-guide.md)
- [`03_npm-skill-bundles-guide.md`](../../../darwinian-harness/.ai/knowledges/03_npm-skill-bundles-guide.md)
- [`09_harness-cards-manual-test-guide.md`](../../../darwinian-harness/.ai/knowledges/09_harness-cards-manual-test-guide.md)
- [`10_drwn-cli-architecture.md`](../../../darwinian-harness/.ai/knowledges/10_drwn-cli-architecture.md)

Reviewed target repo surfaces:

- `README.md`
- `bundle.json`
- `skills/*/SKILL.md`
- `cards/harness-skills`
- `cards/workspace-experimental`

## Assessment Criteria

The ideal public skill set should satisfy six criteria:

1. **Workflow-shaped**, not command-shaped. A skill should map to a user intent
   such as "bootstrap this clone" or "publish this card", not merely expose one
   subcommand.
2. **Grounded in shipped CLI behavior**. Stable skills should wrap implemented
   commands, not planned concepts.
3. **Clear blast-radius boundaries**. Project, machine, store, card source, and
   downstream write effects should be separated enough that an agent can ask for
   the right approval.
4. **Safe by default**. Read-only inspection should be separated from mutation;
   mutation should prefer `--dry-run --json` where available.
5. **Discoverable for normal language asks**. Skill names and descriptions
   should match how users ask for help.
6. **Distribution-compatible**. The package-backed bundle, cards, and plugin
   surfaces should expose the same stable/experimental intent.

## Current Skills

| Skill | Current fit | Assessment |
| --- | --- | --- |
| `bootstrap-project` | New project initialization and optional extension setup | Keep. It owns first-run setup well, but should not become the catch-all for cloned projects or routine writes. |
| `apply-harness-card` | Project card set management | Keep. It cleanly owns card consumption, but does not cover `install` for cloned projects. |
| `author-harness-card` | Local card source lifecycle | Keep. It now tracks `drwn card source ...`, but should either grow or delegate Git remote sharing. |
| `inspect-harness` | Read-only state and provenance | Keep. It is correctly scoped and likely one of the highest-value user skills. |
| `repair-harness` | Drift, outdated locks, legacy layout | Keep. It is appropriately high-blast-radius and approval-gated. |
| `manage-defaults` | Machine defaults, local library, curation | Keep but broaden or rename. The description already includes library work, but the name undersells package and catalog management. |
| `recommend-harness` | Read-only recommendation and discovery | Keep. It fits the search/catalog model, but depends on catalog management being findable elsewhere. |
| `organize-workspace` | Future workspace organizer placeholder | Keep only as experimental or remove from public bundle. It is honest, but not broadly useful until `drwn scan` is implemented. |

## Workflow Coverage Matrix

| CLI / knowledge-doc workflow | Current owner | Coverage | Recommendation |
| --- | --- | --- | --- |
| First-run sequence: `status`, `skills list`, `mcp list`, `write --dry-run`, `write` | `bootstrap-project`, `inspect-harness` | Partial | Add a dedicated materialization skill for routine writes. |
| Project initialization with `drwn init` | `bootstrap-project` | Good | Keep. |
| Project-specific skill or MCP add with `drwn add skill` / `drwn add mcp` | `bootstrap-project`, `recommend-harness` | Partial | Add explicit procedure coverage, likely in a project inventory/materialization skill. |
| Applying, pinning, updating, removing, detaching cards | `apply-harness-card` | Good | Keep. |
| Cloned project bootstrap with `drwn install --no-apply`, `--frozen`, `--json` | None | Missing | Add a stable `install-harness-project` skill. |
| Card source creation and source mutation | `author-harness-card` | Good | Keep current source-authoring model. |
| Card sharing over Git remotes | `author-harness-card` only partially | Missing | Add `share-harness-card` or extend authoring with a clear sharing section. |
| Card catalog registration and refresh | None | Missing | Extend `manage-defaults` or add `manage-harness-library`. |
| Card, skill, and MCP search | `recommend-harness`, `bootstrap-project` | Good | Keep. |
| Package-backed skill bundle install/list/show | `manage-defaults` | Partial | Add `drwn skills packages list/show` and clarify availability vs curation. |
| Machine defaults and curation | `manage-defaults` | Good | Keep. |
| Extension setup/status/doctor | `bootstrap-project`, `inspect-harness`, `repair-harness` | Partial | Consider a `setup-harness-extension` skill if extension setup is common. |
| Store status and migration | `inspect-harness`, `repair-harness` | Good for migration | Add support coverage for verify/export/gc if public support workflows matter. |
| Session export with `drwn export sessions` | None | Missing | Add `export-harness-context` or `support-harness`. |
| Workspace scan / organizer | `organize-workspace` | Correctly deferred | Keep experimental until `drwn scan` is real. |

## User Persona Fit

### New Solo User

Most likely asks:

- "set up Darwinian Harness in this repo"
- "recommend cards for this project"
- "apply this card"
- "why is this skill active?"
- "write Codex/Claude files"

Current fit is good, but routine write requests are scattered across several
skills. A user who only wants "sync my generated files" should not have to
enter `repair-harness`, because repair implies something is wrong.

Recommendation: add `materialize-harness`.

### Team Member Cloning A Project

Most likely asks:

- "I cloned this repo; set up the harness"
- "install locked cards"
- "verify this lockfile without changing it"
- "run this in CI"

This is a first-class workflow in the CLI docs, but no current skill owns it.
`bootstrap-project` initializes new project config, while `apply-harness-card`
changes card intent. A clone with a committed `card.lock` needs a different
path: `drwn install --no-apply`, inspect, dry-run write, then `drwn install` or
`drwn install --frozen`.

Recommendation: add `install-harness-project`.

### Card Author Or Team Maintainer

Most likely asks:

- "create a reusable backend card"
- "capture this project as a card"
- "publish a new card version"
- "push this card to a team Git remote"
- "fetch or clone a teammate's card"

The local source lifecycle is covered well after the `card source` rewrite.
The missing user-facing piece is sharing. Git remotes have authentication,
network, and collision failure modes, so this should either be a distinct skill
or a clearly separated section inside `author-harness-card`.

Recommendation: add `share-harness-card` unless skill count is a stronger
concern than trigger precision.

### Machine Owner Or Power User

Most likely asks:

- "install this skill bundle"
- "make this skill a default everywhere"
- "register this MCP server"
- "add a team card catalog"
- "show what packages are installed"

`manage-defaults` has the right blast-radius warning, but the name is too narrow
for library, bundle, and catalog workflows. The knowledge docs distinguish
library, defaults, catalogs, and curation; users will need that distinction.

Recommendation: either broaden `manage-defaults` substantially or introduce
`manage-harness-library` and keep `manage-defaults` as the machine-defaults
subset.

### Diagnoser / Support Workflow

Most likely asks:

- "why is this broken?"
- "fix drift"
- "export logs for debugging"
- "back up the drwn store"
- "verify the store"

Inspection and repair are strong. Export and support artifact workflows are not
represented even though the architecture doc lists `export sessions` and store
maintenance commands. These should not be mixed into `repair-harness`, because
exporting diagnostics is a different intent from mutating state.

Recommendation: add `support-harness` or `export-harness-context`.

## Recommended Target Portfolio

### Stable Skills To Keep

- `inspect-harness`
- `repair-harness`
- `bootstrap-project`
- `recommend-harness`
- `apply-harness-card`
- `author-harness-card`
- `manage-defaults`

### Stable Skills To Add

#### `install-harness-project`

Purpose: bootstrap a cloned project that already has `.agents/drwn/card.lock`.

Wraps:

- `drwn install --no-apply --json`
- `drwn install --frozen --json`
- `drwn write --dry-run --json`
- `drwn install --json`
- `drwn status --json`
- `drwn doctor --json`

Why it matters:

The knowledge docs make cloned-project bootstrap a common workflow. It has
different safety properties from `init` and card mutation.

#### `materialize-harness`

Purpose: routine downstream sync into Claude, Codex, Cursor, skills, and MCP
state.

Wraps:

- `drwn write --dry-run --json`
- `drwn write`
- `drwn write --target=<target>`
- `drwn write --skills-only`
- `drwn write --mcp-only`
- `drwn mcp write --dry-run`
- `drwn mcp write`

Why it matters:

`write` is the primary materialization command. Today it is embedded in several
skills, but no skill owns a plain "sync generated harness state" ask.

#### `share-harness-card`

Purpose: team distribution of cards through Git-backed remotes.

Wraps:

- `drwn card remote list`
- `drwn card remote add`
- `drwn card remote set`
- `drwn card remote remove`
- `drwn card push`
- `drwn card fetch`
- `drwn card clone`
- `drwn card validate`

Why it matters:

Team sharing is a documented common workflow. It has Git auth, remote, network,
name-collision, and version-selection concerns that deserve explicit handling.

#### `support-harness`

Purpose: collect support context and run low-risk store checks without
conflating support export with repair.

Wraps:

- `drwn export sessions --dry-run`
- `drwn export sessions`
- `drwn store status --json`
- `drwn store verify`
- `drwn store export --out <path>`
- `drwn store gc`

Why it matters:

Support and backup workflows are implemented in the CLI but invisible in the
current skills.

### Stable Skill To Broaden Or Split

#### `manage-defaults`

Minimum additions:

- `drwn skills packages list --json`
- `drwn skills packages show <package-name> --json`
- `drwn library catalog list`
- `drwn library catalog add <url>`
- `drwn library catalog refresh [scope] --json`
- `drwn library catalog remove <scope-or-url>`

Better long-term shape:

- `manage-harness-library`: packages, library inventory, MCP definitions,
  catalogs
- `manage-defaults`: defaults and curation only

The split is clearer, but it introduces another stable skill. If minimizing
surface area is more important, broaden `manage-defaults` now and revisit the
name after users exercise it.

### Optional Stable Skill

#### `setup-harness-extension`

Purpose: dedicated extension setup for Parallel, Beads, and MarkItDown.

This can stay inside `bootstrap-project` for now, but a dedicated skill becomes
worthwhile if users often ask for extension setup after initial project
bootstrap.

### Experimental Skill

#### `organize-workspace`

Current status is correct only if it remains clearly experimental.

Because `drwn scan` is a placeholder, this skill is not broadly applicable yet.
It should not be included in the stable card and should not be recommended by
default. Keeping it in an experimental card is acceptable. Including it in the
package-backed bundle is tolerable because its `bundle.json` scope is
`experimental`, but it may still create user confusion in inventory views.

## Existing Skill Adjustments

### `apply-harness-card`

Add a short caveat from the per-project config guide:

Cards pin harness state, not the surrounding toolchain, OS, Claude/Codex/Cursor
versions, or unpinned MCP runtime package resolution.

### `author-harness-card`

Add or delegate:

- `drwn card new --from-project`
- remote sharing commands, if `share-harness-card` is not added
- quality-signal guidance for `stability`, `lastValidatedWith`, and
  `testStatusBadge`

### `recommend-harness`

When recommending catalog-backed cards, include whether the needed catalog is
already registered. If not, direct users to the catalog-management flow before
claiming the card is installable.

### `bootstrap-project`

Keep focused on initialization. Do not make it the owner of cloned-project
install, support export, or broad library management.

## Distribution Implications

For the implemented stable additions:

- `bundle.json` should include the new stable skills with `scope: "shared"`.
- `cards/harness-skills` should sync the new stable skills.
- `cards/workspace-experimental` should remain the only card containing
  `organize-workspace`.
- README should describe the twelve current-lane skills.
- Any plugin manifest descriptions should avoid a hard-coded count unless
  release automation keeps it accurate.

## Test Expectations

Before treating the portfolio as user-ready, run:

```bash
npm run sync:cards
npm run lint:md
npm run validate:skills
drwn card validate file:~/dev/darwinian-harness-skills/cards/harness-skills --json
drwn card validate file:~/dev/darwinian-harness-skills/cards/workspace-experimental --json
drwn library add skill ~/dev/darwinian-harness-skills --json
drwn skills packages show darwinian-harness-skills --json
```

For new workflow skills, also add sandbox manual checks based on
`09_harness-cards-manual-test-guide.md`:

- cloned-project install with `--no-apply` and `--frozen`
- card remote add/push/fetch/clone against a disposable Git remote
- catalog add/search/remove against a disposable catalog repo
- targeted writes with `--skills-only`, `--mcp-only`, and `--target`
- session export dry-run and archive validation

## Final Assessment

The original seven-skill set was **well chosen for the first stable lane**, but
was not yet the most ideal or comprehensive user-facing set.

The implemented portfolio is:

- keep the original seven stable skills
- add `install-harness-project`
- add `materialize-harness`
- add `share-harness-card`
- add `support-harness`
- split library/catalog work into `manage-harness-library`
- keep `organize-workspace` experimental until `drwn scan` is implemented

This keeps the skill model workflow-oriented, maps directly to shipped CLI
surfaces, improves coverage for real team usage, and avoids presenting
future-only behavior as stable user functionality.
