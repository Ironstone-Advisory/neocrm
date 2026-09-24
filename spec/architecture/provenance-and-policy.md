# Provenance and policy

NeoCRM must not collapse claims, observations, interpretations, hypotheses, unknowns, conflicts, recommendations, or actions into one undifferentiated answer.

## Epistemic and decision artifacts

| Category | Meaning |
| --- | --- |
| Fact | A claim supported under applicable evidence/authority rules and bounded by source and time. |
| Observation | A bounded description of evidence or an attributed human observation. |
| Interpretation | Contextual meaning derived from evidence. |
| Hypothesis | A plausible, testable, uncertain explanation or prediction. |
| Unknown | A material fact or relationship not established within the evidence boundary. |
| Conflict | Material claims that cannot yet be reconciled. |

**Recommendation is a separate decision-oriented object**, with Goal, options, rationale, evidence, uncertainty, policy constraints, and expected Outcome. It is not an epistemic category or an Action.

Source authority, freshness, confidence, completeness, and epistemic category are independent. No one is derived mechanically from another.

## Policy requirements

- Resolve identity before private retrieval and request only the minimum context necessary for the declared Goal/PlanStep.
- Represent denial as unavailable under policy without revealing whether a protected record exists.
- Keep failed, denied, stale, incomplete, and conflicting sources visible without inferring absence.
- Bind each proposed external Action to a target, payload, versioned preview, rationale, PolicyDecision, and approval requirement.
- Route execution through an isolated gateway and record Actor, authority, result, verification, source reference, and compensation.
- Prevent Outcome or LearningSignal capture from directly changing facts, policy, authority, AgentDefinitions, prompts, models, or mappings.
