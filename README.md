# Darwinian Minds Skills

Agent skills and Mind Card content for operating Darwinian Minds through the
`drwn` CLI in Claude Code, Codex, Cursor, and other agentic environments.

The package currently ships 21 top-level skills:

- 17 primary workflow skills for project setup, install, downstream
  materialization, Mind Cards, library/defaults, diagnostics, support, repair,
  source sync, MCP import, recommendations, and mind-stack operations.
- 3 compatibility aliases for the previous harness-card skill names.
- 1 future-lane workspace organizer stub.

Distributed via Claude Code plugin marketplace, Codex plugin / skill install
surfaces, Vercel `npx skills add`, and the `drwn` package-backed skill bundle
flow.

## What's In This Repo

| Skill | Purpose | Scope | Lane |
| --- | --- | --- | --- |
| `bootstrap-project` | Initialize a project, enable extensions, apply starter cards | project | primary |
| `apply-mind-card` | Apply, pin, update, remove, detach, inspect Mind Cards | project | primary |
| `author-mind-card` | Create, publish, diff, deprecate reusable Mind Cards | card source | primary |
| `share-mind-card` | Push, fetch, clone, manage remotes, publish cards to catalogs | store + remote + catalog | primary |
| `manage-active-mind-stack` | List, switch, stack, or clear active minds | project | primary |
| `author-mind-content` | Add/remove persona, beliefs, and memory in card sources | card source | primary |
| `audit-mind-visibility` | Read-only visibility audit before push or publish | project + card source | primary |
| `sync-card-skills` | Refresh a card source's bundled skills from canonical sources | card source | primary |
| `import-mcp-from-claude` | Port Claude Code MCP entries into the Darwinian Minds library | project + machine | primary |
| `install-harness-project` | Bootstrap a cloned project from locked cards | project + store | primary |
| `inspect-harness` | Read-only inspection of state, minds, provenance, and drift | project | primary |
| `materialize-harness` | Write effective Darwinian Minds state into downstream agent tools | project or machine | primary |
| `manage-harness-library` | Manage reusable inventory, package bundles, MCPs, and catalogs | machine | primary |
| `repair-harness` | Guide safe repair of drift, locks, generated files, and legacy layout | project + machine | primary |
| `manage-defaults` | Machine-wide defaults and curated publication layer | machine | primary |
| `recommend-harness` | Suggest Mind Cards, extensions, skills, MCPs without mutation | project | primary |
| `support-harness` | Export support artifacts and run explicit store maintenance | project + machine | primary |
| `apply-harness-card` | Compatibility alias for `apply-mind-card` | project | compatibility |
| `author-harness-card` | Compatibility alias for `author-mind-card` | card source | compatibility |
| `share-harness-card` | Compatibility alias for `share-mind-card` | store + remote + catalog | compatibility |
| `organize-workspace` | Future cross-project organizer stub | workspace | experimental |

Each mutating skill is a thin wrapper over `drwn` commands with explicit
user-ask checkpoints before consequential writes.

## Reusable Mind Cards

This repo ships real card sources under [cards](./cards):

- `@darwinian/mind-skills`: primary tools-only card for the current workflow
  skills.
- `@darwinian/base-mind`: BaseMind card with persona, beliefs, and three mind
  operator skills.
- `@darwinian/harness-skills`: compatibility tools card for one release.
- `@darwinian/workspace-experimental`: explicit experimental card for the
  `organize-workspace` stub.

During local development, apply the primary tools card directly with a
`file:` ref:

```bash
drwn card apply file:/path/to/darwinian-minds-skills/cards/mind-skills
drwn write --dry-run --json
```

After editing canonical skills under `skills/`, refresh card-bundled copies:

```bash
npm run sync:cards
```

## Prerequisites

- `drwn` installed and on PATH, or a repo-local CLI supplied with `DRWN_BIN`
- One of: Claude Code, Codex CLI, Cursor, or another runtime supported by
  `npx skills add`

## Install

### Darwinian Minds Local Library

```bash
drwn library add skill /path/to/darwinian-minds-skills
drwn skills packages show darwinian-minds-skills
drwn add skill inspect-harness --dry-run --json
```

Use `drwn add skill <name>` for one project, or
`drwn library defaults add skill <name>` for a machine-wide default.

### Claude Code

```bash
/plugin marketplace add remyjkim/darwinian-minds-skills
/plugin install darwinian@darwinian-minds-skills
```

Then invoke any skill with `/darwinian:<skill-name>`, for example
`/darwinian:bootstrap-project`.

### Codex CLI

```bash
codex plugin marketplace add remyjkim/darwinian-minds-skills
codex plugin install darwinian
```

### Codex Single Skill

Inside a Codex session:

```text
$skill-installer https://github.com/remyjkim/darwinian-minds-skills/tree/main/skills/<skill-name>
```

### Vercel `npx skills add`

```bash
npx skills add remyjkim/darwinian-minds-skills
```

Use `--agent <agent>` to target a specific runtime and `-g` for a global
install when supported.

## Safety Contract

Every mutating skill follows the same pattern:

1. Inspect current state via `drwn status`, `drwn doctor`, or the relevant
   read-only card/defaults/mind command.
2. Declare scope explicitly: project, machine, card source, store, remote, or
   downstream generated state.
3. Preview with `--dry-run --json` where `drwn` supports it, or describe the
   mutation plainly when it does not.
4. Ask for user approval before mutation.
5. Run the real command.
6. Verify the result with a follow-up read-only command.

`inspect-harness`, `recommend-harness`, and `audit-mind-visibility` are
strictly read-only.

## Examples

A reference Mind Card lives under [examples/cards](./examples/cards). It is a
documentation example only, not a published card.

## Development

```bash
npm install
npm run sync:cards
npm run sync:cards -- --check
npm run check:identity
npm run lint:md
npm run validate:skills
DRWN_BIN="bun ~/dev/darwinian-minds/cli/index.ts" npm run validate:cards
DRWN_BIN="bun ~/dev/darwinian-minds/cli/index.ts" npm run smoke:cli
```

## Compatibility

- `drwn` CLI v0.x
- `drwn library add skill` bundle schema v1
- Claude Code current plugin system
- Codex plugin / skill install surfaces
- Other runtimes via `npx skills add`
- Legacy `apply-harness-card`, `author-harness-card`, and
  `share-harness-card` aliases for one compatibility release

Installation commands outside Claude Code should be smoke-tested before a
public release because those distribution surfaces evolve independently.

## Contributing

See [MAINTAINERS.md](./MAINTAINERS.md) for review and release conventions.

## License

MIT. See [LICENSE](./LICENSE).
