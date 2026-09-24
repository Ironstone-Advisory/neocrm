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

test("rejects a relation whose node kinds violate the typed edge direction", async () => {
  const candidate = clone();
  candidate.links[0].relation = "governed-by";

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
  assert.ok(
    errors.some((error) =>
      error.includes("FR-RES-001 has no scoped requirement -> decision -> experiment -> evaluation -> implementation -> result chain")
    )
  );
});

test("rejects result evidence scoped to a different experiment", async () => {
  const candidate = clone();
  const result = candidate.nodes.find((node) => node.id === "RES-001");
  result.evidence.experiment = "EXP-005";

  const errors = await validate(candidate);
  assert.ok(errors.some((error) => error.includes("FR-RES-001 has no scoped requirement")));
  assert.ok(errors.some((error) => error.includes("RES-001 requires its experiment to be Demonstrated, not Planned")));
});

test("rejects false promotion to Accepted without validated lifecycle evidence", async () => {
  const candidate = clone();
  candidate.nodes.find((node) => node.id === "FR-RES-001").status = "Accepted";

  const errors = await validate(candidate);
  assert.ok(errors.some((error) => error.includes("FR-RES-001 is Accepted without a fully validated evidence chain")));
});

test("rejects unknown lifecycle vocabulary at the schema boundary", async () => {
  const candidate = clone();
  candidate.nodes.find((node) => node.id === "EXP-006").status = "Complete";

  const errors = await validate(candidate);
  assert.ok(errors.some((error) => error.startsWith("traceability schema")));
});
