# Maintainers Guide

## Release Process

Releases are SemVer and keyed off the root `VERSION` file.

### Cutting A Release

1. Update `VERSION`.
2. Update version fields in `.claude-plugin/plugin.json`,
   `.claude-plugin/marketplace.json`, `.codex-plugin/plugin.json`, and
   `package.json`.
3. Run `npm install --package-lock-only --ignore-scripts`.
4. Update `bundle.json` so `bundleName`, `version`, and skill entries match
   the package.
5. Run `npm run sync:cards`.
6. Open a release PR.
7. On merge to `main`, `create-tag.yml` tags `v<version>`.
8. `publish-release.yml` creates a GitHub Release.

### Manual Checks Before Release

- `npm run sync:cards`
- `npm run sync:cards -- --check`
- `npm run check:identity`
- `npm run lint:md`
- `npm run validate:skills`
- `DRWN_BIN="<repo-local-or-installed-drwn>" npm run validate:cards`
- `DRWN_BIN="<repo-local-or-installed-drwn>" npm run smoke:cli`
- `drwn library add skill . --json` and
  `drwn skills packages show darwinian-minds-skills --json` from a disposable
  `HOME`
- Smoke-test at least one skill in Claude Code or Codex
- Reconfirm that referenced `drwn` commands still exist in the current CLI

### Main Repo Coordination

After the skills repo change is accepted, update the Darwinian Minds CLI repo:

1. Point the submodule URL at
   `https://github.com/remyjkim/darwinian-minds-skills.git`.
2. Update the submodule pointer to the accepted skills repo commit.
3. Update downstream docs and lockfiles that still use singular
   `darwinian-mind*` names according to the task plan.
4. Run the CLI repo release-readiness checks.

## Reviewing Skill Changes

1. Frontmatter uses only `name` and `description`.
2. Every mutating procedure previews or explicitly describes the mutation before
   it runs.
3. User-ask points line up with real mutations.
4. `Wraps` lists every `drwn` command actually used.
5. `Scope` and `Failure modes` are explicit.
6. If the skill is bundled into a card, re-run `npm run sync:cards` and review
   the copied card skill directory too.

## Adding Distribution Channels

1. Determine whether the new channel reads `skills/<name>/SKILL.md` directly or
   needs an extra manifest.
2. Add the manifest under a channel-specific directory if required.
3. Update install docs.
4. Bump `VERSION` minor.

## Coordinating With Darwinian Minds

The skills in this repo wrap `drwn`. When the CLI changes:

- Additive changes: update the relevant skills opportunistically.
- Breaking changes: update the affected skill bodies and release a new version.
- Safety gaps: file them in the CLI repo; do not silently paper over them here.

## Owners

- Primary: Remy Kim
- Backup: TBD
