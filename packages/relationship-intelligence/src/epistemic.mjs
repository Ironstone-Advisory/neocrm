import { createAssertion } from "./assertions.mjs";

function derivedConfidence(inputs, factor = 1) {
  if (!inputs.length) return 1;
  return Number((Math.min(...inputs.map((input) => input.confidence)) * factor).toFixed(3));
}

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
        confidence: derivedConfidence([signal], 0.8),
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
        confidence: 1,
        transformationId: "detect-missing-final-signatory-v1"
      })
    );
  }

  for (const conflict of conflicts) {
    recommendations.push(
      createAssertion({
        kind: "recommendation",
        predicate: `recommendation.resolve.${conflict.predicate}`,
        value: { resolve: conflict.predicate },
        text: `Confirm the correct ${conflict.predicate
          .replace(/^conflict\./, "")
          .split(".")
          .at(-1)
          .replaceAll("_", " ")} in the conversation.`,
        confidence: derivedConfidence([conflict]),
        evidenceIds: conflict.evidenceIds,
        inputAssertionIds: [conflict.assertionId],
        transformationId: "recommend-conflict-resolution-v1"
      })
    );
  }
  for (const hypothesis of hypotheses) {
    recommendations.push(
      createAssertion({
        kind: "recommendation",
        predicate: "recommendation.confirm.security_review_owner",
        value: { confirm: "security_review_owner" },
        text: "Confirm the security-review owner and start date in the conversation.",
        confidence: derivedConfidence([hypothesis]),
        evidenceIds: hypothesis.evidenceIds,
        inputAssertionIds: [hypothesis.assertionId],
        transformationId: "recommend-hypothesis-check-v1"
      })
    );
  }

  return { hypotheses, unknowns, recommendations };
}
