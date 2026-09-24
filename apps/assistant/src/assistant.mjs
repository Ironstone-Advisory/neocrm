// IMP-003 - Status: Implemented. Chatbot-first rendering for the CAP-001 reference slice.

import { buildRelationshipBrief } from "../../../packages/relationship-intelligence/src/index.mjs";
import { assertContract } from "../../../packages/contracts/src/runtime.mjs";

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const COMPANY_PATTERN = /\b(?:at|from)\s+([^,;?.]+)/i;

const clone = (value) => structuredClone(value);

function defaultConversationState(conversationId = "conversation-cap-001") {
  return {
    conversationId,
    turnCount: 0,
    corrections: []
  };
}

function assertConversationState(state) {
  assertContract("RelationshipBriefRequest", {
    contractType: "relationship_brief_request",
    version: "1.0",
    message: "Validate conversation state",
    state
  });
  return state;
}

function normalizeContext(message, sessionContext = {}) {
  const suppliedState = sessionContext.state ?? sessionContext;
  const state = {
    ...defaultConversationState(suppliedState.conversationId),
    ...Object.fromEntries(
      [
        "conversationId",
        "turnCount",
        "selectedPartyId",
        "pendingIdentityQuery",
        "corrections",
        "lastBrief"
      ]
        .filter((key) => suppliedState[key] !== undefined)
        .map((key) => [key, clone(suppliedState[key])])
    )
  };
  const request = assertContract("RelationshipBriefRequest", {
    contractType: "relationship_brief_request",
    version: "1.0",
    message,
    state
  });
  return {
    traceId: sessionContext.traceId,
    selectedPartyId: sessionContext.selectedPartyId,
    clearSelection: sessionContext.clearSelection === true,
    state: request.state
  };
}

function identityHints(message) {
  const email = String(message).match(EMAIL_PATTERN)?.[0]?.toLocaleLowerCase();
  const company = String(message).match(COMPANY_PATTERN)?.[1]?.trim().toLocaleLowerCase();
  return { ...(email ? { email } : {}), ...(company ? { company } : {}) };
}

function narrowWithHints(result, hints) {
  const terms = [hints.email, hints.company].filter(Boolean);
  if (result.status !== "ambiguous" || terms.length === 0) return result;

  const candidates = result.candidates.filter((candidate) => {
    const label = candidate.disambiguationLabel?.toLocaleLowerCase() ?? "";
    return terms.every((term) => label.includes(term));
  });
  if (candidates.length === 1) {
    return { ...result, status: "resolved", candidates, selectedPartyId: candidates[0].partyId };
  }
  if (candidates.length === 0) {
    return {
      contractType: "identity_resolution_result",
      status: "not_found",
      candidates: []
    };
  }
  return { ...result, candidates };
}

function pendingCandidates(state) {
  return state.lastBrief?.status === "needs_disambiguation"
    ? state.lastBrief.subject?.candidates ?? []
    : [];
}

function clearSelection(state) {
  const next = clone(state);
  delete next.selectedPartyId;
  delete next.pendingIdentityQuery;
  delete next.lastBrief;
  return assertConversationState(next);
}

function evidenceIndex(response) {
  return new Map(
    response.evidence.map((item) => [
      item.evidenceId,
      `${item.marker}:${item.source.sourceId}`
    ])
  );
}

function provenanceMarker(item, evidenceById) {
  const sources = item.evidenceIds
    .map((evidenceId) => evidenceById.get(evidenceId))
    .filter(Boolean);
  if (sources.length > 0) return ` [${[...new Set(sources)].join(", ")}]`;
  return ` [derived:${item.derivation.transformationId}]`;
}

function isWhyIntent(message) {
  return /^\s*why(?:\s+(?:is|was|does|did|do|should|would|are|were|that|this|so)\b[^?!.]*)?[?!.]*\s*$/i.test(
    message
  );
}

function approvedProvenance(item, evidenceById) {
  const sources = item.evidenceIds
    .map((evidenceId) => evidenceById.get(evidenceId))
    .filter(Boolean)
    .map(({ marker, source }) => `[${marker}:${source.sourceId}; ${source.authority}]`);
  const sourceText = sources.length > 0 ? [...new Set(sources)].join(", ") : "no direct source";
  const inputCount = item.derivation.inputAssertionIds.length;
  const inputText = inputCount > 0 ? ` from ${inputCount} prior assertion${inputCount === 1 ? "" : "s"}` : "";
  return `${sourceText}; ${item.derivation.transformationId}${inputText}`;
}

export function renderWhy(response) {
  const evidenceById = new Map(
    response.evidence.map((item) => [item.evidenceId, { marker: item.marker, source: item.source }])
  );
  const groups = [
    ["known fact", response.facts],
    ["observation", response.observations],
    ["interpretation", response.interpretations],
    ["hypothesis", response.hypotheses],
    ["unknown", response.unknowns],
    ["conflict", response.conflicts],
    ["recommendation", response.recommendations]
  ];
  const lines = groups.flatMap(([label, items]) =>
    items.map(
      (item, index) =>
        `- ${label} ${index + 1}: ${approvedProvenance(item, evidenceById)}`
    )
  );
  return [
    `# Why this brief is supported for ${response.subject.displayName}`,
    "This explanation uses approved provenance and derivation metadata only; raw source text is not repeated.",
    ...(lines.length > 0 ? lines : ["- No supported claims are available to explain."])
  ].join("\n");
}

function clarificationResponse({ traceId, message, sessionContextUsed }) {
  return assertContract("ResponseEnvelope", {
    contractType: "response_envelope",
    version: "1.0",
    traceId,
    intent: "relationship_brief",
    status: "needs_clarification",
    subject: { unresolvedQuery: message },
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
    memory: { sessionContextUsed, durableMemoryWritten: false },
    policy: { externalWrites: "disabled" }
  });
}

const section = (title, items, evidenceById) =>
  items.length
    ? `\n## ${title}\n${items
        .map((item) => `- ${item.text}${provenanceMarker(item, evidenceById)}`)
        .join("\n")}\n`
    : "";

export function renderRelationshipBrief(response) {
  if (response.status === "needs_disambiguation") {
    return [
      "I found more than one matching person. Which one did you mean?",
      ...response.subject.candidates.map(
        (candidate, index) =>
          `${index + 1}. ${candidate.displayName} (${candidate.partyType})`
      )
    ].join("\n");
  }
  if (response.status === "error") return response.unknowns[0]?.text ?? "No brief available.";

  const evidenceById = evidenceIndex(response);

  return (
    `# Relationship brief: ${response.subject.displayName}\n` +
    section("Known facts", response.facts, evidenceById) +
    section("Recent observations", response.observations, evidenceById) +
    section("Conflicts", response.conflicts, evidenceById) +
    section("Hypotheses", response.hypotheses, evidenceById) +
    section("Unknowns", response.unknowns, evidenceById) +
    section("Recommended conversation focus", response.recommendations, evidenceById)
  ).trim();
}

export function createAssistant({ identityResolver, adapters, now, logger }) {
  return {
    clearSelection,

    async respond(message, sessionContext = {}) {
      const context = normalizeContext(message, sessionContext);
      if (context.clearSelection) {
        const state = clearSelection(context.state);
        return {
          message: "Selection cleared. Tell me which person you want to discuss.",
          structured: null,
          state
        };
      }

      if (isWhyIntent(message)) {
        const selectedPartyId = context.selectedPartyId ?? context.state.selectedPartyId;
        const priorBrief = context.state.lastBrief;
        const sameSelectedParty =
          selectedPartyId && priorBrief?.subject?.partyId === selectedPartyId;
        const state = clone(context.state);
        state.turnCount += 1;

        if (sameSelectedParty) {
          const structured = clone(priorBrief);
          structured.memory.sessionContextUsed = true;
          assertContract("ResponseEnvelope", structured);
          state.lastBrief = clone(structured);
          assertConversationState(state);
          return {
            message: renderWhy(structured),
            structured,
            state
          };
        }

        assertConversationState(state);
        return {
          message: "Ask for a relationship brief and select a person before asking why.",
          structured: clarificationResponse({
            traceId: context.traceId ?? "trace-cap-001",
            message,
            sessionContextUsed: Object.keys(sessionContext).length > 0
          }),
          state
        };
      }

      const priorCandidates = pendingCandidates(context.state);
      const requestedPartyId = context.selectedPartyId ?? context.state.selectedPartyId;
      const invalidPendingSelection =
        requestedPartyId &&
        priorCandidates.length > 0 &&
        !priorCandidates.some((candidate) => candidate.partyId === requestedPartyId);
      const selectedPartyId = invalidPendingSelection ? undefined : requestedPartyId;
      const query = context.state.pendingIdentityQuery && selectedPartyId
        ? context.state.pendingIdentityQuery
        : message;
      const hints = identityHints(query);
      let identity = invalidPendingSelection
        ? {
            contractType: "identity_resolution_result",
            status: "ambiguous",
            candidates: priorCandidates
          }
        : await identityResolver.resolve({ query, selectedPartyId, hints });
      identity = narrowWithHints(identity, hints);

      const structured = await buildRelationshipBrief({
        query,
        selectedPartyId,
        identityResolver: { resolve: async () => clone(identity) },
        adapters,
        now,
        traceId: context.traceId ?? "trace-cap-001",
        logger,
        sessionContextUsed: Object.keys(sessionContext).length > 0
      });
      structured.memory.sessionContextUsed = Object.keys(sessionContext).length > 0;

      const state = clone(context.state);
      state.turnCount += 1;
      state.lastBrief = clone(structured);
      if (structured.status === "needs_disambiguation") {
        delete state.selectedPartyId;
        state.pendingIdentityQuery = query;
      } else if (structured.status === "complete" || structured.status === "partial") {
        const priorPartyId = context.state.selectedPartyId;
        const resolvedPartyId = structured.subject.partyId;
        if (priorPartyId && priorPartyId !== resolvedPartyId) {
          state.corrections.push({
            assertionId: "party.identity",
            replacement: resolvedPartyId,
            recordedAt: new Date(now).toISOString()
          });
        }
        state.selectedPartyId = resolvedPartyId;
        delete state.pendingIdentityQuery;
      } else {
        delete state.pendingIdentityQuery;
      }
      assertConversationState(state);
      return {
        message: renderRelationshipBrief(structured),
        structured,
        state
      };
    }
  };
}
