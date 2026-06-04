---
name: share-harness-card
description: "Use when sharing Darwinian Harness Cards through Git remotes, or cloning and fetching Git-backed cards."
---

# share-harness-card

## Purpose

Push published local cards to Git remotes, or import cards via clone/fetch.
Requires `drwn` and `git`; `gh` only needed for GitHub repo creation.

## Procedure

1. Run `drwn --version` and `drwn store status --json`. If legacy layout is
   detected, stop and redirect to `repair-harness`.
2. Disambiguate intent: inspect remotes, create GitHub repo, add/set/remove
   remote, push, fetch, or clone.
3. For GitHub repository creation:
   1. Run `gh auth status`. On failure, ask the user to authenticate; do not
      attempt credential repair.
   2. Derive the default repo from the card ref — owner is the scope without
      `@` (e.g. `@jgb` → `jgb`, fallback to `gh api user --jq .login`);
      repo name is the bare card name (e.g. `@jgb/test2` → `test2`).
   3. Use `AskUserQuestion` to confirm `<owner>/<repo>` and visibility before
      creating.
   4. Check if repo exists with `gh repo view <owner>/<repo> --json ...`.
      If it does, confirm reuse; otherwise run `gh repo create <owner>/<repo>
      --public` or `--private`.
4. For remote add, set, or remove: run `drwn card remote list <name> --json`,
   confirm the mutation, execute, then verify with `remote list` again.
5. For push: confirm the card and remote with `card show` and `remote list`,
   then run `drwn card push <name>`. Verify with `git ls-remote`.
6. For fetch: confirm with `remote list`, run `drwn card fetch <name>`,
   verify with `card show`.
7. For clone: confirm the exact `git+`, `github:`, or `gitlab:` ref with a
   version selector (`#v0.1.0` or `@^0.1.0`). Run `drwn card clone <ref> --json`
   and verify with `drwn card validate <ref> --json`.
8. If the user wants to apply the card to a project, redirect to
   `apply-harness-card`.

## User-Ask Points

Use `AskUserQuestion` at each point. Confirm before any mutation.

1. GitHub repo `<owner>/<repo>` and visibility before creation.
2. Remote add, set, or remove before executing.
3. Push target and remote before writing to remote.
4. Fetch or clone before mutating local card store.

## Wraps

`drwn --version`, `drwn store status --json`, `drwn card list --json`,
`drwn card show --json`, `drwn card remote list --json`,
`drwn card remote add`, `drwn card remote set`, `drwn card remote remove`,
`drwn card push`, `drwn card fetch`, `drwn card clone --json`,
`drwn card validate --json`, `gh auth status`, `gh api user --jq .login`,
`gh repo view`, `gh repo create`, `git ls-remote`

## Failure Modes

- Card not published locally: redirect to `author-harness-card` first.
- `gh` unavailable or unauthenticated: ask user to run `gh auth login`.
- GitHub repository already exists: confirm reuse before setting as remote.
- Git auth failure: surface the error, do not retry with altered credentials.
- Network failure: surface and stop.
- Card name collision: surface the `drwn` error for deliberate repair.
- User wants to apply after clone: redirect to `apply-harness-card`.

## Related Skills

- `author-harness-card`
- `apply-harness-card`
- `install-harness-project`
- `repair-harness`
