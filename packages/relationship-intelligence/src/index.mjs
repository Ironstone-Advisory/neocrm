// IMP-002 - Status: Implemented. Modular, contract-validated, read-only Relationship Intelligence Layer.

import { createAssertion } from "./assertions.mjs";
import { deriveEpistemicItems } from "./epistemic.mjs";
import { resolveIdentity } from "./identity.mjs";
import { opaqueId } from "./ids.mjs";
import { normalizeAdapterResult } from "./normalize.mjs";
import {
  CAP001_RELATIONSHIP_BRIEF_DOMAINS,
  planMinimumSources
} from "./planner.mjs";
import {
  proposeDisabledAction,
  rejectExternalWrite,
  toModelSafeContext
} from "./policy.mjs";
import { reconcileAssertions } from "./reconcile.mjs";
import { baseEnvelope, finalizeEnvelope, unknownAssertion } from "./response.mjs";

export function createMemoryLogger() {
  const entries = [];
  return {
    entries,
    log(entry) {
      entries.push(structuredClone(entry));
    }
  };
}

function safeSourceFailureCode(status) {
  return status === "denied" ? "SOURCE_ACCESS_DENIED" : "SOURCE_UNAVAILABLE";
}

export async function buildRelationshipBrief({
  query,
  selectedPartyId,
  identityResolver,
  adapters,
  now,
  traceId = "trace-cap-001",
  logger = { log() {} },
  sessionContextUsed = false
}) {
  const currentTime = new Date(now).toISOString();
  const emit = (event, fields = {}) => logger.log({ event, traceId, ...fields });
  emit("request.started", { intent: "relationship_brief" });

  let identity;
  try {
    identity = await resolveIdentity({ identityResolver, query, selectedPartyId });
  } catch {
    emit("identity.failed", { code: "IDENTITY_BOUNDARY_FAILED" });
    const response = baseEnvelope({
      traceId,
      status: "error",
      subject: { unresolvedQuery: String(query) },
      sessionContextUsed
    });
    response.unknowns.push(
      unknownAssertion(
        "party.identity",
        "Party identity could not be resolved because the identity boundary was unavailable."
      )
    );
    emit("request.completed", { status: response.status, evidenceCount: 0 });
    return finalizeEnvelope(response);
  }
  if (identity.status === "ambiguous") {
    emit("identity.ambiguous", { candidateCount: identity.candidates.length });
    const response = baseEnvelope({
      traceId,
      status: "needs_disambiguation",
      subject: { candidates: identity.candidates },
      sessionContextUsed
    });
    response.unknowns.push(
      unknownAssertion(
        "party.identity",
        "More than one Party matches the requested person; select a candidate before private context is retrieved."
      )
    );
    emit("request.completed", { status: response.status, evidenceCount: 0 });
    return finalizeEnvelope(response);
  }

  if (identity.status === "not_found") {
    emit("identity.not_found");
    const response = baseEnvelope({
      traceId,
      status: "error",
      subject: { unresolvedQuery: String(query) },
      sessionContextUsed
    });
    response.unknowns.push(
      unknownAssertion("party.identity", "No Party matched the requested person.")
    );
    emit("request.completed", { status: response.status, evidenceCount: 0 });
    return finalizeEnvelope(response);
  }

  const subject = identity.candidates.find(
    (candidate) => candidate.partyId === identity.selectedPartyId
  );
  emit("identity.resolved", { partyId: subject.partyId, partyType: subject.partyType });
  const response = baseEnvelope({
    traceId,
    status: "complete",
    subject,
    sessionContextUsed
  });
  const { plan, executions, uncoveredDomains } = planMinimumSources({
    adapters,
    subjectPartyId: subject.partyId,
    intent: "relationship_brief",
    requiredDomains: CAP001_RELATIONSHIP_BRIEF_DOMAINS
  });
  response.sourcePlan = plan;

  for (const domain of uncoveredDomains) {
    response.status = "partial";
    response.unknowns.push(
      unknownAssertion(
        `context.${domain}`,
        `${domain} context is unknown because no authorized adapter supports the required Party filter and domain authority.`
      )
    );
  }

  let marker = 0;
  const nextMarker = () => `E${++marker}`;
  const normalizedAssertions = [];
  let successfulSourceCount = 0;
  for (const execution of executions) {
    const { adapter, capability, request, step } = execution;
    try {
      const result = await adapter.read(request);
      const normalized = normalizeAdapterResult({
        capability,
        request,
        result,
        now: currentTime,
        nextMarker,
        subject
      });
      step.freshness = normalized.freshness;

      if (normalized.result.status !== "ok") {
        step.status = normalized.result.status === "denied" ? "denied" : "failed";
        step.detail =
          normalized.result.status === "denied" ? "Access denied" : "Source unavailable";
        response.status = "partial";
        if (normalized.result.status === "denied") {
          for (const domain of request.domains) {
            response.unknowns.push(
              unknownAssertion(
                `context.${domain}`,
                `${domain} context is unavailable due to access policy.`
              )
            );
          }
        } else {
          response.unknowns.push(
            unknownAssertion(
              `source.${capability.sourceId}`,
              `${capability.sourceId} context is unknown because a required source is unavailable.`
            )
          );
        }
        emit("source.failed", {
          adapterId: capability.adapterId,
          code: safeSourceFailureCode(normalized.result.status)
        });
        continue;
      }

      if (normalized.freshness !== "fresh") {
        step.status = "skipped";
        step.detail = "Source result did not satisfy the declared freshness policy";
        response.status = "partial";
        response.unknowns.push(
          unknownAssertion(
            `context.${request.domains[0]}.freshness`,
            `${request.domains.join(", ")} context is unknown because required evidence was not fresh.`
          )
        );
        emit("source.skipped", { adapterId: capability.adapterId, reason: "freshness" });
        continue;
      }

      step.status = "queried";
      successfulSourceCount += 1;
      response.evidence.push(...normalized.evidence);
      normalizedAssertions.push(...normalized.assertions);
      emit("source.completed", {
        adapterId: capability.adapterId,
        recordCount: normalized.result.records.length
      });
    } catch (error) {
      step.status = error.code === "SOURCE_ACCESS_DENIED" ? "denied" : "failed";
      step.detail = step.status === "denied" ? "Access denied" : "Source boundary failed";
      response.status = "partial";
      if (step.status === "denied") {
        for (const domain of request.domains) {
          response.unknowns.push(
            unknownAssertion(
              `context.${domain}`,
              `${domain} context is unavailable due to access policy.`
            )
          );
        }
      } else {
        response.unknowns.push(
          unknownAssertion(
            `source.${capability.sourceId}`,
            `${capability.sourceId} context is unknown because a required source boundary failed closed.`
          )
        );
      }
      emit("source.failed", {
        adapterId: capability.adapterId,
        code: step.status === "denied" ? "SOURCE_ACCESS_DENIED" : "SOURCE_BOUNDARY_FAILED"
      });
    }
  }

  // A degraded brief is useful only when at least one planned source crossed
  // its boundary successfully. If every source is unavailable, denied, stale,
  // or no authorized source can be planned, fail the brief as a whole.
  if (successfulSourceCount === 0) response.status = "error";

  const { assertions, conflicts } = reconcileAssertions(normalizedAssertions);
  response.facts.push(...assertions.filter((item) => item.kind === "fact"));
  response.observations.push(...assertions.filter((item) => item.kind === "observation"));
  response.interpretations.push(
    ...assertions.filter((item) => item.kind === "interpretation")
  );
  response.hypotheses.push(...assertions.filter((item) => item.kind === "hypothesis"));
  response.conflicts.push(...conflicts);

  const derived = deriveEpistemicItems({ assertions, conflicts });
  response.hypotheses.push(...derived.hypotheses);
  response.unknowns.push(...derived.unknowns);
  response.recommendations.push(...derived.recommendations);

  emit("request.completed", {
    status: response.status,
    evidenceCount: response.evidence.length,
    factCount: response.facts.length,
    observationCount: response.observations.length,
    unknownCount: response.unknowns.length
  });
  return finalizeEnvelope(response);
}

export function proposeAction({
  actionType,
  targetAdapterId,
  rationale,
  preview,
  evidenceIds = []
}) {
  return proposeDisabledAction({
    actionId: opaqueId("action", actionType, targetAdapterId, preview),
    actionType,
    targetAdapterId,
    rationale,
    preview,
    evidenceIds
  });
}

export function executeAction() {
  return rejectExternalWrite();
}

export { createAssertion, planMinimumSources, toModelSafeContext };
