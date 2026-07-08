# Reusable Mind Cards

This repo ships real Mind Card sources in addition to the plugin-distributed
skills.

## Cards

| Card | Purpose | Contents |
| --- | --- | --- |
| `@darwinian/operator` | Primary card for operating Darwinian Worker through `drwn` | Stable workflow skills, mind-stack skills, MCP import, and card source sync |
| `@darwinian/base-mind` | BaseMind card for operating mind composition itself | Persona, public beliefs, and `manage-active-mind-stack`, `author-mind-content`, `audit-mind-visibility` |
| `@darwinian/workspace-experimental` | Explicitly experimental card for the future workspace organizer stub | `organize-workspace` |

## Why Multiple Cards

`@darwinian/operator` is the primary card most users should apply when they
want the Darwinian Worker operator skills.

`@darwinian/base-mind` carries richer mind content and stays intentionally
small: it includes only the persona, beliefs, and skills needed to activate,
author, and audit mind cards.

`organize-workspace` is split into its own experimental card because it remains
a future placeholder and should not make the main card look more complete than
it is.

## Development Model

The canonical skill sources live under [`../skills`](../skills). The cards
bundle copied skill directories under their own `skills/` trees so they can be
published or applied as self-contained card sources.

Whenever a canonical skill changes, re-sync the card copies:

```bash
npm run sync:cards
```

Check for drift without modifying files:

```bash
npm run sync:cards -- --check
```

## Local Dogfooding

Use `file:` refs during local development:

```bash
drwn card apply file:/path/to/darwinian-worker-skills/cards/operator
drwn write --dry-run --json
```

The `file:` path points directly at the card source directory that contains
`card.json`.

## Publishing Later

If you want a normal published local-store card instead of a `file:` ref:

1. Copy the card source into `~/.agents/drwn/sources/...`
2. Run `drwn card source doctor <name> --json`
3. Run `drwn card publish <name>`
4. Validate with `drwn card validate <name>@<version> --json`
5. Apply the published ref with `drwn card apply @darwinian/operator@<version>`
