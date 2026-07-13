---
name: share-card
description: "Use when configuring Card remotes, pushing or fetching immutable Card refs, cloning or forking Cards, or publishing a Card into a catalog."
---

# Share Card

## Purpose

Move validated immutable Card and Blueprint refs across Git remotes and
catalogs. Keep local publication, remote transport, and catalog mutation as
separate approval boundaries.

## Procedure

1. Confirm the exact immutable ref with `drwn card validate <ref> --json` and
   `drwn card show <ref> --json`.
2. Inspect configured remotes with `drwn card remote list <name> --json`.
3. Add or change a remote only after confirming the URL:
   - `drwn card remote add <name> <url>`
   - `drwn card remote set <name> <url>`
4. Fetch remote refs with `drwn card fetch <name>` before comparing or
   updating local state.
5. Push published branches and tags with `drwn card push <name>`. Confirm the
   remote and its visibility first.
6. Clone an immutable Git-origin ref with `drwn card clone <ref> --json`.
7. Fork an editable source with
   `drwn card fork <source> --scope <scope>` or `--into <directory>`.
8. Preview catalog publication with
   `drwn card catalog publish <ref> --catalog <target> --mode <mode> --dry-run --json`.
9. Publish the catalog entry only after approval. Use `--replace` only when the
   existing entry and intended replacement have been reviewed.
10. Verify discovery with `drwn catalog refresh --json` and
    `drwn search card <query> --json`.

## Guardrails

- Never push an unpublished or unvalidated source.
- Do not bypass trust policy for an unknown remote.
- Do not use public-push safety overrides without explicit informed approval.
- Never include credentials in Card files, Git URLs, or catalog metadata.

## Failure Modes

- Missing Git credentials: stop and report the remote operation that failed.
- Visibility mismatch: do not push until the destination policy is resolved.
- Existing catalog entry: require review before `--replace`.
- Remote ref differs from local immutable bytes: stop and compare refs.

## Related Skills

- `author-card`
- `inspect-worker`
