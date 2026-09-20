// IMP-003: chatbot-first rendering for the CAP-001 reference slice.

import { buildRelationshipBrief } from "../../../packages/relationship-intelligence/src/index.mjs";

const section = (title, items) =>
  items.length
    ? `\n## ${title}\n${items.map((item) => `- ${item.text}`).join("\n")}\n`
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

  return (
    `# Relationship brief: ${response.subject.displayName}\n` +
    section("Known facts", response.facts) +
    section("Recent observations", response.observations) +
    section("Conflicts", response.conflicts) +
    section("Hypotheses", response.hypotheses) +
    section("Unknowns", response.unknowns) +
    section("Recommended conversation focus", response.recommendations)
  ).trim();
}

export function createAssistant({ identityResolver, adapters, now, logger }) {
  return {
    async respond(message, sessionContext = {}) {
      const structured = await buildRelationshipBrief({
        query: message,
        identityResolver,
        adapters,
        now,
        traceId: sessionContext.traceId ?? "trace-cap-001",
        logger
      });
      structured.memory.sessionContextUsed = Object.keys(sessionContext).length > 0;
      return {
        message: renderRelationshipBrief(structured),
        structured
      };
    }
  };
}

