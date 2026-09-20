# Provenance and Policy

NeoCRM must not collapse retrieved facts, observed signals, model interpretations, hypotheses, and recommendations into one undifferentiated answer.

## Assertion ladder

| Kind | Meaning | Example |
| --- | --- | --- |
| Fact | Directly supported by a system of record or document. | Contract expires on 2026-12-31. |
| Observation | A bounded description of evidence. | Response time increased over the last three exchanges. |
| Interpretation | A contextual reading of evidence. | The buyer appears to be prioritizing implementation risk. |
| Hypothesis | A plausible but unverified explanation. | Procurement may be delaying the decision. |
| Recommendation | A proposed human action. | Reconnect with the sponsor before contacting procurement. |

## Policy requirements

- Retrieval must be limited to authorized sources and the necessary scope.
- Source failures, stale data, and unresolved conflicts must be visible.
- Proposed external actions must identify target, payload, rationale, and approval requirement.
- Executed actions must create an audit event with the actor, result, and resulting source identifier.
