import { assertContract } from "../../contracts/src/runtime.mjs";
import { createAssertion } from "./assertions.mjs";
import { opaqueId } from "./ids.mjs";

const authorityRank = { contextual: 1, corroborating: 2, authoritative: 3 };
const authorityAtRank = { 1: "contextual", 2: "corroborating", 3: "authoritative" };

function constrainedAuthority(claimed, declared) {
  return authorityAtRank[Math.min(authorityRank[claimed] ?? 1, authorityRank[declared] ?? 1)];
}

function declaredAuthority(capability, domain) {
  const entry = capability.domainAuthorities.find((item) => item.domain === domain);
  if (!entry) {
    const error = new Error(
      `${capability.adapterId} has no authority declaration for requested domain ${domain}.`
    );
    error.code = "UNDECLARED_DOMAIN_AUTHORITY";
    throw error;
  }
  return entry.authority;
}

function sourceRef({
  capability,
  nativeId,
  retrievedAt,
  effectiveAt,
  authority,
  provenance = {}
}) {
  return {
    sourceId: capability.sourceId,
    adapterId: capability.adapterId,
    nativeId,
    retrievedAt,
    effectiveAt: effectiveAt ?? null,
    authority,
    completeness: provenance.completeness ?? "unknown",
    ...Object.fromEntries(
      ["sourceModule", "fieldApiName", "modifiedAt", "transformation"]
        .filter((key) => provenance[key] !== undefined)
        .map((key) => [key, provenance[key]])
    )
  };
}

const CONTROL_DIRECTIVE_PATTERN = new RegExp(
  [
    "\\b(?:ignore|disregard|override)\\b[\\s\\S]{0,80}\\b(?:instruction|policy|system|developer)\\b",
    "\\b(?:system|developer)\\s+(?:message|prompt)\\b",
    "\\b(?:create|invoke|call|use)\\b[\\s\\S]{0,60}\\b(?:tool|function)\\b",
    "[\\\"']?(?:tool|function|action|policy|state)[\\\"']?\\s*:\\s*[\\\"']?(?:execute|executed|send|delete|update)"
  ].join("|"),
  "i"
);

function containsControlDirective(claim) {
  if (claim.instructionLike === true) return true;
  const value = typeof claim.value === "string"
    ? claim.value
    : JSON.stringify(claim.value);
  return CONTROL_DIRECTIVE_PATTERN.test(`${claim.label}\n${value ?? ""}`);
}

function admissibleBusinessEvidence(claim) {
  return (
    claim.contentType === "business_evidence" &&
    !containsControlDirective(claim) &&
    !claim.predicate.startsWith("source.") &&
    !claim.predicate.startsWith("tool.") &&
    !claim.predicate.startsWith("policy.") &&
    !claim.predicate.startsWith("action.")
  );
}

function addEvidenceAndAssertion({
  output,
  nextMarker,
  capability,
  nativeId,
  retrievedAt,
  effectiveAt,
  authority,
  predicate,
  value,
  text,
  epistemicCategory = "observation",
  confidence,
  untrustedContent = true,
  discriminator,
  provenance
}) {
  const evidenceId = opaqueId(
    "evidence",
    capability.adapterId,
    nativeId,
    predicate,
    value,
    discriminator
  );
  output.evidence.push({
    evidenceId,
    marker: nextMarker(),
    source: sourceRef({ capability, nativeId, retrievedAt, effectiveAt, authority, provenance }),
    summary: text,
    untrustedContent
  });
  output.assertions.push(
    createAssertion({
      kind: epistemicCategory,
      predicate,
      value,
      text,
      confidence,
      evidenceIds: [evidenceId],
      transformationId: "normalize-adapter-evidence-v1",
      extractor: "adapter"
    })
  );
}

function verifyBoundary(capability, request, result) {
  const validated = assertContract("AdapterResult", result);
  if (
    validated.adapterId !== capability.adapterId ||
    validated.sourceId !== capability.sourceId ||
    request.adapterId !== capability.adapterId
  ) {
    const error = new Error("Adapter result identity does not match its capability/request.");
    error.code = "ADAPTER_BOUNDARY_MISMATCH";
    throw error;
  }
  return validated;
}

export function normalizeAdapterResult({
  capability,
  request,
  result,
  now,
  nextMarker,
  subject
}) {
  const validated = verifyBoundary(capability, request, result);
  const ageSeconds = Math.max(0, (Date.parse(now) - Date.parse(validated.retrievedAt)) / 1000);
  const freshness = Number.isFinite(ageSeconds)
    ? ageSeconds <= capability.freshnessPolicy.maximumAgeSeconds
      ? "fresh"
      : "stale"
    : "unknown";
  const output = { result: validated, freshness, evidence: [], assertions: [] };

  if (validated.status !== "ok" || freshness !== "fresh") return output;

  for (const record of validated.records) {
    if (record.partyId !== request.filters.partyId) {
      const error = new Error("Adapter returned a record outside the requested Party scope.");
      error.code = "ADAPTER_SCOPE_VIOLATION";
      throw error;
    }
    for (const claim of record.claims) {
      // Only claims explicitly placed in the data-only business-evidence
      // channel can cross this boundary. Source text cannot become policy,
      // tools, actions, or executable directives regardless of its wording.
      if (!admissibleBusinessEvidence(claim)) continue;
      if (!request.domains.includes(claim.domain) || !capability.readDomains.includes(claim.domain)) {
        const error = new Error("Adapter returned a claim outside the requested domain scope.");
        error.code = "ADAPTER_SCOPE_VIOLATION";
        throw error;
      }
      const authority = constrainedAuthority(
        claim.authority ?? declaredAuthority(capability, claim.domain),
        declaredAuthority(capability, claim.domain)
      );
      addEvidenceAndAssertion({
        output,
        nextMarker,
        capability,
        nativeId: record.nativeId,
        retrievedAt: validated.retrievedAt,
        effectiveAt: record.effectiveAt,
        authority,
        predicate: claim.predicate,
        value: claim.value,
        text: claim.label,
        epistemicCategory: claim.epistemicCategory,
        confidence: claim.confidence,
        untrustedContent: record.untrustedContent ?? true,
        discriminator: claim.domain,
        provenance: claim
      });
    }
  }

  if (request.domains.includes("relationship")) {
    const domainAuthority = declaredAuthority(capability, "relationship");
    for (const role of validated.roles) {
      const provenance = role.provenance.find(
        (entry) => entry.adapterId === capability.adapterId
      );
      if (!provenance || role.partyId !== request.filters.partyId) continue;
      const authority = constrainedAuthority(provenance.authority, domainAuthority);
      const context = role.contextPartyId ? ` in ${role.contextPartyId}` : "";
      addEvidenceAndAssertion({
        output,
        nextMarker,
        capability,
        nativeId: provenance.nativeId,
        retrievedAt: validated.retrievedAt,
        effectiveAt: provenance.effectiveAt ?? role.validFrom,
        authority,
        predicate: `role.${role.roleType}`,
        value: {
          roleType: role.roleType,
          contextPartyId: role.contextPartyId ?? null,
          validFrom: role.validFrom,
          validTo: role.validTo ?? null
        },
        text: `${subject.displayName} has the ${role.roleType.replaceAll("_", " ")} role${context}.`,
        epistemicCategory: role.epistemicCategory ?? "observation",
        discriminator: role.roleId
      });
    }

    for (const relationship of validated.relationships) {
      const provenance = relationship.provenance.find(
        (entry) => entry.adapterId === capability.adapterId
      );
      if (
        !provenance ||
        !relationship.participantPartyIds.includes(request.filters.partyId)
      ) {
        continue;
      }
      const authority = constrainedAuthority(provenance.authority, domainAuthority);
      addEvidenceAndAssertion({
        output,
        nextMarker,
        capability,
        nativeId: provenance.nativeId,
        retrievedAt: validated.retrievedAt,
        effectiveAt: provenance.effectiveAt ?? relationship.validFrom,
        authority,
        predicate: `relationship.${relationship.relationshipType}`,
        value: {
          participantPartyIds: relationship.participantPartyIds,
          direction: relationship.direction,
          validFrom: relationship.validFrom,
          validTo: relationship.validTo ?? null
        },
        text: `${subject.displayName} participates in an ${relationship.relationshipType.replaceAll("_", " ")} relationship.`,
        epistemicCategory: relationship.epistemicCategory ?? "observation",
        discriminator: relationship.relationshipId
      });
    }
  }

  return output;
}
