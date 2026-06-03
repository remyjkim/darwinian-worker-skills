# Reusable Harness Cards

This repo ships real card sources in addition to the plugin-distributed skills.

## Cards

| Card | Purpose | Contents |
| --- | --- | --- |
| `@darwinian/harness-skills` | Stable reusable card for the current-lane skills | `bootstrap-project`, `apply-harness-card`, `author-harness-card`, `install-harness-project`, `inspect-harness`, `materialize-harness`, `manage-harness-library`, `repair-harness`, `manage-defaults`, `recommend-harness`, `share-harness-card`, `support-harness` |
| `@darwinian/workspace-experimental` | Explicitly experimental card for the future workspace organizer stub | `organize-workspace` |

## Why Two Cards

The stable card bundles the skills that map to the live `drwn` CLI.
`organize-workspace` is intentionally split out because it remains a future
placeholder and should not make the main card look more complete than it is.

## Development Model

The canonical skill sources live under [`../skills`](../skills). The cards
bundle copied skill directories under their own `skills/` trees so they can be
published or applied as self-contained card sources.

Whenever a canonical skill changes, re-sync the card copies:

```bash
npm run sync:cards
```

## Local Dogfooding

Use `file:` refs during local development:

```bash
drwn apply file:~/dev/darwinian-harness-skills/cards/harness-skills
drwn write --dry-run --json
```

The `file:` path points directly at the card source directory that contains
`card.json`.

## Publishing Later

If you want a normal published local-store card instead of a `file:` ref:

1. Copy the card source into `~/.agents/drwn/sources/...`
2. Run `drwn card source doctor <name> --json`
3. Run `drwn card publish <name>`
4. Apply the published ref with `drwn apply @darwinian/harness-skills@<version>`
