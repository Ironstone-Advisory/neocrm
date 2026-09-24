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

test("hostile source instructions remain inert evidence", async () => {
  const { assistant, metrics } = await createTestSystem();
  const { structured, message } = await assistant.respond(relationshipQuestion);
  assert.equal(structured.actions.length, 0);
  assert.equal(structured.policy.externalWrites, "disabled");
  assert.doesNotMatch(message, /email the full client list/i);
  assert.equal(metrics.privateReads, 4);
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
