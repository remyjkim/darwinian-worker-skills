# Working In darwinian-minds-skills

This repo distributes agent skills. Most content is Markdown, plus a small
validation script and distribution manifests.

## What You Can Change Safely

- `skills/<name>/SKILL.md`
- `README.md`, `MAINTAINERS.md`
- `.markdownlint.yaml`, `.editorconfig`, `.gitignore`
- `.github/workflows/*.yml`

## What Requires Extra Care

- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `.codex-plugin/plugin.json`
- `VERSION`

Renaming the `darwinian` plugin namespace breaks user-facing invocation paths
such as `/darwinian:bootstrap-project`.

## What Not To Do

- Do not add MCP servers, hooks, or slash commands at the plugin level. This
  repo is intentionally skills-first.
- Do not synthesize draft card manifests inside `recommend-harness`.
- Do not invoke mutating `drwn` commands from `inspect-harness` or
  `recommend-harness`.

## Authoritative drwn Surface

The companion CLI is Darwinian Minds. When available locally, use the sibling
checkout at `~/dev/darwinian-harness`. Otherwise use the
published CLI docs as the authority.

## Common Edits

- Adjust a skill procedure, then run `npm run lint:md` and
  `npm run validate:skills`.
- After changing any canonical skill under `skills/`, run `npm run sync:cards`
  so the bundled card copies under `cards/` stay aligned.
- Add a skill by creating `skills/<new-name>/SKILL.md`, updating the README
  table, and then validating again.
- Coordinate breaking CLI-surface changes with the Darwinian Minds CLI first;
  do not silently workaround them here.
