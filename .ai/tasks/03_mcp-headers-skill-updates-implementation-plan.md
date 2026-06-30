# MCP `headers` Support — Skill Doc Updates - Implementation Plan

**Status**: Implemented 2026-06-30 (Phases 1–3 done; `import-mcp-from-claude` 4 sites + literal-secret step, `author-mind-card` note; stale-claim sweep clean)
**Created**: 2026-06-30
**References**: [darwinian-minds `.ai/tasks/61_drwn-http-mcp-headers-passthrough-implementation-plan.md`, darwinian-minds branch `feat/http-mcp-headers-passthrough` (v0.6.0), skills/import-mcp-from-claude/SKILL.md, skills/author-mind-card/SKILL.md]

---

## Executive Summary

`darwinian-minds` v0.6.0 adds `RegistryServer.headers` and renders it across Claude, Codex, and
Cursor (Claude verbatim, Cursor `${env:VAR}`, Codex `bearer_token_env_var` / `http_headers`).
This **closes the gap** that `skills/import-mcp-from-claude/SKILL.md` currently documents in five
places as "drwn doesn't support `headers` yet (analysis 64 Phase 4 gap)".

This task updates the skills to reflect header support: the import skill must stop telling users
to drop/abort header-auth servers, and instead import them — converting any literal secret to a
`${ENV_VAR}` reference so it is never committed. One minor note is added to `author-mind-card`.

**No code in this repo** — these are SKILL.md doc edits only. The skills now assume `drwn ≥ 0.6.0`.

---

## Investigation Findings

### What drwn v0.6.0 actually does (verified)
- `headers?: Record<string,string>` on `RegistryServer`; rendered per target:
  - **Claude**: `headers` verbatim — `${VAR}` expands at launch (official `.mcp.json` behavior).
  - **Cursor**: header values rewritten `${VAR}` → `${env:VAR}`.
  - **Codex**: `Authorization: Bearer ${VAR}` → `bearer_token_env_var = "VAR"`; literal headers → `http_headers`. A **non-bearer** `${VAR}` header cannot be expressed by Codex — drwn emits a write-time warning and omits it (carries fine on Claude/Cursor).
- Validation rejects non-string header maps in card manifests and the MCP library.

### Affected skills
- `skills/import-mcp-from-claude/SKILL.md` — **4 edit sites** (all currently say headers are unsupported):
  1. Plan-summary example table (`custom-api  http (with headers) … warn: headers won't carry`).
  2. Field-mapping table `headers` row (`(no equivalent today) … WARN … drop/abort/skip`).
  3. Failure Modes bullet (`headers present in Claude config: warn and ask (drop/abort/skip)`).
  4. Notes bullet (`… waiting for drwn's RegistryServer.headers schema extension (analysis 64 Phase 4)`).
- `skills/author-mind-card/SKILL.md` — no field-level schema is enumerated today; add one short note that MCP definitions support a `headers` map for header-authenticated hosted HTTP servers. (Minor.)

### Key nuance — literal secrets
Claude's `.mcp.json` often stores a **literal** token in `headers` (e.g. `Bearer sk-...`), not a
`${VAR}` reference. On import, a literal secret must be converted to a `${ENV_VAR}` reference (and
the env var recorded in `notes`) so the card/library never embeds the secret. This is the most
important behavioral addition, not just deleting the warnings.

---

## Implementation Strategy

Edit SKILL.md prose only. Keep the existing dry-run → summarize → confirm safety posture; the
change is *what* we tell the user about headers, plus the literal-secret conversion step.

### Phase 1 — Update `import-mcp-from-claude/SKILL.md`

**Files**: `skills/import-mcp-from-claude/SKILL.md`

**Tasks** (concrete before/after):

1. Plan-summary example table row:
   - Before: `custom-api  http (with headers) not present    transform + library add (warn: headers won't carry)`
   - After: `custom-api  http (with headers) not present    transform + library add (headers carry; convert literal secrets to ${VAR})`

2. Field-mapping `headers` row:
   - Before: `| `headers` | (no equivalent today) | **WARN the user** — drwn doesn't support `headers` yet (analysis 64 Phase 4 gap). If headers are present, ask whether to (a) drop them and import without (auth will break), (b) abort, or (c) keep the server in Claude and skip the import. |`
   - After: `| `headers` | `headers` | Passthrough as a string map (drwn ≥ 0.6.0). Per target: Claude keeps `${VAR}` verbatim, Cursor rewrites to `${env:VAR}`, Codex maps `Authorization: Bearer ${VAR}` → `bearer_token_env_var` and literal headers → `http_headers`. A **non-bearer** `${VAR}` header can't be expressed on Codex — drwn warns at write time and omits it (carries on Claude/Cursor). **If a header holds a literal secret, convert it to a `${ENV_VAR}` reference** (and record the env var in `notes`) so it is never committed. |`

3. Failure Modes bullet:
   - Before: `- **`headers` present in Claude config**: warn and ask (drop / abort / skip). Do not silently drop.`
   - After: `- **`headers` present in Claude config**: import them (drwn ≥ 0.6.0). Convert any literal secret to a `${ENV_VAR}` reference before add so it isn't committed. Warn only for a non-bearer `${VAR}` header (Codex can't express it; it still carries on Claude/Cursor).`

4. Notes bullet:
   - Before: `- If a server's Claude entry uses `headers` for bearer-token auth, that workflow currently requires either staying tool-local or waiting for drwn's `RegistryServer.headers` schema extension (tracked as analysis 64 Phase 4). Don't pretend the import succeeded if auth would silently break.`
   - After: `- Header-based (bearer) auth is supported as of drwn ≥ 0.6.0: Claude/Cursor carry the header; Codex maps `Authorization: Bearer ${VAR}` to `bearer_token_env_var`. Convert a literal token to a `${ENV_VAR}` reference on import so the secret isn't committed.`

5. Add a transformation sub-step (Step 2) for literal→`${VAR}` conversion: when a `headers` value
   contains an inline secret, prompt for an env var name (suggest e.g. `FAL_KEY`), replace the
   secret with `${ENV_VAR}`, and append a `notes` hint naming the variable.

**Verification**:
- `grep -nE "doesn't support headers|won't carry|Phase 4 gap|waiting for drwn" skills/import-mcp-from-claude/SKILL.md` returns nothing.
- Manual read: the headers row + failure/notes now describe support + literal-secret conversion.

### Phase 2 — Minor note in `author-mind-card/SKILL.md`

**Files**: `skills/author-mind-card/SKILL.md`

**Tasks**:
1. Near the `drwn card source add-mcp` description, add one sentence: MCP server definitions may
   include a `headers` map to authenticate hosted HTTP servers; use a `${ENV_VAR}` reference (e.g.
   `Authorization: Bearer ${FAL_KEY}`) rather than a literal token.

**Verification**: read-through; `add-mcp` guidance mentions `headers` + `${VAR}` convention.

### Phase 3 — Repo-wide consistency sweep

**Tasks**:
1. `grep -rniE "headers" skills/*/SKILL.md` — confirm no remaining "unsupported/won't carry" claims.
2. If a skills-repo analysis or knowledge doc tracks the "Phase 4 / headers gap", mark it resolved
   by drwn v0.6.0 (none found in `.ai/` at draft time — re-check before closing).

---

## Risks & Mitigation

- **Leaking a literal secret into a card/library** — the conversion-to-`${VAR}` step is mandatory,
  not optional. The skill must never `add` a server whose `headers` contain an inline secret without
  converting first. Make this a hard checkpoint in the prose.
- **Codex non-bearer `${VAR}` header** — still unsupported; the skill must surface drwn's write-time
  warning rather than imply full Codex parity.
- **Version assumption** — these edits assume `drwn ≥ 0.6.0`. Optionally have the skill check
  `drwn --version` and fall back to the old warn/skip guidance on older CLIs. (Decide during review;
  default recommendation: state the `≥ 0.6.0` requirement in prose without a runtime gate.)

---

## Out of Scope

- Implementing the edits (this is the plan; execute after review).
- The `@remyjkim/fal` card and its hosted-MCP variant (tracked in mindspace-landing `.ai/tasks/03`).
- Any darwinian-minds code change (already shipped in v0.6.0).
