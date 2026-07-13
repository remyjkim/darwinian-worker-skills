# Maintainers Guide

## Release Contract

Releases are SemVer and keyed off the root `VERSION` file. Operator releases
must preserve a single canonical skill allowlist in `scripts/card-map.mjs` and
byte-identical generated Card copies.

## Cutting A Release

1. Update `VERSION`, `package.json`, `package-lock.json`, `bundle.json`, and
   both plugin metadata trees.
2. Update the Operator Card version independently when its public payload
   changes.
3. Run `npm install --package-lock-only --ignore-scripts`.
4. Run `npm run sync:cards`.
5. Run every release check below from a clean checkout.
6. Review generated Card changes and immutable release coordinates.
7. Merge the release change before creating tags or publishing artifacts.

## Required Checks

```bash
npm run test:operator-contract
npm run sync:cards -- --check
npm run check:identity
npm run check:paths
npm run lint:md
npm run validate:skills
DRWN_BIN="<repo-local-or-installed-drwn>" npm run validate:cards
DRWN_BIN="<repo-local-or-installed-drwn>" npm run smoke:cli
```

Also install the package in a disposable home and verify inactive inventory:

```bash
drwn machine skill install . --json
drwn machine skill show --package darwinian-worker-skills --json
```

Smoke-test at least one Operator skill in Claude Code or Codex and confirm that
every referenced `drwn` command exists in the supported CLI.

## Review Rules

1. Skill frontmatter contains only `name` and `description`.
2. Trigger descriptions state when the skill should be selected.
3. Mutations are previewed or described before approval.
4. Project, machine, Card source, remote, and catalog ownership stay distinct.
5. Operator contains only its approved eight skills.
6. Generated Operator copies are byte-identical to canonical sources.
7. Dedicated optional runtime skills never enter Operator transitively.
8. No skill teaches a removed command namespace or compatibility alias.

## Main Repository Coordination

After the skills repository release is accepted:

1. Update the Darwinian Worker submodule pointer to the accepted commit.
2. Update the pinned Operator profile descriptor to the immutable Card ref,
   commit, tree hash, and integrity.
3. Run the CLI repository contract and release-readiness checks.
4. Publish only after the protected release gate succeeds from committed state.

## Owners

- Primary: Remy Kim
- Backup: TBD
