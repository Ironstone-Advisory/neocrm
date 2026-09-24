import { opaqueId, stableValue } from "./ids.mjs";

export function createAssertion({
  kind,
  predicate,
  value,
  text,
  confidence,
  evidenceIds = [],
  inputAssertionIds = [],
  transformationId,
  extractor = "deterministic_rule"
}) {
  const uniqueEvidenceIds = [...new Set(evidenceIds)];
  const uniqueInputs = [...new Set(inputAssertionIds)];
  const assertion = {
    assertionId: opaqueId(
      "assertion",
      kind,
      predicate,
      stableValue(value),
      uniqueEvidenceIds,
      uniqueInputs
    ),
    predicate,
    value,
    kind,
    text,
    evidenceIds: uniqueEvidenceIds,
    derivation: {
      transformationId,
      extractor,
      modelVersion: null,
      inputAssertionIds: uniqueInputs
    },
    status: "active"
  };
  // Confidence is optional and may only be supplied by a calibrated producer.
  // Source authority is deliberately not converted into a numerical score.
  if (Number.isFinite(confidence)) assertion.confidence = confidence;
  return assertion;
}

export function createRecommendation({
  decisionType,
  predicate,
  text,
  options,
  rationale,
  evidenceIds = [],
  inputAssertionIds = [],
  transformationId
}) {
  const uniqueEvidenceIds = [...new Set(evidenceIds)];
  const uniqueInputs = [...new Set(inputAssertionIds)];
  return {
    recommendationId: opaqueId(
      "recommendation",
      decisionType,
      predicate,
      options,
      uniqueEvidenceIds,
      uniqueInputs
    ),
    decisionType,
    predicate,
    text,
    options,
    rationale,
    evidenceIds: uniqueEvidenceIds,
    derivation: {
      transformationId,
      extractor: "deterministic_rule",
      modelVersion: null,
      inputAssertionIds: uniqueInputs
    },
    status: "proposed"
  };
}
