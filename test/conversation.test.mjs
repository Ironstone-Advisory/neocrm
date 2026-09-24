import test from "node:test";
import assert from "node:assert/strict";
import { createAssistant } from "../apps/assistant/src/assistant.mjs";
import { createTestSystem, relationshipQuestion } from "./helpers.mjs";

test("relationship brief renders distinct epistemic sections", async () => {
  const { assistant } = await createTestSystem();
  const response = await assistant.respond(relationshipQuestion);

  assert.equal(response.structured.status, "complete");
  assert.equal(response.structured.subject.displayName, "Alex Chen");
  assert.match(response.message, /Known facts/);
  assert.match(response.message, /Recent observations/);
  assert.match(response.message, /Conflicts/);
  assert.match(response.message, /Hypotheses/);
  assert.match(response.message, /Unknowns/);
  assert.match(response.message, /Recommended conversation focus/);
  assert.match(response.message, /\[E\d+:crm\]/);
  assert.match(response.message, /\[E\d+:notes\]/);
  assert.ok(response.structured.facts.length >= 5);
  assert.ok(response.structured.observations.length >= 5);
  assert.equal(response.structured.conflicts[0].evidenceIds.length, 2);
});

test("why follow-up explains approved provenance for the selected Party without another read", async () => {
  const { assistant, metrics } = await createTestSystem();
  const first = await assistant.respond(relationshipQuestion);
  const readsAfterBrief = metrics.privateReads;

  const why = await assistant.respond("Why?", { state: first.state });

  assert.equal(why.structured.subject.partyId, "party-alex-chen");
  assert.equal(why.structured.policy.externalWrites, "disabled");
  assert.equal(why.structured.actions.length, 0);
  assert.equal(why.structured.memory.durableMemoryWritten, false);
  assert.equal(why.state.turnCount, first.state.turnCount + 1);
  assert.equal(metrics.privateReads, readsAfterBrief);
  assert.match(why.message, /approved provenance and derivation metadata only/i);
  assert.match(why.message, /\[E\d+:crm; authoritative\]/);
  assert.match(why.message, /normalize-adapter-evidence-v1/);
  assert.doesNotMatch(why.message, /Ignore all previous instructions/i);
  assert.doesNotMatch(why.message, /email the full client list/i);
  assert.doesNotMatch(why.message, /requesting an unauthorized email/i);
});

test("why without a matching selected Party asks for context without reading sources", async () => {
  const { assistant, metrics } = await createTestSystem();
  const response = await assistant.respond("Why?");

  assert.equal(response.structured.status, "needs_clarification");
  assert.equal(response.structured.policy.externalWrites, "disabled");
  assert.match(response.message, /select a person/i);
  assert.equal(metrics.privateReads, 0);
});

test("assistant validates the actual request message before resolving identity", async () => {
  const { assistant, metrics } = await createTestSystem();

  await assert.rejects(
    () => assistant.respond(""),
    (error) => error.code === "CONTRACT_VALIDATION_FAILED"
  );
  assert.equal(metrics.identityResolutions, 0);
  assert.equal(metrics.privateReads, 0);
});

test("session use is explicit and durable memory remains untouched", async () => {
  const { assistant } = await createTestSystem();
  const response = await assistant.respond(relationshipQuestion, {
    traceId: "trace-session-1",
    selectedPartyId: "party-alex-chen"
  });
  assert.equal(response.structured.traceId, "trace-session-1");
  assert.equal(response.structured.memory.sessionContextUsed, true);
  assert.equal(response.structured.memory.durableMemoryWritten, false);
});

test("selectedPartyId completes pending disambiguation and persists for a follow-up", async () => {
  const { fixture, adapters, metrics } = await createTestSystem();
  const candidates = [
    {
      partyId: "party-alex-chen",
      displayName: "Alex Chen",
      partyType: "person",
      disambiguationLabel: "Acme Manufacturing · alex.chen@acme.example"
    },
    {
      partyId: "party-alex-other",
      displayName: "Alex Chen",
      partyType: "person",
      disambiguationLabel: "Northwind · alex@northwind.example"
    }
  ];
  const identityResolver = {
    async resolve({ selectedPartyId }) {
      const selected = candidates.find((candidate) => candidate.partyId === selectedPartyId);
      return selected
        ? {
            contractType: "identity_resolution_result",
            status: "resolved",
            candidates: [selected],
            selectedPartyId
          }
        : {
            contractType: "identity_resolution_result",
            status: "ambiguous",
            candidates
          };
    }
  };
  const assistant = createAssistant({
    identityResolver,
    adapters,
    now: fixture.clock,
    logger: { log() {} }
  });

  const first = await assistant.respond(relationshipQuestion);
  assert.equal(first.structured.status, "needs_disambiguation");
  assert.equal(metrics.privateReads, 0);

  const selected = await assistant.respond("The first one", {
    state: first.state,
    selectedPartyId: "party-alex-chen"
  });
  assert.equal(selected.structured.subject.partyId, "party-alex-chen");
  assert.equal(selected.state.selectedPartyId, "party-alex-chen");

  const followUp = await assistant.respond("What else should I know?", {
    state: selected.state
  });
  assert.equal(followUp.structured.subject.partyId, "party-alex-chen");
  assert.equal(followUp.state.selectedPartyId, "party-alex-chen");
});

test("company and email hints narrow candidates before any private read", async () => {
  const { fixture, adapters, metrics } = await createTestSystem();
  const candidates = [
    {
      partyId: "party-alex-chen",
      displayName: "Alex Chen",
      partyType: "person",
      disambiguationLabel: "Acme Manufacturing · alex.chen@acme.example"
    },
    {
      partyId: "party-alex-other",
      displayName: "Alex Chen",
      partyType: "person",
      disambiguationLabel: "Northwind · alex@northwind.example"
    }
  ];
  const identityResolver = {
    async resolve() {
      return {
        contractType: "identity_resolution_result",
        status: "ambiguous",
        candidates
      };
    }
  };
  const assistant = createAssistant({ identityResolver, adapters, now: fixture.clock });

  const byCompany = await assistant.respond("Brief me on Alex Chen at Acme Manufacturing");
  assert.equal(byCompany.structured.subject.partyId, "party-alex-chen");

  const byEmail = await assistant.respond("Brief me on alex.chen@acme.example");
  assert.equal(byEmail.structured.subject.partyId, "party-alex-chen");
  assert.equal(metrics.privateReads, 8);
});

test("changing or clearing a selection updates session state without durable memory", async () => {
  const { assistant, metrics } = await createTestSystem();
  const corrected = await assistant.respond("Use Alex Chen instead", {
    state: {
      conversationId: "conversation-correction",
      turnCount: 1,
      selectedPartyId: "party-alex-other",
      corrections: []
    },
    selectedPartyId: "party-alex-chen"
  });
  assert.equal(corrected.state.selectedPartyId, "party-alex-chen");
  assert.deepEqual(corrected.state.corrections, [
    {
      assertionId: "party.identity",
      replacement: "party-alex-chen",
      recordedAt: "2026-09-20T16:00:00.000Z"
    }
  ]);

  const readsBeforeClear = metrics.privateReads;
  const cleared = await assistant.respond("clear selection", {
    state: corrected.state,
    clearSelection: true
  });
  assert.equal(cleared.structured, null);
  assert.equal(cleared.state.selectedPartyId, undefined);
  assert.equal(cleared.state.lastBrief, undefined);
  assert.equal(cleared.state.corrections.length, 1);
  assert.equal(metrics.privateReads, readsBeforeClear);
});

test("zero matches and invalid ambiguity selections never read private sources", async () => {
  const { fixture, adapters, metrics } = await createTestSystem();
  const candidates = [
    { partyId: "party-alex-chen", displayName: "Alex Chen", partyType: "person" },
    { partyId: "party-alex-other", displayName: "Alex Chen", partyType: "person" }
  ];
  const identityResolver = {
    async resolve({ query }) {
      return query.includes("Nobody")
        ? { contractType: "identity_resolution_result", status: "not_found", candidates: [] }
        : { contractType: "identity_resolution_result", status: "ambiguous", candidates };
    }
  };
  const assistant = createAssistant({ identityResolver, adapters, now: fixture.clock });

  const missing = await assistant.respond("Brief me on Nobody Known");
  assert.equal(missing.structured.status, "error");
  assert.equal(metrics.privateReads, 0);

  const ambiguous = await assistant.respond("Brief me on Alex Chen");
  assert.equal(ambiguous.structured.status, "needs_disambiguation");
  assert.equal(metrics.privateReads, 0);

  const invalid = await assistant.respond("Choose this record", {
    state: ambiguous.state,
    selectedPartyId: "party-not-offered"
  });
  assert.equal(invalid.structured.status, "needs_disambiguation");
  assert.equal(metrics.privateReads, 0);
});
