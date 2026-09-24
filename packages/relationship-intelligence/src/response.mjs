import { assertContract } from "../../contracts/src/runtime.mjs";
import { createAssertion } from "./assertions.mjs";
import { applyReadOnlyPolicy } from "./policy.mjs";

export function unknownAssertion(predicate, text, inputAssertionIds = []) {
  return createAssertion({
    kind: "unknown",
    predicate,
    value: null,
    text,
    confidence: 1,
    inputAssertionIds,
    transformationId: "declare-unavailable-context-v1"
  });
}

export function baseEnvelope({ traceId, status, subject, sessionContextUsed = false }) {
  return {
    contractType: "response_envelope",
    version: "1.0",
    traceId,
    intent: "relationship_brief",
    status,
    subject,
    facts: [],
    observations: [],
    interpretations: [],
    hypotheses: [],
    unknowns: [],
    conflicts: [],
    recommendations: [],
    evidence: [],
    sourcePlan: null,
    actions: [],
    memory: {
      sessionContextUsed,
      durableMemoryWritten: false
    },
    policy: { externalWrites: "disabled" }
  };
}

export function finalizeEnvelope(response) {
  return assertContract("ResponseEnvelope", applyReadOnlyPolicy(response));
}
