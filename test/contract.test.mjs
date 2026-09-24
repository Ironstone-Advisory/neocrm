import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createTestSystem, relationshipQuestion } from "./helpers.mjs";

test("normative schema defines every core contract and all Party types", async () => {
  const schema = JSON.parse(
    await readFile(
      new URL("../spec/contracts/capabilities/cap-001.schema.json", import.meta.url),
      "utf8"
    )
  );
  for (const name of [
    "Party",
    "Role",
    "Relationship",
    "Assertion",
    "ContextPlan",
    "ResponseEnvelope",
    "ActionProposal",
    "AdapterCapability",
    "AdapterRequest",
    "AdapterResult"
  ]) {
    assert.ok(schema.$defs[name], `missing schema definition ${name}`);
  }
  assert.deepEqual(
    schema.$defs.Party.oneOf.map((entry) => entry.$ref.split("/").at(-1)),
    ["Person", "Company", "Household"]
  );
});

test("CAP-001 output carries the required response-envelope fields", async () => {
  const schema = JSON.parse(
    await readFile(
      new URL("../spec/contracts/capabilities/cap-001.schema.json", import.meta.url),
      "utf8"
    )
  );
  const { assistant } = await createTestSystem();
  const { structured } = await assistant.respond(relationshipQuestion);
  for (const field of schema.$defs.ResponseEnvelope.required) {
    assert.ok(Object.hasOwn(structured, field), `missing response field ${field}`);
  }
  const knownEvidence = new Set(structured.evidence.map((item) => item.evidenceId));
  for (const item of [...structured.facts, ...structured.observations]) {
    assert.ok(item.evidenceIds.length > 0);
    assert.ok(item.evidenceIds.every((id) => knownEvidence.has(id)));
  }
});
