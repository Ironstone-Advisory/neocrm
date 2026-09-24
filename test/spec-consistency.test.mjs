import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFile(resolve(root, path), "utf8");

const axioms = [
  "NeoCRM owns the semantic model, not the storage model.",
  "Persistence is replaceable. Intelligence is not.",
  "Calendar = View; Time = Domain.",
  "NeoCRM doesn't own the world's data. It creates a coherent model of the relationships represented by that data."
];

async function markdownFiles(directory, relative = "") {
  const files = [];
  for (const entry of await readdir(resolve(directory, relative), { withFileTypes: true })) {
    const path = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...(await markdownFiles(directory, path)));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(path);
  }
  return files;
}

test("keeps the origin first and all four axioms verbatim in both primary authority files", async () => {
  const [readme, canonical, authority, origin] = await Promise.all([
    read("README.md"),
    read("spec/canonical/NeoCRM-v0.1-Canonical-Specification.md"),
    read("spec/README.md"),
    read("spec/vision/origin.md")
  ]);
  for (const axiom of axioms) {
    assert.ok(readme.includes(axiom), `README is missing axiom: ${axiom}`);
    assert.ok(canonical.includes(axiom), `canonical specification is missing axiom: ${axiom}`);
  }
  assert.match(authority, /origin[^\n]+governs product purpose/i);
  assert.match(origin, /AI agents and intelligence as the foundation/i);
});

test("keeps the active product agent-native rather than chatbot-first", async () => {
  const roots = ["README.md", "package.json", "spec", "experiments", "evals", "article", "apps", "packages", "adapters"];
  const files = [];
  for (const entry of roots) {
    if (entry.endsWith(".md") || entry.endsWith(".json")) files.push(entry);
    else files.push(...(await markdownFiles(root, entry)));
  }
  const activeFiles = files.filter((path) => !path.startsWith("experiments/archive/"));
  for (const file of activeFiles) {
    const content = await read(file);
    assert.doesNotMatch(content, /chatbot[- ]first/i, `${file} regresses to chatbot-first language`);
  }
  assert.match(await read("README.md"), /agent-native customer relationship management/i);
  assert.match(await read("spec/product/product-definition.md"), /Conversation is one Presentation view/i);
});

test("keeps complete canonical registries unique and contiguous", async () => {
  const manifest = JSON.parse(await read("spec/traceability.json"));
  const ids = manifest.nodes.map((node) => node.id);
  assert.equal(new Set(ids).size, ids.length);
  const expected = (prefix, count, width) =>
    Array.from({ length: count }, (_, index) => `${prefix}-${String(index + 1).padStart(width, "0")}`);
  const idsOfKind = (kind) => manifest.nodes.filter((node) => node.kind === kind).map((node) => node.id).sort();
  assert.deepEqual(idsOfKind("architecture-layer"), expected("LAYER", 7, 2));
  assert.deepEqual(idsOfKind("cross-cutting-plane"), expected("PLANE", 2, 2));
  assert.deepEqual(idsOfKind("view"), expected("VIEW", 28, 3));
  assert.deepEqual(idsOfKind("canonical-object"), expected("OBJ", 129, 3));
  assert.deepEqual(idsOfKind("canonical-test"), expected("CTS", 25, 2));
  assert.deepEqual(idsOfKind("decision"), expected("ADR", 19, 4));
  assert.deepEqual(idsOfKind("experiment"), expected("EXP", 25, 3));
});

test("keeps CAP conformance, fixture preflight, and product-experiment evaluation scopes separate", async () => {
  const manifest = JSON.parse(await read("spec/traceability.json"));
  const evaluatedBy = manifest.links.filter((link) => link.relation === "evaluated-by");
  assert.deepEqual(
    evaluatedBy.filter((link) => link.to === "EVAL-001").map((link) => link.from),
    ["EXP-006"]
  );
  assert.deepEqual(
    evaluatedBy.filter((link) => link.to === "EVAL-002").map((link) => link.from),
    ["EXP-001"]
  );
  assert.deepEqual(
    evaluatedBy.filter((link) => link.to === "EVAL-003").map((link) => link.from).sort(),
    ["EXP-002", "EXP-003", "EXP-004", "EXP-005", "EXP-007", "EXP-008", "EXP-009", "EXP-010", "EXP-011", "EXP-012"]
  );
  assert.deepEqual(
    evaluatedBy.filter((link) => link.to === "EVAL-004").map((link) => link.from).sort(),
    ["EXP-013", "EXP-014", "EXP-015", "EXP-016", "EXP-017", "EXP-018", "EXP-019", "EXP-020", "EXP-021", "EXP-022", "EXP-023", "EXP-024", "EXP-025"]
  );
  assert.match(await read("evals/canonical-experiment-plan.json"), /defined plan, not an implemented evaluator/i);
  assert.match(await read("evals/approved-portfolio-experiment-plan.json"), /defined plan, not an implemented evaluator/i);
});

test("keeps both cross-cutting planes visible across all seven layers in canonical diagrams", async () => {
  for (const file of [
    "spec/architecture/diagrams/layered-architecture.mmd",
    "article/figures/architecture.mmd",
    "spec/canonical/NeoCRM-v0.1-Canonical-Specification.md"
  ]) {
    const content = await read(file);
    assert.match(content, /CS -.?(?: constrains )?.-> L7/, `${file} omits Canonical Semantics at Layer 7`);
    assert.match(content, /GC -.?(?: constrains )?.-> L1/, `${file} omits Governance at Layer 1`);
  }
});

test("keeps Message distinct from Activity and evidence dimensions independent", async () => {
  const [canonical, activity, principles, knowledge] = await Promise.all([
    read("spec/canonical/NeoCRM-v0.1-Canonical-Specification.md"),
    read("spec/domain/model/activity.md"),
    read("spec/vision/principles.md"),
    read("spec/domain/model/knowledge.md")
  ]);
  assert.doesNotMatch(canonical, /Message is an Activity/i);
  assert.match(canonical, /Message\*\* is a distinct communication artifact/i);
  assert.match(activity, /A \*\*Message\*\* is a communication artifact/i);
  for (const content of [principles, knowledge]) {
    assert.match(content, /authority, freshness, confidence, completeness, and epistemic category (?:are|remain) independent/i);
  }
});

test("marks every pre-canonical staging artifact as archived in the artifact itself", async () => {
  const directory = "experiments/archive/pre-canonical-staging";
  const files = (await markdownFiles(root, directory)).filter((path) => path !== `${directory}/README.md`);
  for (const file of files) {
    const opening = (await read(file)).split(/\r?\n/).slice(0, 8).join("\n");
    assert.match(opening, /\*\*Archive status:\*\*/, `${file} lacks a visible archive status`);
  }
});
