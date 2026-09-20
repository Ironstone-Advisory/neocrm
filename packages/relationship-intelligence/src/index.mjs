// IMP-002: CAP-001 read-only Relationship Intelligence Layer.

const normalizeId = (value) => value.replace(/[^a-zA-Z0-9-]/g, "-");

function assertion(assertionId, kind, text, confidence, evidenceIds = [], derivedFromIds = []) {
  return { assertionId, kind, text, confidence, evidenceIds, derivedFromIds };
}

function baseEnvelope(traceId, status, subject) {
  return {
    version: "1.0",
    traceId,
    intent: "relationship_brief",
    status,
    subject,
    facts: [],
    observations: [],
    hypotheses: [],
    unknowns: [],
    conflicts: [],
    recommendations: [],
    evidence: [],
    sourcePlan: null,
    actions: [],
    memory: {
      sessionContextUsed: false,
      durableMemoryWritten: false
    },
    policy: {
      externalWrites: "disabled"
    }
  };
}

export function createMemoryLogger() {
  const entries = [];
  return {
    entries,
    log(entry) {
      entries.push(structuredClone(entry));
    }
  };
}

export async function buildRelationshipBrief({
  query,
  identityResolver,
  adapters,
  now,
  traceId = "trace-cap-001",
  logger = { log() {} }
}) {
  const retrievedAt = new Date(now).toISOString();
  const emit = (event, fields = {}) => logger.log({ event, traceId, ...fields });
  emit("request.started", { intent: "relationship_brief" });

  const candidates = await identityResolver.resolve(query);
  if (candidates.length > 1) {
    emit("identity.ambiguous", { candidateCount: candidates.length });
    const response = baseEnvelope(traceId, "needs_disambiguation", { candidates });
    response.unknowns.push(
      assertion(
        "unknown-identity",
        "unknown",
        "More than one Party matches the requested person; select a candidate before private context is retrieved.",
        1
      )
    );
    emit("request.completed", { status: response.status, evidenceCount: 0 });
    return response;
  }

  if (candidates.length === 0) {
    emit("identity.not_found");
    const response = baseEnvelope(traceId, "error", {
      partyId: "unresolved",
      displayName: "Unresolved person",
      partyType: "person"
    });
    response.unknowns.push(
      assertion("unknown-person", "unknown", "No Party matched the requested person.", 1)
    );
    emit("request.completed", { status: response.status, evidenceCount: 0 });
    return response;
  }

  const subject = candidates[0];
  emit("identity.resolved", { partyId: subject.partyId, partyType: subject.partyType });
  const response = baseEnvelope(traceId, "complete", subject);
  const plan = {
    intent: "relationship_brief",
    subjectPartyId: subject.partyId,
    steps: adapters.map(({ capability }) => ({
      adapterId: capability.adapterId,
      domains: capability.readDomains,
      reason: `CAP-001 needs ${capability.readDomains.join(", ")} context`,
      status: "planned"
    }))
  };
  response.sourcePlan = plan;

  const normalizedClaims = [];
  for (const [index, adapter] of adapters.entries()) {
    const step = plan.steps[index];
    try {
      const records = await adapter.read({ partyId: subject.partyId });
      step.status = "queried";
      emit("source.completed", {
        adapterId: adapter.capability.adapterId,
        recordCount: records.length
      });
      for (const record of records) {
        const evidenceId = normalizeId(
          `ev-${adapter.capability.adapterId}-${record.nativeId}`
        );
        response.evidence.push({
          evidenceId,
          source: {
            sourceId: adapter.capability.sourceId,
            adapterId: adapter.capability.adapterId,
            nativeId: record.nativeId,
            retrievedAt,
            effectiveAt: record.effectiveAt ?? null,
            authority: adapter.capability.authority
          },
          summary: record.summary,
          untrustedContent: record.untrustedContent ?? true
        });
        for (const [claimIndex, claim] of record.claims.entries()) {
          const kind =
            adapter.capability.authority === "authoritative" ? "fact" : "observation";
          const item = assertion(
            normalizeId(`a-${adapter.capability.adapterId}-${record.nativeId}-${claimIndex}`),
            kind,
            claim.label,
            kind === "fact" ? 0.95 : 0.8,
            [evidenceId]
          );
          response[kind === "fact" ? "facts" : "observations"].push(item);
          normalizedClaims.push({ ...claim, evidenceId, assertionId: item.assertionId });
        }
      }
    } catch (error) {
      const denied = error.code === "SOURCE_ACCESS_DENIED";
      step.status = denied ? "denied" : "failed";
      step.detail = denied ? "Access denied" : "Source unavailable";
      response.status = "partial";
      const unknownId = normalizeId(`unknown-${adapter.capability.adapterId}`);
      response.unknowns.push(
        assertion(
          unknownId,
          "unknown",
          `${adapter.capability.sourceId} context is unknown because the source was ${denied ? "denied" : "unavailable"}.`,
          1
        )
      );
      emit("source.failed", {
        adapterId: adapter.capability.adapterId,
        code: error.code ?? "SOURCE_ERROR"
      });
    }
  }

  const claimsByField = Map.groupBy(normalizedClaims, (claim) => claim.field);
  for (const [field, claims] of claimsByField) {
    const values = new Set(claims.map((claim) => JSON.stringify(claim.value)));
    if (values.size < 2) continue;
    response.conflicts.push(
      assertion(
        normalizeId(`conflict-${field}`),
        "conflict",
        `Sources disagree about ${field.replaceAll("_", " ")}: ${claims
          .map((claim) => claim.value)
          .join(" versus ")}.`,
        1,
        [...new Set(claims.map((claim) => claim.evidenceId))],
        claims.map((claim) => claim.assertionId)
      )
    );
  }

  const riskClaims = normalizedClaims.filter((claim) => claim.field === "risk_signal");
  if (riskClaims.length) {
    response.hypotheses.push(
      assertion(
        "hypothesis-timeline-risk",
        "hypothesis",
        "The opportunity timeline may be at risk because the security review has not started.",
        0.65,
        riskClaims.map((claim) => claim.evidenceId),
        riskClaims.map((claim) => claim.assertionId)
      )
    );
  }

  if (!normalizedClaims.some((claim) => claim.field === "final_signatory")) {
    response.unknowns.push(
      assertion(
        "unknown-final-signatory",
        "unknown",
        "The final contract signatory is not established by the available sources.",
        1
      )
    );
  }

  const recommendationInputs = [
    ...response.conflicts.map((item) => item.assertionId),
    ...response.hypotheses.map((item) => item.assertionId)
  ];
  response.recommendations.push(
    assertion(
      "recommendation-clarify-date-and-security",
      "recommendation",
      "Confirm the decision date, final signatory, and security-review owner in the conversation.",
      0.9,
      [],
      recommendationInputs
    )
  );

  emit("request.completed", {
    status: response.status,
    evidenceCount: response.evidence.length,
    factCount: response.facts.length,
    observationCount: response.observations.length,
    unknownCount: response.unknowns.length
  });
  return response;
}

export function proposeAction({ actionType, targetAdapterId, rationale, preview, evidenceIds = [] }) {
  return {
    actionId: `proposal-${normalizeId(actionType)}`,
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

export function executeAction() {
  const error = new Error("External writes are disabled for CAP-001.");
  error.code = "EXTERNAL_WRITES_DISABLED";
  throw error;
}

