# Reusable Cards

This repository ships self-contained Card sources in addition to standalone
skills.

| Card | Purpose |
| --- | --- |
| `@darwinian/operator` | Eight Worker, Card, inventory, and machine capability skills |
| `@darwinian/base-mind` | Dedicated base runtime content outside Operator |
| `@darwinian/workspace-experimental` | Experimental workspace organization skill |

Canonical skill sources live under [`../skills`](../skills). Generated Card
copies are synchronized with:

```bash
npm run sync:cards
npm run sync:cards -- --check
```

For local development, publish a copied editable source and use the immutable
ref through the current project commands:

```bash
drwn card source doctor @scope/operator --json
drwn card publish @scope/operator
drwn use @scope/operator@2.0.0 --dry-run
drwn write --dry-run --json
```

The Operator source is a capability Card. A project may include it in a Worker
Blueprint when project behavior depends on these capabilities explicitly.
