# Example Harness Cards

This directory contains minimal reference Harness Cards for documentation
purposes. These are not published cards and should not be treated as production
assets.

To author your own card, invoke `author-harness-card` or run
`drwn card new <name>` directly.

## minimal-card

A bare-bones card with one bundled skill and no MCP servers.

To try it locally, substitute `@your-handle` with your actual GitHub handle (or
any `@<scope>` you publish under) in both the directory layout and the card
manifest so the source directory matches `card.json`'s `name`. `drwn card new`
auto-derives the same handle from `gh api user` or `git config --global
github.user` for new authoring sources; for this static example you do the
substitution by hand.

```bash
HANDLE=@your-handle  # e.g., @junggyu
mkdir -p ~/.agents/drwn/sources/$HANDLE
cp -r examples/cards/minimal-card ~/.agents/drwn/sources/$HANDLE/minimal-card
sed -i.bak "s|@your-handle/|$HANDLE/|g" \
  ~/.agents/drwn/sources/$HANDLE/minimal-card/card.json \
  ~/.agents/drwn/sources/$HANDLE/minimal-card/skills/hello-world/SKILL.md
drwn card source doctor $HANDLE/minimal-card --json
drwn card publish $HANDLE/minimal-card
cd ~/sandbox-project
drwn apply $HANDLE/minimal-card@0.1.0
drwn write --dry-run --json
drwn write
```
