# First NeoCRM experiment: Zoho + Obsidian relationship brief

[Workflow catalogue](README.md) / [EXP-001 specification](../experiments/EXP-001-zoho-obsidian-relationship-brief/spec.md)

Use this path to rehearse the first bounded NeoCRM experience: prepare a relationship brief from Zoho operational evidence and explicitly approved Obsidian context. It is read-only and designed to keep provenance, missing evidence, uncertainty and human judgment visible.

> This is a practical path through the current repository, not evidence that 57 automations exist. The runnable implementation is the narrower CAP-001 / EXP-001 slice. Live and human experiment evidence is still pending.

## Understand the path

**META-001 → META-002 → SAL-001 → SH-001 / SH-002 / SH-004**

1. [META-001 — Guided Onboarding and Source Readiness](_meta/WF-META-001-guided-onboarding-and-source-readiness/GUIDE.md) is the readiness checklist.
2. [META-002 — Conversational Intent Router](_meta/WF-META-002-conversational-intent-router/GUIDE.md) describes intent selection and clarification.
3. [SAL-001 — Relationship Brief and Meeting Prep](sales/WF-SAL-001-relationship-brief-and-meeting-prep/GUIDE.md) is the business-facing result.
4. [SH-001](_shared/WF-SH-001-identity-and-source-resolution/GUIDE.md), [SH-002](_shared/WF-SH-002-minimum-necessary-context-and-evidence/GUIDE.md) and [SH-004](_shared/WF-SH-004-evidence-and-epistemic-review/GUIDE.md) describe the internal controls the path must preserve.

The catalogue path is currently operator-guided. META-001, META-002 and the Shared wrappers are specifications, not an implemented orchestration chain. Select EXP-001 explicitly when running the current slice.

## What each source contributes

| Source | Role in this experiment | Boundary |
| --- | --- | --- |
| Zoho CRM | Authoritative operational evidence for the configured person, account, commercial state and allowed activities | Regional, allowlisted and GET-only; missing, filtered and stale data stay explicit |
| Obsidian | Permissioned contextual relationship knowledge from explicitly linked Markdown | Confined to the approved vault boundary; notes remain evidence rather than canonical truth |
| NeoCRM | Identity resolution, minimum-necessary context, provenance, epistemic separation and brief presentation | Owns semantic contracts, not source data; cannot write or contact anyone in EXP-001 |

## Rehearse safely with fixtures

From the repository root:

```powershell
pnpm install
pnpm check
pnpm exp:001 -- --preflight --mode fixture --condition C
pnpm exp:001 -- --mode fixture --condition B --query "What do I need to know before I speak with Alex Rivera?"
pnpm exp:001 -- --mode fixture --condition C --query "What do I need to know before I speak with Alex Rivera?"
```

Condition B uses synthetic Zoho evidence. Condition C adds the committed synthetic Obsidian vault. Compare whether the additional context is useful without hiding conflicts, source gaps or uncertainty. Condition A is a timed human baseline and has no CLI run.

## Prepare an opt-in live check

1. Read the [operator runbook](../experiments/EXP-001-zoho-obsidian-relationship-brief/runbook.md) and [source boundary](../experiments/EXP-001-zoho-obsidian-relationship-brief/source-boundary.md).
2. Use operator-local environment variables; never commit credentials, private notes, vault copies or per-person output.
3. Grant only the minimum Zoho read scopes and field/module allowlist. Approve one Obsidian vault boundary and only explicitly linked notes.
4. Run the content-free live preflight from the runbook before retrieving any relationship content.
5. Proceed only with a permissioned person and stop on identity ambiguity, wrong-person candidates, vault-boundary failure, denied/stale evidence that makes the brief unsafe, or any attempted external effect.
6. Record only de-identified aggregate outcomes using the experiment result template; a successful smoke run is not product validation.

## What success looks like

The brief resolves the subject with visible confidence; separates authoritative facts, contextual observations, interpretations, hypotheses and Unknowns; exposes provenance and stale or unavailable sources; summarizes relationship, commercial and service state; and ends with useful questions or a recommended next human decision. It does not write to Zoho or Obsidian, contact anyone, schedule anything or change policy or durable memory.

