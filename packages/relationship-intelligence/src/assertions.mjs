import { opaqueId, stableValue } from "./ids.mjs";

const authorityConfidence = {
  authoritative: 1,
  corroborating: 0.8,
  contextual: 0.6
};

export function confidenceForAuthority(authority, sourceConfidence = 1) {
  return Number(Math.min(sourceConfidence, authorityConfidence[authority] ?? 0).toFixed(3));
}

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
  return {
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
    confidence,
    evidenceIds: uniqueEvidenceIds,
    derivation: {
      transformationId,
      extractor,
      modelVersion: null,
      inputAssertionIds: uniqueInputs
    },
    status: "active"
  };
}
