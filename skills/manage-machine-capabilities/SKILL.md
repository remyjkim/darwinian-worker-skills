---
name: manage-machine-capabilities
description: "Use when selecting, changing, trusting, or projecting the machine-scope Worker Blueprint and its immutable Card closure."
---

# Manage Machine Capabilities

## Purpose

Manage ambient machine capability intent as one selected Worker Blueprint.
Standalone skill packages and MCP records are inventory, not activation
authority. Project declarations remain independent and never inherit the
machine Worker.

## Procedure

1. Inspect machine state with `drwn status --machine --json --explain` and
   `drwn doctor --json`.
2. Identify the immutable Blueprint ref. Runtime selection must use a Store,
   explicit Git, or explicit file source permitted by trusted-source policy;
   do not resolve from a mutable authoring checkout.
3. Preview a replacement with
   `drwn apply --root <blueprint-ref> --dry-run`.
4. Apply it with `drwn apply --root <blueprint-ref>`. Apply is intent-only by
   default; pass `--write` only after approving the combined mutation and
   projection. Use
   `drwn use --root <installed-name-or-ref> --no-write` to switch among
   installed roots, or `drwn use --root --none --no-write` to select none
   without discarding alternatives.
5. Inspect consent requirements. Grant only reviewed Card bytes:
   - `drwn card trust <card> --hooks --scope machine`
   - `drwn card trust <card> --instructions --scope machine`
6. Preview user-scope projection with `drwn write --root --dry-run --json`.
7. After explicit approval, run `drwn write --root`.
8. Verify the canonical active name, requested root ref, locked closure,
   integrity, consent, and projection with status and doctor.

## Guardrails

- Fresh non-interactive or declined setup has `activeWorker: null` and
  `workerLock: null`; guided setup may offer the recommended machine-defaults
  Blueprint.
- `activeWorker` is a canonical Card name. The versioned source belongs in the
  lock root's `requested` field.
- V1/prototype `machine.json` is unsupported and must be reset deliberately;
  do not migrate or infer provenance from bare skill/MCP IDs.
- Do not use `drwn machine skill|mcp enable|disable`; those commands fail
  because machine activation is closure-governed.
- Do not hand-edit `machine.json`, its embedded lock, the global write record,
  generated Workers, managed instruction blocks, or target hook fields.
- A machine write must not consult project selection or write project paths.
- Never resolve credentials into Card, lock, or generated Worker content.

## Failure Modes

- Unsupported V1/prototype state: preserve any required audit copy outside the
  Store, follow controlled-reset guidance, rerun `drwn init`, then select a
  Blueprint.
- Missing or changed locked Card bytes: stop on the integrity error; repair the
  immutable source/Store rather than trusting ambient inventory.
- Consent gap: review the exact Card release and grant only the requested hook
  or instruction surface.
- Foreign or drifted user-home content: diagnose ownership before considering
  force; force repairs only prior drwn-owned state.
- Missing external executable, OAuth grant, or secret: repair operator runtime
  state separately. Cards carry definitions and secret references, not runtime
  readiness.

## Related Skills

- `manage-machine-inventory`
- `manage-project-worker`
- `inspect-worker`
- `repair-worker`
- `author-card`
