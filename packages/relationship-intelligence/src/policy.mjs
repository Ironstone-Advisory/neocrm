export function applyReadOnlyPolicy(response) {
  return {
    ...response,
    actions: [],
    policy: { externalWrites: "disabled" }
  };
}

/**
 * The only DTO that may cross a future model boundary. It intentionally has
 * no capability declarations, credentials, native identifiers, or adapter
 * objects/handles. Source text remains explicitly untrusted.
 */
export function toModelSafeContext(response) {
  const untrustedEvidenceIds = new Set(
    response.evidence
      .filter((item) => item.untrustedContent)
      .map((item) => item.evidenceId)
  );
  return Object.freeze({
    subject: structuredClone(response.subject),
    assertions: [
      ...response.facts,
      ...response.observations,
      ...response.interpretations,
      ...response.hypotheses,
      ...response.unknowns,
      ...response.conflicts
    ].map(({ assertionId, kind, predicate, value, confidence, evidenceIds }) => {
      const untrusted = evidenceIds.some((id) => untrustedEvidenceIds.has(id));
      return {
        assertionId,
        kind,
        predicate,
        value: untrusted
          ? { channel: "untrusted_data", payload: structuredClone(value) }
          : structuredClone(value),
        ...(Number.isFinite(confidence) ? { confidence } : {}),
        evidenceIds: [...evidenceIds],
        controlCapabilities: []
      };
    }),
    evidence: response.evidence.map(({ evidenceId, marker, summary, untrustedContent }) => ({
      evidenceId,
      marker,
      content: untrustedContent
        ? { channel: "untrusted_data", text: summary }
        : { channel: "trusted_metadata", text: summary },
      untrustedContent,
      controlCapabilities: []
    }))
  });
}

export function proposeDisabledAction({
  actionId,
  actionType,
  targetAdapterId,
  rationale,
  preview,
  evidenceIds = []
}) {
  return {
    actionId,
    actionType,
    targetAdapterId,
    rationale,
    preview,
    state: "disabled",
    requiresExplicitApproval: true,
    externalWrite: true,
    evidenceIds
  };
}

export function rejectExternalWrite() {
  const error = new Error("External writes are disabled for CAP-001.");
  error.code = "EXTERNAL_WRITES_DISABLED";
  throw error;
}
