---
name: author-mind-content
description: "Use when authoring or removing persona and belief seeds in an editable Mind capability Card, with explicit visibility and source validation."
---

# author-mind-content

Use this skill only for Card-authored persona and belief seeds. Observations
and insights are live BeginningDB state and belong to dedicated Mind runtime
tools, not Card source commands or bundled files.

## Inputs

- Editable Card name, such as `@scope/research-mind`.
- Operation: add or remove.
- Content type: persona or belief.
- Entry name.
- For additions, explicit visibility: `private`, `internal`, or `public`.
- For removals, whether source files should be retained with `--keep-files`.

## Workflow

1. Inspect the editable source without mutating it:

   ```bash
   drwn card source show <card> --json
   ```

2. Confirm the Card, operation, entry, and visibility. Explain that visibility
   controls distributable persona or belief content:
   - `private` is suitable only for a private remote.
   - `internal` is suitable for an explicitly classified internal remote.
   - `public` is suitable for arbitrary recipients.
3. Preview exactly one source mutation:

   ```bash
   drwn card source add-persona <card> <entry> --visibility <visibility> --dry-run --json
   drwn card source remove-persona <card> <entry> [--keep-files] --dry-run --json
   drwn card source add-belief <card> <entry> --visibility <visibility> --dry-run --json
   drwn card source remove-belief <card> <entry> [--keep-files] --dry-run --json
   ```

4. Show the preview and request approval before running the same command
   without `--dry-run`.
5. For additions, author concise content in the generated `PERSONA.md` or
   `BELIEF.md`. Keep each belief focused on one durable principle.
6. Validate the complete source:

   ```bash
   drwn card source doctor <card> --json
   ```

7. When the source lives outside the managed source root, edit its tracked
   persona or belief files directly and validate it with:

   ```bash
   drwn card validate file:<path-to-card-source> --json
   ```

8. Treat an additive entry as at least a minor Card change. Treat removal,
   rename, or tighter visibility as a breaking Card change. Publishing and
   pushing require separate explicit approval.

## Boundaries

- Do not create Card-owned observation or insight entries.
- Do not operate the live Mind; use `@darwinian/mind-tools` for that.
- Do not select or mutate the project Worker; use the Operator Card's
  `manage-project-worker` skill.
- Do not hand-edit managed project config, lock, ownership, or projections.

## Verification

Return the Card name, changed source entries, selected visibility, source
doctor result, and any required version classification. Do not publish, push,
or operate runtime memory as part of this workflow.
