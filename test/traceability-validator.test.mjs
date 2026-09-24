import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

import { validateTraceability } from "../scripts/validate-spec.mjs";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFile(resolve(root, path), "utf8");
const manifest = JSON.parse(await read("spec/traceability.json"));
const traceabilitySchema = JSON.parse(await read("spec/traceability.schema.json"));

const validate = (candidate) =>
  validateTraceability({
    manifest: candidate,
    traceabilitySchema,
    loadArtifact: read
  });

const clone = () => structuredClone(manifest);

test("current traceability manifest is internally consistent", async () => {
  assert.deepEqual(await validate(clone()), []);
});

test("keeps adopted decisions independent of partial implementation and planned evidence", async () => {
  const candidate = clone();
  const plannedDecision = candidate.nodes.find((node) => node.id === "ADR-0011");

  assert.equal(plannedDecision.decisionStatus, "Accepted");
  assert.equal(plannedDecision.implementationStatus, "Partial");
  assert.equal(plannedDecision.evidenceMaturity, "Planned");
  assert.deepEqual(await validate(candidate), []);
});

test("rejects a relation whose node kinds violate the typed edge direction", async () => {
  const candidate = clone();
  const link = candidate.links.find(
    (entry) => entry.from === "CAP-001" && entry.to === "FR-RES-001" && entry.relation === "requires"
  );
  link.relation = "governed-by";

  const errors = await validate(candidate);
  assert.ok(errors.some((error) => error.includes("CAP-001 (capability) cannot be source of governed-by")));
  assert.ok(errors.some((error) => error.includes("FR-RES-001 (requirement) cannot be target of governed-by")));
});

test("does not use experiment sequencing as a substitute for scoped evidence", async () => {
  const candidate = clone();
  candidate.links = candidate.links.filter(
    (link) =>
      !(
        link.from === "ADR-0001" &&
        link.to === "EXP-006" &&
        link.relation === "tested-by" &&
        link.evidenceStage === "demonstration"
      )
  );

  const errors = await validate(candidate);
  assert.ok(errors.some((error) => error.includes("ADR-0001 claims Demonstrated without a scoped lifecycle evidence chain")));
});

test("rejects result evidence scoped to a different experiment", async () => {
  const candidate = clone();
  const result = candidate.nodes.find((node) => node.id === "RES-001");
  result.evidence.experiment = "EXP-005";

  const errors = await validate(candidate);
  assert.ok(errors.some((error) => error.includes("claims Demonstrated without a scoped lifecycle evidence chain")));
  assert.ok(errors.some((error) => error.includes("RES-001 requires a Demonstrated experiment")));
});

test("rejects false promotion of evidence maturity without validation evidence", async () => {
  const candidate = clone();
  candidate.nodes.find((node) => node.id === "ADR-0011").evidenceMaturity = "Validated";

  const errors = await validate(candidate);
  assert.ok(errors.some((error) => error.includes("ADR-0011 claims Validated without a scoped lifecycle evidence chain")));
});

test("rejects unknown lifecycle vocabulary at the schema boundary", async () => {
  const candidate = clone();
  candidate.nodes.find((node) => node.id === "EXP-006").experimentStatus = "Complete";

  const errors = await validate(candidate);
  assert.ok(errors.some((error) => error.startsWith("traceability schema")));
});

test("requires the complete seven-layer architecture", async () => {
  const candidate = clone();
  candidate.nodes = candidate.nodes.filter((node) => node.id !== "LAYER-07");

  const errors = await validate(candidate);
  assert.ok(errors.some((error) => error.includes("architecture-layer ids must be contiguous")));
});

test("requires both cross-cutting planes to constrain all seven layers", async () => {
  const candidate = clone();
  candidate.links = candidate.links.filter(
    (link) => !(link.from === "PLANE-01" && link.to === "LAYER-07" && link.relation === "applies-to")
  );

  const errors = await validate(candidate);
  assert.ok(errors.some((error) => error.includes("PLANE-01 must apply to all seven architecture layers exactly once")));
});

test("requires the complete canonical CRM test suite", async () => {
  const candidate = clone();
  candidate.nodes = candidate.nodes.filter((node) => node.id !== "CTS-25");

  const errors = await validate(candidate);
  assert.ok(errors.some((error) => error.includes("canonical-test ids must be contiguous")));
});

test("requires each canonical object to have exactly one contract scope", async () => {
  const candidate = clone();
  candidate.links.push({ from: "CONTRACT-003", to: "OBJ-001", relation: "defines" });

  const errors = await validate(candidate);
  assert.ok(errors.some((error) => error.includes("OBJ-001 must be defined by exactly one contract scope")));
});

test("requires every product view to remain in the presentation layer", async () => {
  const candidate = clone();
  const viewLink = candidate.links.find(
    (link) => link.from === "VIEW-001" && link.to === "LAYER-01" && link.relation === "allocated-to"
  );
  viewLink.to = "LAYER-02";

  const errors = await validate(candidate);
  assert.ok(errors.some((error) => error.includes("VIEW-001 is not allocated to LAYER-01")));
});
