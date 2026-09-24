import { readFile, readdir } from "node:fs/promises";
import { basename, extname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const repositoryRoot = resolve(import.meta.dirname, "..");

const DESIGN_KINDS = new Set([
  "architecture-layer",
  "cross-cutting-plane",
  "business-capability",
  "product-goal",
  "view",
  "canonical-object",
  "canonical-test",
  "contract-scope",
  "capability",
  "requirement",
  "quality",
  "safety"
]);
const REQUIREMENT_KINDS = new Set(["requirement", "quality", "safety"]);
const LEGACY_STATUS_ARTIFACT_KINDS = new Set(["capability", "requirement", "quality", "safety"]);

const EDGE_RULES = Object.freeze({
  "realized-by": { from: ["product-goal"], to: ["business-capability"] },
  implements: { from: ["capability"], to: ["business-capability"] },
  "allocated-to": { from: ["business-capability", "view"], to: ["architecture-layer"] },
  "presented-in": { from: ["business-capability"], to: ["view"] },
  "owns-contract": { from: ["architecture-layer", "cross-cutting-plane"], to: ["contract-scope"] },
  "applies-to": { from: ["cross-cutting-plane"], to: ["architecture-layer"] },
  defines: { from: ["contract-scope"], to: ["canonical-object"] },
  verifies: {
    from: ["canonical-test"],
    to: ["business-capability", "canonical-object", "capability", "requirement", "quality", "safety"]
  },
  requires: { from: ["capability"], to: ["requirement", "quality", "safety"] },
  "governed-by": { from: ["requirement", "quality", "safety"], to: ["decision"] },
  "tested-by": { from: ["decision"], to: ["experiment"] },
  precedes: { from: ["experiment"], to: ["experiment"] },
  "evaluated-by": { from: ["experiment"], to: ["evaluation"] },
  exercises: { from: ["evaluation"], to: ["implementation"] },
  "reported-in": { from: ["implementation"], to: ["result"] }
});

const idPattern = /^(?:(?:CAP|EXP|EVAL|IMP|RES|BCAP|GOAL|VIEW|OBJ|CONTRACT)-\d{3}|(?:LAYER|CTS|PLANE)-\d{2}|ADR-\d{4}|(?:FR|NFR|SAFE)-[A-Z]+-\d{3})$/;

function pairKey(from, relation, to) {
  return `${from}\u0000${relation}\u0000${to}`;
}

function exactLinks(manifest, from, relation, to) {
  return manifest.links.filter(
    (link) => link.from === from && link.relation === relation && (to === undefined || link.to === to)
  );
}

function parseMarkdownField(content, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return content.match(new RegExp(`^\\*\\*${escaped}:\\*\\*\\s*(.+?)\\s*$`, "mi"))?.[1];
}

function parseAdrDeclarations(content) {
  const declarations = [];
  const patterns = [
    ["planned", /^\*\*Validation plan:\*\*\s*(EXP-\d{3})\s*\/\s*(EVAL-\d{3})\s*$/gm],
    ["demonstration", /^\*\*Demonstration evidence:\*\*\s*(EXP-\d{3})\s*\/\s*(EVAL-\d{3})\s*$/gm],
    ["validation", /^\*\*Validation evidence:\*\*\s*(EXP-\d{3})\s*\/\s*(EVAL-\d{3})\s*$/gm]
  ];
  for (const [stage, pattern] of patterns) {
    for (const match of content.matchAll(pattern)) {
      declarations.push({ stage, experiment: match[1], evaluation: match[2] });
    }
  }
  return declarations;
}

function formatSchemaErrors(errors = []) {
  return errors.map((error) => `traceability schema ${error.instancePath || "/"} ${error.message}`);
}

function numericSuffix(id) {
  return Number(id.match(/(\d+)$/)?.[1]);
}

function requireContiguousIds(nodes, kind, prefix, width, errors, expectedMaximum) {
  const ids = nodes
    .filter((node) => node.kind === kind)
    .map((node) => node.id)
    .sort((a, b) => numericSuffix(a) - numericSuffix(b));
  const maximum = expectedMaximum ?? ids.length;
  const expected = Array.from({ length: maximum }, (_, index) => `${prefix}-${String(index + 1).padStart(width, "0")}`);
  if (ids.join("|") !== expected.join("|")) {
    errors.push(`${kind} ids must be contiguous: expected ${expected.join(", ")}; found ${ids.join(", ")}`);
  }
}

function maturityAtLeast(actual, expected) {
  const rank = { Unassessed: 0, Planned: 1, Demonstrated: 2, Validated: 3 };
  return (rank[actual] ?? -1) >= rank[expected];
}

function stageAtLeast(actual, expected) {
  const rank = { planned: 1, demonstration: 2, validation: 3 };
  return (rank[actual] ?? -1) >= rank[expected];
}

/**
 * Validate the typed architecture graph and lifecycle evidence represented by it.
 * Decision adoption, implementation progress, and evidence maturity are
 * independent dimensions. `loadArtifact` keeps the validator mutation-testable.
 */
export async function validateTraceability({ manifest, traceabilitySchema, loadArtifact }) {
  const errors = [];
  const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
  addFormats(ajv);
  const schemaValidator = ajv.compile(traceabilitySchema);
  if (!schemaValidator(manifest)) return formatSchemaErrors(schemaValidator.errors);

  const nodesById = new Map();
  const artifactById = new Map();

  for (const node of manifest.nodes) {
    if (!idPattern.test(node.id)) errors.push(`malformed id: ${node.id}`);
    if (nodesById.has(node.id)) errors.push(`duplicate id: ${node.id}`);
    nodesById.set(node.id, node);

    try {
      const content = await loadArtifact(node.file);
      artifactById.set(node.id, content);
      if (!content.includes(node.id)) errors.push(`${node.file} does not mention ${node.id}`);

      if (node.kind === "decision") {
        const expectedFields = [
          ["Decision status", node.decisionStatus],
          ["Implementation status", node.implementationStatus],
          ["Evidence maturity", node.evidenceMaturity]
        ];
        for (const [label, expected] of expectedFields) {
          const actual = parseMarkdownField(content, label);
          if (!actual) errors.push(`${node.file} has no **${label}:** declaration for ${node.id}`);
          else if (actual !== expected) errors.push(`${node.id} ${label.toLowerCase()} mismatch: manifest=${expected}, artifact=${actual}`);
        }
        if (!basename(node.file).startsWith(node.id)) errors.push(`${node.file} does not use its ${node.id} filename prefix`);
      } else if (LEGACY_STATUS_ARTIFACT_KINDS.has(node.kind) && extname(node.file) === ".md") {
        const actual = parseMarkdownField(content, "Status");
        if (!actual) errors.push(`${node.file} has no **Status:** declaration for ${node.id}`);
        else if (actual !== node.specificationStatus) {
          errors.push(`${node.id} specification status mismatch: manifest=${node.specificationStatus}, artifact=${actual}`);
        }
      } else if (node.kind === "experiment") {
        const ownHeading = content.match(/^#\s+(EXP-\d{3})\b/m)?.[1];
        if (ownHeading === node.id) {
          const actual = parseMarkdownField(content, "Status");
          if (!actual) errors.push(`${node.file} has no **Status:** declaration for ${node.id}`);
          else if (actual !== node.experimentStatus) {
            errors.push(`${node.id} experiment status mismatch: manifest=${node.experimentStatus}, artifact=${actual}`);
          }
        }
      } else if (node.kind === "evaluation") {
        let parsed;
        try {
          parsed = JSON.parse(content);
        } catch {
          errors.push(`${node.file} is not valid JSON`);
        }
        if (parsed && parsed.status !== node.evaluationStatus) {
          errors.push(`${node.id} evaluation status mismatch: manifest=${node.evaluationStatus}, artifact=${parsed.status ?? "missing"}`);
        }
      } else if (node.kind === "implementation") {
        const marker = new RegExp(`${node.id}[^\\r\\n]*Status:\\s*${node.implementationStatus}\\b`);
        if (!marker.test(content)) {
          errors.push(`${node.file} lacks '${node.id} - Status: ${node.implementationStatus}' implementation marker`);
        }
      } else if (node.kind === "result") {
        const actual = parseMarkdownField(content, "Status");
        if (!actual) errors.push(`${node.file} has no **Status:** declaration for ${node.id}`);
        else if (actual !== node.resultStatus) {
          errors.push(`${node.id} result status mismatch: manifest=${node.resultStatus}, artifact=${actual}`);
        }
      }
    } catch {
      errors.push(`missing file for ${node.id}: ${node.file}`);
    }
  }

  requireContiguousIds(manifest.nodes, "decision", "ADR", 4, errors);
  requireContiguousIds(manifest.nodes, "architecture-layer", "LAYER", 2, errors, 7);
  requireContiguousIds(manifest.nodes, "cross-cutting-plane", "PLANE", 2, errors, 2);
  requireContiguousIds(manifest.nodes, "canonical-test", "CTS", 2, errors, 25);

  const uniqueLinks = new Set();
  for (const link of manifest.links) {
    const from = nodesById.get(link.from);
    const to = nodesById.get(link.to);
    if (!from) errors.push(`unknown link source: ${link.from}`);
    if (!to) errors.push(`unknown link target: ${link.to}`);

    const key = pairKey(link.from, link.relation, link.to);
    if (uniqueLinks.has(key)) errors.push(`duplicate link: ${link.from} ${link.relation} ${link.to}`);
    uniqueLinks.add(key);

    const rule = EDGE_RULES[link.relation];
    if (!rule) {
      errors.push(`unknown relation: ${link.relation}`);
      continue;
    }
    if (from && !rule.from.includes(from.kind)) errors.push(`${link.from} (${from.kind}) cannot be source of ${link.relation}`);
    if (to && !rule.to.includes(to.kind)) errors.push(`${link.to} (${to.kind}) cannot be target of ${link.relation}`);
    if (link.relation === "tested-by" && !["planned", "demonstration", "validation"].includes(link.evidenceStage)) {
      errors.push(`${link.from} tested-by ${link.to} requires an evidenceStage`);
    }
    if (link.relation !== "tested-by" && "evidenceStage" in link) {
      errors.push(`${link.from} ${link.relation} ${link.to} cannot declare evidenceStage`);
    }
  }

  const hasDecisionPlan = (decisionId) =>
    exactLinks(manifest, decisionId, "tested-by").some((tested) =>
      exactLinks(manifest, tested.to, "evaluated-by").length > 0
    );

  const hasDecisionEvidence = (decisionId, targetMaturity) => {
    const targetStage = targetMaturity === "Validated" ? "validation" : "demonstration";
    for (const tested of exactLinks(manifest, decisionId, "tested-by")) {
      if (!stageAtLeast(tested.evidenceStage, targetStage)) continue;
      const experiment = nodesById.get(tested.to);
      if (!maturityAtLeast(experiment?.evidenceMaturity, targetMaturity)) continue;
      for (const evaluated of exactLinks(manifest, tested.to, "evaluated-by")) {
        const evaluation = nodesById.get(evaluated.to);
        const validEvaluation = targetMaturity === "Validated"
          ? evaluation?.evaluationStatus === "Passed" && maturityAtLeast(evaluation?.evidenceMaturity, "Validated")
          : ["Implemented", "Passed"].includes(evaluation?.evaluationStatus) && maturityAtLeast(evaluation?.evidenceMaturity, "Demonstrated");
        if (!validEvaluation) continue;
        for (const exercises of exactLinks(manifest, evaluated.to, "exercises")) {
          const implementation = nodesById.get(exercises.to);
          const validImplementation = targetMaturity === "Validated"
            ? implementation?.implementationStatus === "Verified"
            : ["Implemented", "Verified"].includes(implementation?.implementationStatus);
          if (!validImplementation) continue;
          for (const reported of exactLinks(manifest, exercises.to, "reported-in")) {
            const result = nodesById.get(reported.to);
            const evidence = result?.evidence;
            const scoped =
              evidence?.experiment === experiment?.id &&
              evidence?.evaluations?.includes(evaluation?.id) &&
              evidence?.implementations?.includes(implementation?.id);
            if (!scoped) continue;
            if (targetMaturity === "Validated") {
              if (result?.resultStatus === "Validated" && maturityAtLeast(result?.evidenceMaturity, "Validated")) return true;
            } else if (
              ["Recorded", "AutomatedPassHumanPending", "Validated"].includes(result?.resultStatus) &&
              maturityAtLeast(result?.evidenceMaturity, "Demonstrated")
            ) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const hasRequirementPlan = (requirementId) =>
    exactLinks(manifest, requirementId, "governed-by").some((governed) => hasDecisionPlan(governed.to));

  const hasRequirementEvidence = (requirementId, maturity) =>
    exactLinks(manifest, requirementId, "governed-by").some((governed) => hasDecisionEvidence(governed.to, maturity));

  for (const requirement of manifest.nodes.filter((node) => REQUIREMENT_KINDS.has(node.kind))) {
    if (!hasRequirementPlan(requirement.id)) {
      errors.push(`${requirement.id} has no typed requirement -> decision -> experiment -> evaluation plan`);
    }
    if (["Demonstrated", "Validated"].includes(requirement.evidenceMaturity) && !hasRequirementEvidence(requirement.id, requirement.evidenceMaturity)) {
      errors.push(`${requirement.id} claims ${requirement.evidenceMaturity} without a scoped lifecycle evidence chain`);
    }
  }

  for (const capability of manifest.nodes.filter((node) => node.kind === "capability")) {
    const requirements = exactLinks(manifest, capability.id, "requires");
    if (!requirements.length) errors.push(`${capability.id} does not require any requirement`);
    if (!exactLinks(manifest, capability.id, "implements").length) {
      errors.push(`${capability.id} does not implement a business capability`);
    }
    if (["Demonstrated", "Validated"].includes(capability.evidenceMaturity)) {
      const incomplete = requirements
        .filter((link) => !hasRequirementEvidence(link.to, capability.evidenceMaturity))
        .map((link) => link.to);
      if (incomplete.length) {
        errors.push(`${capability.id} claims ${capability.evidenceMaturity} without scoped chains through: ${incomplete.join(", ")}`);
      }
    }
  }

  for (const decision of manifest.nodes.filter((node) => node.kind === "decision")) {
    const content = artifactById.get(decision.id);
    if (!content) continue;
    if (!hasDecisionPlan(decision.id)) errors.push(`${decision.id} has no typed experiment and evaluation plan`);
    if (["Demonstrated", "Validated"].includes(decision.evidenceMaturity) && !hasDecisionEvidence(decision.id, decision.evidenceMaturity)) {
      errors.push(`${decision.id} claims ${decision.evidenceMaturity} without a scoped lifecycle evidence chain`);
    }

    const declared = new Set(
      parseAdrDeclarations(content).map(({ stage, experiment, evaluation }) => `${stage}:${experiment}:${evaluation}`)
    );
    const traced = new Set();
    for (const tested of exactLinks(manifest, decision.id, "tested-by")) {
      for (const evaluated of exactLinks(manifest, tested.to, "evaluated-by")) {
        traced.add(`${tested.evidenceStage}:${tested.to}:${evaluated.to}`);
      }
    }
    for (const entry of declared) {
      if (!traced.has(entry)) errors.push(`${decision.id} declares untraced ADR validation: ${entry}`);
    }
    for (const entry of traced) {
      if (!declared.has(entry)) errors.push(`${decision.id} is missing ADR validation declaration: ${entry}`);
    }
  }

  for (const result of manifest.nodes.filter((node) => node.kind === "result")) {
    const evidence = result.evidence;
    const experiment = nodesById.get(evidence.experiment);
    if (experiment?.kind !== "experiment") errors.push(`${result.id} evidence references invalid experiment`);
    if (!evidence.automatedChecks.length) errors.push(`${result.id} has no automated check evidence`);
    for (const evaluationId of evidence.evaluations) {
      if (nodesById.get(evaluationId)?.kind !== "evaluation") errors.push(`${result.id} evidence references invalid evaluation ${evaluationId}`);
    }
    for (const implementationId of evidence.implementations) {
      if (nodesById.get(implementationId)?.kind !== "implementation") errors.push(`${result.id} evidence references invalid implementation ${implementationId}`);
      if (!exactLinks(manifest, implementationId, "reported-in", result.id).length) {
        errors.push(`${result.id} evidence implementation ${implementationId} has no reported-in link`);
      }
    }
    for (const check of evidence.automatedChecks) {
      const content = artifactById.get(result.id) ?? "";
      if (!content.includes(check.id) || !content.includes(check.command)) {
        errors.push(`${result.file} does not record evidence for ${check.id} (${check.command})`);
      }
    }
    if (result.resultStatus === "AutomatedPassHumanPending") {
      if (experiment?.experimentStatus !== "Demonstrated" || result.evidenceMaturity !== "Demonstrated") {
        errors.push(`${result.id} requires a Demonstrated experiment and evidence maturity`);
      }
      if (evidence.humanEvaluation.status !== "Pending") errors.push(`${result.id} must record human evaluation as Pending`);
    }
    if (result.resultStatus === "Validated") {
      if (experiment?.experimentStatus !== "Validated" || evidence.humanEvaluation.status !== "Passed" || result.evidenceMaturity !== "Validated") {
        errors.push(`${result.id} is Validated without a validated experiment, evidence, and passed human evaluation`);
      }
    }
  }

  for (const experiment of manifest.nodes.filter((node) => node.kind === "experiment")) {
    const matchingResults = manifest.nodes.filter(
      (node) => node.kind === "result" && node.evidence?.experiment === experiment.id
    );
    if (experiment.experimentStatus === "Demonstrated") {
      if (experiment.evidenceMaturity !== "Demonstrated") errors.push(`${experiment.id} Demonstrated status and evidence maturity disagree`);
      if (!matchingResults.some((result) => ["Recorded", "AutomatedPassHumanPending", "Validated"].includes(result.resultStatus))) {
        errors.push(`${experiment.id} is Demonstrated without a recorded result`);
      }
    }
    if (experiment.experimentStatus === "Validated") {
      if (experiment.evidenceMaturity !== "Validated") errors.push(`${experiment.id} Validated status and evidence maturity disagree`);
      if (!matchingResults.some((result) => result.resultStatus === "Validated")) {
        errors.push(`${experiment.id} is Validated without a validated result`);
      }
    }
  }

  for (const goal of manifest.nodes.filter((node) => node.kind === "product-goal")) {
    if (!exactLinks(manifest, goal.id, "realized-by").length) errors.push(`${goal.id} is not realized by a business capability`);
  }
  for (const capability of manifest.nodes.filter((node) => node.kind === "business-capability")) {
    if (!manifest.links.some((link) => link.to === capability.id && link.relation === "realized-by")) errors.push(`${capability.id} realizes no product goal`);
    if (!exactLinks(manifest, capability.id, "allocated-to").length) errors.push(`${capability.id} is not allocated to an architecture layer`);
    if (!exactLinks(manifest, capability.id, "presented-in").length) errors.push(`${capability.id} has no product view`);
  }
  for (const view of manifest.nodes.filter((node) => node.kind === "view")) {
    if (!exactLinks(manifest, view.id, "allocated-to", "LAYER-01").length) errors.push(`${view.id} is not allocated to LAYER-01`);
    if (!manifest.links.some((link) => link.to === view.id && link.relation === "presented-in")) errors.push(`${view.id} presents no business capability`);
  }
  for (const scope of manifest.nodes.filter((node) => node.kind === "contract-scope")) {
    if (!manifest.links.some((link) => link.to === scope.id && link.relation === "owns-contract")) errors.push(`${scope.id} has no owning architecture layer or cross-cutting plane`);
  }
  const expectedLayerIds = Array.from({ length: 7 }, (_, index) => `LAYER-${String(index + 1).padStart(2, "0")}`);
  for (const plane of manifest.nodes.filter((node) => node.kind === "cross-cutting-plane")) {
    const appliedLayerIds = exactLinks(manifest, plane.id, "applies-to").map((link) => link.to).sort();
    if (appliedLayerIds.join("|") !== expectedLayerIds.join("|")) {
      errors.push(`${plane.id} must apply to all seven architecture layers exactly once`);
    }
  }
  for (const object of manifest.nodes.filter((node) => node.kind === "canonical-object")) {
    const definitions = manifest.links.filter((link) => link.to === object.id && link.relation === "defines");
    if (definitions.length !== 1) errors.push(`${object.id} must be defined by exactly one contract scope`);
  }
  for (const canonicalTest of manifest.nodes.filter((node) => node.kind === "canonical-test")) {
    if (!exactLinks(manifest, canonicalTest.id, "verifies").length) errors.push(`${canonicalTest.id} verifies no traceable target`);
  }

  return errors;
}

export async function validateRepository(root = repositoryRoot) {
  const read = (path) => readFile(resolve(root, path), "utf8");
  const manifest = JSON.parse(await read("spec/traceability.json"));
  const traceabilitySchema = JSON.parse(await read("spec/traceability.schema.json"));
  const errors = await validateTraceability({ manifest, traceabilitySchema, loadArtifact: read });

  for (const relativeRoot of ["spec/contracts", "spec/domain/schemas"]) {
    let names;
    try {
      names = await readdir(resolve(root, relativeRoot), { recursive: true });
    } catch (error) {
      if (error?.code === "ENOENT") continue;
      throw error;
    }
    for (const name of names) {
      if (!name.endsWith(".json")) continue;
      const relativePath = `${relativeRoot}/${name.replaceAll("\\", "/")}`;
      const schema = JSON.parse(await read(relativePath));
      if (!schema.$schema || !schema.$id) errors.push(`schema lacks $schema or $id: ${relativePath}`);
    }
  }

  return { errors, manifest };
}

async function main() {
  const { errors, manifest } = await validateRepository();
  if (errors.length) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    process.exitCode = 1;
    return;
  }
  console.log(`spec validation passed: ${manifest.nodes.length} typed nodes, ${manifest.links.length} typed links`);
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isDirectRun) await main();
