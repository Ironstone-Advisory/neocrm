# Security and governance

**Status:** Proposed control architecture

Governance is a cross-cutting control plane independent of natural-language content and model reasoning.

## Decision inputs

Every material retrieval, handoff, memory admission, recommendation, approval, action, and learning change is evaluated against principal and Agent identity; tenant; purpose; Delegation; ToolGrant; Party/subject; consent and preference; data classification; source authority; geography/retention constraints; autonomy/risk; evidence quality; and time/cost budgets.

## Mandatory controls

- deny by default and fail closed when identity, policy, consent, authority, or freshness requirements cannot be established;
- identity before private retrieval and minimum-necessary context thereafter;
- denial non-disclosure: do not reveal that a protected record exists;
- purpose/channel-specific Consent and attributable Preference with effective time, provenance, withdrawal, and conflict rules;
- prompt-injection and hostile-content isolation across source and Agent content;
- no credentials, native execute handles, or policy mutation capability in model context;
- approval bound to exact preview, version, scope, approver authority, and expiry;
- time-bounded non-delete WriteGrants naming versioned workflows with explicit purpose, system/record-set/field/action scope, risk ceiling, limits, revocation, verification, receipt, and compensation;
- fresh exact single-use human DeletionAuthorization for every immutable deletion target list, never inferred from a WriteGrant;
- verifiable, idempotent action execution and immutable audit;
- monitoring for manipulation, unfair treatment, unwanted contact, privacy/service/customer harm, complaints, and redress;
- explicit retention, correction, export, deletion, legal-hold, and incident paths; and
- governed evaluation before any authority, model, prompt, workflow, policy, or mapping change.

## Autonomy posture

v0.1 supports Level 0 record/report, Level 1 summarize/recommend, and Level 2 draft/plan. Level 3 bounded reversible execution is experiment-only under ADR-0016. Levels 4-5 are deferred. CAP-001 and EXP-001 allow reads and recommendations only; every external write is disabled in the current slice.
