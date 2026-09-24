# Recommendation, approval, and action

An **OBJ-062 Recommendation** is a decision-oriented suggestion containing Goal, options, rationale, evidence, uncertainty, constraints, expected Outcomes, and responsible Actor. It is neither Fact nor execution.

An **OBJ-063 Action** is a proposed durable or external effect. Its lifecycle is:

```text
propose -> preview -> policy decision -> approval if required
        -> execute -> verify -> audit -> outcome
        -> compensate where applicable
```

Every Action records initiator, accountable Actor, related Goal/Plan/WorkItem, target integration and operation, payload reference, exact human-readable preview/version, evidence/rationale, risk, PolicyDecision, required Approval, idempotency key, execution attempt/result, target source reference, verification, failure/cancellation, compensation, timestamps, cost, and Outcome.

An Approval binds to one action preview, scope, approver authority, and expiry. An Agent/model never holds native execute handles or credentials. CAP-001 permits recommendations and inert proposals only; all external execution is disabled.
