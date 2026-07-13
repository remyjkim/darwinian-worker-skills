# Darwinian Worker Skills

Agent skills for operating Darwinian Worker through the `drwn` CLI in Claude
Code, Codex, Cursor, and other compatible environments.

## Operator Card

`@darwinian/operator` is the primary Worker/Card operations package. Version
`2.0.0` contains exactly eight skills:

| Skill | Responsibility |
| --- | --- |
| `bootstrap-project` | Initialize or hydrate a locked project |
| `manage-project-worker` | Manage roots, selection, project capabilities, and projection |
| `inspect-worker` | Inspect Worker, Card, capability, and ownership state |
| `repair-worker` | Repair locks, sources, registrations, and projection drift |
| `author-card` | Author capability Cards and Worker Blueprints |
| `share-card` | Manage Card remotes, immutable refs, and catalogs |
| `manage-machine-inventory` | Manage standalone skill packages and MCP records |
| `manage-machine-capabilities` | Manage and project machine capability intent |

The Operator Card intentionally excludes optional runtime-specific tooling.
Those capabilities remain in dedicated packages and Cards.

## Other Content

- `@darwinian/base-mind` carries the dedicated base runtime content.
- `@darwinian/workspace-experimental` carries the experimental
  `organize-workspace` skill.
- Standalone skills outside Operator remain installable inventory but are not
  activated by the Operator Card.

Canonical skills live under [`skills`](./skills). Self-contained Card sources
under [`cards`](./cards) contain generated copies. After canonical changes,
run:

```bash
npm run sync:cards
npm run sync:cards -- --check
```

## Install

### Darwinian Worker Inventory

Install the package as inactive standalone inventory:

```bash
drwn machine skill install /path/to/darwinian-worker-skills --json
drwn machine skill show --package darwinian-worker-skills --json
```

Activate one standalone skill explicitly at machine scope:

```bash
drwn machine skill enable inspect-worker --dry-run --json
drwn machine skill enable inspect-worker
drwn write --root --dry-run --json
```

Projects declare their own Worker and capability intent; machine activation is
not inherited into project declarations.

### Claude Code

```text
/plugin marketplace add remyjkim/darwinian-worker-skills
/plugin install darwinian@darwinian-worker-skills
```

Invoke a skill with `/darwinian:<skill-name>`.

### Codex CLI

```bash
codex plugin marketplace add remyjkim/darwinian-worker-skills
codex plugin install darwinian
```

### Single Skill

Inside a Codex session:

```text
$skill-installer https://github.com/remyjkim/darwinian-worker-skills/tree/main/skills/<skill-name>
```

Other supported agents can install from the repository with:

```bash
npx skills add remyjkim/darwinian-worker-skills
```

## Safety Contract

Mutating skills follow one sequence:

1. Inspect current state.
2. Declare project, machine, Card source, remote, or catalog scope.
3. Preview with `--dry-run --json` where supported.
4. Request approval before mutation.
5. Apply one coherent mutation.
6. Verify with read-only status or diagnostics.

The skills do not hand-edit supported config, lock, ownership, or generated
projection files.

## Development

```bash
npm install
npm run test:operator-contract
npm run sync:cards
npm run sync:cards -- --check
npm run check:identity
npm run lint:md
npm run validate:skills
DRWN_BIN="bun ~/dev/darwinian-minds/cli/index.ts" npm run validate:cards
DRWN_BIN="bun ~/dev/darwinian-minds/cli/index.ts" npm run smoke:cli
```

## Compatibility

- Operator Card `2.0.0` requires `drwn` `0.9.0` or newer.
- Root skill bundle schema version 1.
- Claude Code and Codex plugin manifests are versioned with the root package.

See [MAINTAINERS.md](./MAINTAINERS.md) for release rules.

## License

MIT. See [LICENSE](./LICENSE).
