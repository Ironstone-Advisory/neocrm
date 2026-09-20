// IMP-004: deterministic, read-only adapter implementation for CAP-001.

const clone = (value) => structuredClone(value);

export function createMockAdapters(fixture, options = {}) {
  const fail = new Set(options.failAdapterIds ?? []);
  const denied = new Set(options.deniedAdapterIds ?? []);
  const metrics = {
    identityResolutions: 0,
    privateReads: 0,
    readsByAdapter: {}
  };

  const identityResolver = {
    async resolve(query) {
      metrics.identityResolutions += 1;
      const normalized = query.toLocaleLowerCase();
      return fixture.parties
        .filter((party) => {
          const names = [party.displayName, ...(party.aliases ?? [])];
          return names.some((name) => normalized.includes(name.toLocaleLowerCase()));
        })
        .map(({ partyId, displayName, partyType }) => ({
          partyId,
          displayName,
          partyType
        }));
    }
  };

  const adapters = fixture.sources.map((source) => ({
    capability: {
      adapterId: source.adapterId,
      sourceId: source.sourceId,
      readDomains: clone(source.domains),
      writeActions: [],
      authority: source.authority,
      externalWritesEnabled: false
    },
    async read({ partyId }) {
      metrics.privateReads += 1;
      metrics.readsByAdapter[source.adapterId] =
        (metrics.readsByAdapter[source.adapterId] ?? 0) + 1;
      if (denied.has(source.adapterId)) {
        const error = new Error("access denied by fixture policy");
        error.code = "SOURCE_ACCESS_DENIED";
        throw error;
      }
      if (fail.has(source.adapterId)) {
        const error = new Error("injected source failure");
        error.code = "SOURCE_UNAVAILABLE";
        throw error;
      }
      return clone(source.records.filter((record) => record.partyId === partyId));
    }
  }));

  return { identityResolver, adapters, metrics };
}

