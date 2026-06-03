# Example Harness Cards

This directory contains minimal reference Harness Cards for documentation
purposes. These are not published cards and should not be treated as production
assets.

To author your own card, invoke `author-harness-card` or run
`drwn card new <name>` directly.

## minimal-card

A bare-bones card with one bundled skill and no MCP servers.

To try it locally:

```bash
mkdir -p ~/.agents/drwn/sources/@me
cp -r examples/cards/minimal-card ~/.agents/drwn/sources/@me/minimal-card
drwn card source doctor @me/minimal-card --json
drwn card publish @me/minimal-card
cd ~/sandbox-project
drwn apply @me/minimal-card@0.1.0
drwn write --dry-run --json
drwn write
```
