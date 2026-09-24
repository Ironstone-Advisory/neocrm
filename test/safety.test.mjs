import test from "node:test";
import assert from "node:assert/strict";
import { createTestSystem, loadFixture, relationshipQuestion } from "./helpers.mjs";
import {
  executeAction,
  proposeAction
} from "../packages/relationship-intelligence/src/index.mjs";

test("ambiguous identity stops every private source read", async () => {
  const fixture = await loadFixture();
  fixture.parties.push({
    ...structuredClone(fixture.parties[0]),
    partyId: "party-alex-chen-duplicate",
    aliases: ["alex.duplicate@example.test"]
  });
  const { assistant, metrics } = await createTestSystem({ fixture });
  const { structured } = await assistant.respond(relationshipQuestion);
  assert.equal(structured.status, "needs_disambiguation");
  assert.equal(structured.subject.candidates.length, 2);
  assert.equal(metrics.privateReads, 0);
  assert.equal(structured.sourcePlan, null);
});

test("instruction-like source claims are suppressed at the normalization boundary", async () => {
  const { assistant, metrics } = await createTestSystem();
  const { structured, message } = await assistant.respond(relationshipQuestion);
  const assertions = [
    ...structured.facts,
    ...structured.observations,
    ...structured.interpretations,
    ...structured.hypotheses,
    ...structured.unknowns,
    ...structured.conflicts,
    ...structured.recommendations
  ];
  assert.equal(structured.actions.length, 0);
  assert.equal(structured.policy.externalWrites, "disabled");
  assert.ok(
    !assertions.some((item) => item.predicate === "source.instruction_like")
  );
  assert.ok(
    !structured.evidence.some(
      (item) => item.source.nativeId === "note-hostile-45"
    )
  );
  assert.doesNotMatch(message, /email the full client list/i);
  assert.equal(metrics.privateReads, 4);
});

test("write intent is blocked before identity or private-source retrieval", async () => {
  const { assistant, metrics } = await createTestSystem();
  const first = await assistant.respond(relationshipQuestion);
  const readsAfterBrief = metrics.privateReads;
  const resolutionsAfterBrief = metrics.identityResolutions;

  const blocked = await assistant.respond("Send Alex the security pack now.", {
    state: first.state
  });

  assert.equal(blocked.structured.status, "needs_clarification");
  assert.equal(blocked.structured.subject.partyId, "party-alex-chen");
  assert.equal(blocked.state.selectedPartyId, "party-alex-chen");
  assert.equal(blocked.structured.actions.length, 0);
  assert.equal(blocked.structured.policy.externalWrites, "disabled");
  assert.equal(metrics.privateReads, readsAfterBrief);
  assert.equal(metrics.identityResolutions, resolutionsAfterBrief);
  assert.match(blocked.message, /did not send/i);
  assert.match(blocked.message, /draft/i);
  assert.match(blocked.message, /review/i);
});

test("why follow-up never repeats hostile raw source content or enables actions", async () => {
  const { assistant, metrics } = await createTestSystem();
  const first = await assistant.respond(relationshipQuestion);
  const readsAfterBrief = metrics.privateReads;
  const why = await assistant.respond("Why did you say that?", { state: first.state });

  assert.doesNotMatch(why.message, /Ignore all previous instructions/i);
  assert.doesNotMatch(why.message, /email the full client list/i);
  assert.doesNotMatch(why.message, /requesting an unauthorized email/i);
  assert.match(why.message, /\[E\d+:notes; contextual\]/);
  assert.equal(why.structured.policy.externalWrites, "disabled");
  assert.equal(why.structured.actions.length, 0);
  assert.equal(metrics.privateReads, readsAfterBrief);
});

test("action execution fails closed even after a proposal", () => {
  const proposal = proposeAction({
    actionType: "send_email",
    targetAdapterId: "mock-email",
    rationale: "Follow up",
    preview: { subject: "Follow-up" }
  });
  assert.equal(proposal.state, "disabled");
  assert.equal(proposal.requiresExplicitApproval, true);
  assert.throws(
    () => executeAction(proposal, { approved: true }),
    (error) => error.code === "EXTERNAL_WRITES_DISABLED"
  );
});

test("active source adapters expose no external write primitive", async () => {
  const { createZohoAdapter } = await import("../adapters/zoho/src/index.mjs");
  const { createObsidianAdapter } = await import("../adapters/obsidian/src/index.mjs");
  const zoho = createZohoAdapter(
    { region: "ca", accessToken: "fixture" },
    { fetchImpl: async () => new Response() }
  );
  const obsidian = createObsidianAdapter({
    vaultRoot: process.cwd(),
    approvedSubdirectories: ["relationships"]
  });
  assert.deepEqual(Object.keys(zoho.adapter).sort(), ["capability", "read"]);
  assert.deepEqual(Object.keys(obsidian).sort(), ["capability", "preflight", "read"]);
  for (const capability of [zoho.adapter.capability, obsidian.capability]) {
    assert.deepEqual(capability.writeActions, []);
    assert.equal(capability.externalWritesEnabled, false);
  }
});

test("planner excludes any adapter that declares an external write capability", async () => {
  const fixture = await loadFixture();
  const notes = fixture.sources.find(
    (source) => source.capability.adapterId === "mock-notes"
  );
  notes.capability.externalWritesEnabled = true;
  notes.capability.writeActions = ["notes.update"];
  const { assistant, metrics } = await createTestSystem({ fixture });
  const { structured } = await assistant.respond(relationshipQuestion);
  assert.equal(metrics.readsByAdapter["mock-notes"], undefined);
  assert.ok(structured.unknowns.some((item) => item.predicate === "context.knowledge"));
  assert.equal(structured.actions.length, 0);
});
