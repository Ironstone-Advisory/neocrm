import { createAssertion, createRecommendation } from "./assertions.mjs";

export function deriveEpistemicItems({ assertions, conflicts }) {
  const hypotheses = [];
  const unknowns = [];
  const recommendations = [];

  const securitySignals = assertions.filter(
    (item) => item.predicate === "risk.security_review" && item.value === "not_started"
  );
  for (const signal of securitySignals) {
    hypotheses.push(
      createAssertion({
        kind: "hypothesis",
        predicate: "hypothesis.timeline_at_risk",
        value: true,
        text: "The opportunity timeline may be at risk because the security review has not started.",
        evidenceIds: signal.evidenceIds,
        inputAssertionIds: [signal.assertionId],
        transformationId: "infer-security-timeline-risk-v1"
      })
    );
  }

  if (!assertions.some((item) => item.predicate === "commercial.final_signatory")) {
    unknowns.push(
      createAssertion({
        kind: "unknown",
        predicate: "commercial.final_signatory",
        value: null,
        text: "The final contract signatory is not established by the available sources.",
        transformationId: "detect-missing-final-signatory-v1"
      })
    );
  }

  for (const conflict of conflicts) {
    const conflictedPredicate = conflict.predicate.replace(/^conflict\./, "");
    recommendations.push(
      createRecommendation({
        decisionType: "resolve_conflict",
        predicate: `recommendation.resolve.${conflictedPredicate}`,
        text: `Confirm the correct ${conflict.predicate
          .replace(/^conflict\./, "")
          .split(".")
          .at(-1)
          .replaceAll("_", " ")} in the conversation.`,
        options: [
          { optionId: "confirm_in_conversation", label: "Confirm in conversation" },
          { optionId: "leave_unresolved", label: "Leave unresolved" }
        ],
        rationale: "The available evidence contains conflicting values.",
        evidenceIds: conflict.evidenceIds,
        inputAssertionIds: [conflict.assertionId],
        transformationId: "recommend-conflict-resolution-v1"
      })
    );
  }
  for (const hypothesis of hypotheses) {
    recommendations.push(
      createRecommendation({
        decisionType: "verify_hypothesis",
        predicate: "recommendation.confirm.security_review_owner",
        text: "Confirm the security-review owner and start date in the conversation.",
        options: [
          { optionId: "ask_owner_and_date", label: "Ask for owner and start date" },
          { optionId: "defer", label: "Defer" }
        ],
        rationale: "A derived timeline-risk hypothesis should be verified before action.",
        evidenceIds: hypothesis.evidenceIds,
        inputAssertionIds: [hypothesis.assertionId],
        transformationId: "recommend-hypothesis-check-v1"
      })
    );
  }

  return { hypotheses, unknowns, recommendations };
}
