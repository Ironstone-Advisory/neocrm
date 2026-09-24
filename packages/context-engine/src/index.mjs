// IMP-007 - Status: Implemented. Credential-isolating CAP-001 context boundary.
import { buildRelationshipBrief } from "../../relationship-intelligence/src/index.mjs";

export function createRelationshipContextBoundary({
  identityResolver,
  adapters,
  now,
  logger = { log() {} }
}) {
  if (!identityResolver || !Array.isArray(adapters)) {
    throw new TypeError("The context boundary requires an identity resolver and adapters.");
  }

  return Object.freeze({
    async resolve({ trigger, goal, traceId }) {
      if (goal.intent !== "relationship_brief") {
        throw new Error("The EXP-001 context boundary only supports relationship_brief.");
      }
      return buildRelationshipBrief({
        query: trigger.query,
        selectedPartyId: trigger.selectedPartyId,
        identityResolver,
        adapters,
        now,
        traceId,
        logger
      });
    }
  });
}
