import { assertContract } from "../../contracts/src/runtime.mjs";

export const CAP001_RELATIONSHIP_BRIEF_DOMAINS = Object.freeze([
  "party",
  "relationship",
  "commercial",
  "activity",
  "knowledge",
  "time"
]);

const authorityRank = { contextual: 1, corroborating: 2, authoritative: 3 };

function usableDomains(capability) {
  const declared = new Set(capability.domainAuthorities.map(({ domain }) => domain));
  return capability.readDomains.filter((domain) => declared.has(domain));
}

function combinations(items, count, start = 0, prefix = [], output = []) {
  if (prefix.length === count) {
    output.push(prefix);
    return output;
  }
  for (let index = start; index <= items.length - (count - prefix.length); index += 1) {
    combinations(items, count, index + 1, [...prefix, items[index]], output);
  }
  return output;
}

function quality(selection) {
  return selection.reduce(
    (total, item) =>
      total +
      item.capability.domainAuthorities.reduce(
        (sum, entry) => sum + (authorityRank[entry.authority] ?? 0),
        0
      ),
    0
  );
}

export function planMinimumSources({
  adapters,
  subjectPartyId,
  intent,
  requiredDomains
}) {
  if (!intent || !Array.isArray(requiredDomains) || requiredDomains.length === 0) {
    throw new TypeError("Context planning requires an explicit intent and requiredDomains.");
  }
  const distinctRequiredDomains = [...new Set(requiredDomains)];
  const candidates = adapters.map((adapter) => {
    if (!adapter || typeof adapter.read !== "function") {
      throw new TypeError("Every adapter must expose read().");
    }
    const capability = assertContract("AdapterCapability", adapter.capability);
    return { adapter, capability, domains: usableDomains(capability) };
  });

  const eligible = candidates.filter(
    ({ capability }) =>
      capability.authorization.status === "granted" &&
      capability.supportedFilters.includes("partyId") &&
      capability.externalWritesEnabled === false
  );
  const coverable = new Set(eligible.flatMap(({ domains }) => domains));
  const target = distinctRequiredDomains.filter((domain) => coverable.has(domain));

  let selected = [];
  for (let size = 1; size <= eligible.length; size += 1) {
    const covering = combinations(eligible, size).filter((selection) => {
      const coverage = new Set(selection.flatMap(({ domains }) => domains));
      return target.every((domain) => coverage.has(domain));
    });
    if (covering.length) {
      covering.sort(
        (left, right) =>
          quality(right) - quality(left) ||
          left
            .map(({ capability }) => capability.adapterId)
            .sort()
            .join(",")
            .localeCompare(
              right
                .map(({ capability }) => capability.adapterId)
                .sort()
                .join(",")
            )
      );
      selected = covering[0];
      break;
    }
  }

  const selectedCoverage = new Set();
  const executions = selected
    .sort((left, right) => left.capability.adapterId.localeCompare(right.capability.adapterId))
    .map(({ adapter, capability, domains }) => {
      const requestedDomains = domains.filter((domain) => target.includes(domain));
      requestedDomains.forEach((domain) => selectedCoverage.add(domain));
      const request = assertContract("AdapterRequest", {
        contractType: "adapter_request",
        adapterId: capability.adapterId,
        domains: requestedDomains,
        filters: { partyId: subjectPartyId }
      });
      return {
        adapter,
        capability,
        request,
        step: {
          adapterId: capability.adapterId,
          domains: requestedDomains,
          filters: request.filters,
          reason: `Minimum source set for ${requestedDomains.join(", ")} context.`,
          authorization: capability.authorization.status,
          freshness: "unknown",
          status: "planned"
        }
      };
    });

  return {
    plan: {
      intent,
      subjectPartyId,
      steps: executions.map(({ step }) => step)
    },
    executions,
    uncoveredDomains: distinctRequiredDomains.filter(
      (domain) => !selectedCoverage.has(domain)
    )
  };
}
