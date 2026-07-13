---
name: audit-mind-visibility
description: "Use when auditing persona and belief visibility in Mind capability Cards before publication or push, while reporting DB-native memory declarations separately."
---

# audit-mind-visibility

Perform a read-only audit of distributable persona and belief content. Memory
has no visibility field: semantic observations and insights are DB-native live
state, so report their declaration separately and exclude them from the Card
push verdict.

## Inputs

- One published Card reference, one editable Card source, or every Card in the
  current project's locked Worker closure.
- Optional source mode for all editable sources on this machine.
- Optional explicit remote classification: `private`, `internal`, `public`,
  or `unknown`.

## Workflow

1. Enumerate the requested read-only surface:
   - Project closure: `drwn card status --json`.
   - Published Card: `drwn card show <ref> --json`.
   - Editable source: `drwn card source show <card> --json`.
   - All editable sources: `drwn card source list --json`, followed by source
     inspection for each result.
2. For each manifest, enumerate persona and beliefs entries with their required
   section visibility. Compute the strictest distributable visibility using
   `private` before `internal` before `public`.
3. Report the optional Mind capability separately:
   - `memory.observations.format` must be `jsonl` when declared.
   - `memory.insights.format` must be `md` when declared.
   - An absent memory declaration means the Card does not itself opt the
     Worker closure into the Mind capability.
4. Read configured remotes with `drwn card remote list <card> --json` when a
   source remote is relevant. Treat local paths and `file://` URLs as private.
   Treat network remotes as unknown unless the user explicitly classifies
   them; never infer trust from a host or organization name.
5. Compare strictest Card visibility with the remote classification:
   - Private content may go only to a private remote.
   - Internal content may go to a private or internal remote.
   - Public content may go to a classified private, internal, or public remote.
   - Unknown network classification is unresolved and must be classified
     before push.
6. Return a table with Card/ref, persona visibility, beliefs visibility,
   strictest distributable visibility, semantic Mind declaration, remote, and
   verdict.

## Boundaries

- Make no file, config, lock, remote, publication, or projection mutation.
- Do not inspect live observations or insights; this is a Card-source audit.
- Do not treat a semantic memory declaration as distributable content.
- Do not use an unsafe push override on the user's behalf.

## Failure Handling

- Report an unreadable manifest as unresolved; do not guess.
- Report a Card with no persona or beliefs as having no distributable
  visibility constraint.
- Report malformed or partial semantic memory declarations as invalid and
  direct the user to `drwn card source doctor <card> --json`.
- Continue the audit for independent Cards, but keep each unresolved result
  visible in the final report.
