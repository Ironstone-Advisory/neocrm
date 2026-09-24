# Policy, decision, and audit

A **Policy** is a versioned rule governing data, purpose, consent, delegation, autonomy, action, retention, learning, fairness, or customer harm. It records owner, scope, effective time, priority/conflict rule, inputs, outcome vocabulary, rationale, tests, and lifecycle.

A **PolicyDecision** records policy/version, subject, principal/Agent, context reference, decision (`permit`, `deny`, `require_approval`, or `escalate`), obligations, reasons safe to disclose, evaluation time, and expiry. It is independent of model output and immutable for audit.

An **Approval** records the authorized human/service decision over an exact preview and version; it cannot be reused after material change or expiry.

A **WriteGrant** records explicit time-bounded non-delete authority for a registered workflow portfolio. A **DeletionAuthorization** is a fresh, exact, human, single-use decision for an immutable target list. Neither natural-language instruction nor a general role/grant substitutes for these artifacts.

An **AuditEvent** records material retrieval, handoff, policy, grant, approval, deletion authorization, action, verification, receipt, correction, outcome, and learning-release events with identity, purpose, correlation/causation, time, versions, classification, and protected payload references.
