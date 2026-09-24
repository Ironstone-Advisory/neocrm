// IMP-004 - Status: Implemented. Deterministic, contract-validated, read-only adapter for CAP-001.

import { assertContract } from "../../../packages/contracts/src/runtime.mjs";

const clone = (value) => structuredClone(value);

const partyRef = ({ partyId, displayName, partyType }) => ({
  partyId,
  displayName,
  partyType
});

export function createMockAdapters(fixture, options = {}) {
  assertContract("Fixture", fixture);
  const fail = new Set(options.failAdapterIds ?? []);
  const denied = new Set(options.deniedAdapterIds ?? []);
  const metrics = {
    identityResolutions: 0,
    privateReads: 0,
    readsByAdapter: {}
  };

  const identityResolver = {
    async resolve({ query, selectedPartyId } = {}) {
      metrics.identityResolutions += 1;
      let candidates;
      if (selectedPartyId) {
        candidates = fixture.parties
          .filter((party) => party.partyId === selectedPartyId)
          .map(partyRef);
      } else {
        const normalized = String(query ?? "").toLocaleLowerCase();
        candidates = fixture.parties
          .filter((party) => {
            const names = [party.displayName, ...(party.aliases ?? [])];
            return names.some((name) => normalized.includes(name.toLocaleLowerCase()));
          })
          .map(partyRef);
      }

      const result = {
        contractType: "identity_resolution_result",
        status:
          candidates.length === 1
            ? "resolved"
            : candidates.length > 1
              ? "ambiguous"
              : "not_found",
        candidates
      };
      if (candidates.length === 1) result.selectedPartyId = candidates[0].partyId;
      return assertContract("IdentityResolutionResult", result);
    }
  };

  const adapters = fixture.sources.map((source) => {
    const capability = assertContract("AdapterCapability", clone(source.capability));
    return {
      capability,
      async read(request) {
        const validatedRequest = assertContract("AdapterRequest", clone(request));
        if (validatedRequest.adapterId !== capability.adapterId) {
          const error = new Error("Adapter request was routed to the wrong adapter.");
          error.code = "INVALID_ADAPTER_REQUEST";
          throw error;
        }
        const unsupportedDomains = validatedRequest.domains.filter(
          (domain) => !capability.readDomains.includes(domain)
        );
        const unsupportedFilters = Object.keys(validatedRequest.filters).filter(
          (filter) => !capability.supportedFilters.includes(filter)
        );
        if (unsupportedDomains.length || unsupportedFilters.length) {
          const error = new Error("Adapter request exceeds declared capabilities.");
          error.code = "INVALID_ADAPTER_REQUEST";
          throw error;
        }

        metrics.privateReads += 1;
        metrics.readsByAdapter[capability.adapterId] =
          (metrics.readsByAdapter[capability.adapterId] ?? 0) + 1;

        const retrievedAt = new Date(options.now ?? fixture.clock).toISOString();
        const base = {
          contractType: "adapter_result",
          adapterId: capability.adapterId,
          sourceId: capability.sourceId,
          retrievedAt,
          records: [],
          roles: [],
          relationships: []
        };

        if (
          denied.has(capability.adapterId) ||
          capability.authorization.status !== "granted"
        ) {
          return assertContract("AdapterResult", {
            ...base,
            status: "denied",
            error: { code: "SOURCE_ACCESS_DENIED", message: "Access denied by fixture policy." }
          });
        }
        if (fail.has(capability.adapterId)) {
          return assertContract("AdapterResult", {
            ...base,
            status: "failed",
            error: { code: "SOURCE_UNAVAILABLE", message: "Injected source failure." }
          });
        }

        const requestedDomains = new Set(validatedRequest.domains);
        const effectiveAfter = validatedRequest.filters.effectiveAfter
          ? Date.parse(validatedRequest.filters.effectiveAfter)
          : Number.NEGATIVE_INFINITY;
        const effectiveBefore = validatedRequest.filters.effectiveBefore
          ? Date.parse(validatedRequest.filters.effectiveBefore)
          : Number.POSITIVE_INFINITY;
        const records = source.records
          .filter((record) => record.partyId === validatedRequest.filters.partyId)
          .filter((record) => {
            const effectiveAt = Date.parse(record.effectiveAt);
            return effectiveAt >= effectiveAfter && effectiveAt <= effectiveBefore;
          })
          .map((record) => ({
            ...clone(record),
            claims: record.claims.filter((claim) => requestedDomains.has(claim.domain))
          }))
          .filter((record) => record.claims.length > 0);

        const nativeIds = new Set(records.map((record) => record.nativeId));
        return assertContract("AdapterResult", {
          ...base,
          status: "ok",
          records,
          roles: fixture.roles.filter((role) =>
            role.partyId === validatedRequest.filters.partyId &&
            role.provenance.some(
              (sourceRef) =>
                sourceRef.adapterId === capability.adapterId || nativeIds.has(sourceRef.nativeId)
            )
          ),
          relationships: fixture.relationships.filter((relationship) =>
            relationship.participantPartyIds.includes(validatedRequest.filters.partyId) &&
            relationship.provenance.some(
              (sourceRef) =>
                sourceRef.adapterId === capability.adapterId || nativeIds.has(sourceRef.nativeId)
            )
          )
        });
      }
    };
  });

  return { identityResolver, adapters, metrics };
}
