import { access, readFile, readdir } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const repositoryRoot = resolve(import.meta.dirname, "..");

const NORMATIVE_KINDS = new Set(["capability", "requirement", "quality", "safety", "decision"]);
const REQUIREMENT_KINDS = new Set(["requirement", "quality", "safety"]);

const ALLOWED_STATUSES = Object.freeze({
  capability: ["Draft", "Proposed", "Provisional", "Accepted", "Superseded", "Rejected"],
  requirement: ["Draft", "Proposed", "Provisional", "Accepted", "Superseded", "Rejected"],
  quality: ["Draft", "Proposed", "Provisional", "Accepted", "Superseded", "Rejected"],
  safety: ["Draft", "Proposed", "Provisional", "Accepted", "Superseded", "Rejected"],
  decision: ["Draft", "Proposed", "Provisional", "Accepted", "Superseded", "Rejected"],
  experiment: ["Planned", "Running", "Demonstrated", "Validated", "Inconclusive", "Rejected"],
  evaluation: ["Defined", "Implemented", "Passed", "Failed"],
  implementation: ["Planned", "Implemented", "Verified", "Retired"],
  result: ["Recorded", "AutomatedPassHumanPending", "Validated", "Failed", "Inconclusive"]
});

const EDGE_RULES = Object.freeze({
  requires: { from: ["capability"], to: ["requirement", "quality", "safety"] },
  "governed-by": { from: ["requirement", "quality", "safety"], to: ["decision"] },
  "tested-by": { from: ["decision"], to: ["experiment"] },
  precedes: { from: ["experiment"], to: ["experiment"] },
  "evaluated-by": { from: ["experiment"], to: ["evaluation"] },
  exercises: { from: ["evaluation"], to: ["implementation"] },
  "reported-in": { from: ["implementation"], to: ["result"] }
});

const idPattern = /^(?:CAP|EXP|EVAL|IMP|RES)-\d{3}$|^ADR-\d{4}$|^(?:FR|NFR|SAFE)-[A-Z]+-\d{3}$/;

function pairKey(from, relation, to) {
  return `${from}\u0000${relation}\u0000${to}`;
}

function exactLinks(manifest, from, relation, to) {
  return manifest.links.filter(
    (link) => link.from === from && link.relation === relation && (to === undefined || link.to === to)
  );
}

function parseMarkdownStatus(content) {
  return content.match(/^\*\*Status:\*\*\s*(.+?)\s*$/m)?.[1];
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

/**
 * Validate the typed trace graph and the lifecycle evidence represented by it.
 * `loadArtifact` makes the graph validator independently mutation-testable.
 */
export async function validateTraceability({ manifest, traceabilitySchema, loadArtifact }) {
  const errors = [];
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const schemaValidator = ajv.compile(traceabilitySchema);
  if (!schemaValidator(manifest)) {
    return formatSchemaErrors(schemaValidator.errors);
  }

  const nodesById = new Map();
  const artifactById = new Map();
  for (const node of manifest.nodes) {
    if (!idPattern.test(node.id)) errors.push(`malformed id: ${node.id}`);
    if (nodesById.has(node.id)) errors.push(`duplicate id: ${node.id}`);
    nodesById.set(node.id, node);

    if (!ALLOWED_STATUSES[node.kind]?.includes(node.status)) {
      errors.push(`${node.id} has invalid ${node.kind} status: ${node.status}`);
    }

    try {
      const content = await loadArtifact(node.file);
      artifactById.set(node.id, content);
      if (!content.includes(node.id)) errors.push(`${node.file} does not mention ${node.id}`);

      if (extname(node.file) === ".md") {
        const artifactStatus = parseMarkdownStatus(content);
        if (!artifactStatus) errors.push(`${node.file} has no **Status:** declaration for ${node.id}`);
        else if (artifactStatus !== node.status) {
          errors.push(`${node.id} status mismatch: manifest=${node.status}, artifact=${artifactStatus}`);
        }
      } else if (node.kind === "evaluation") {
        let parsed;
        try {
          parsed = JSON.parse(content);
        } catch {
          errors.push(`${node.file} is not valid JSON`);
        }
        if (parsed && parsed.status !== node.status) {
          errors.push(`${node.id} status mismatch: manifest=${node.status}, artifact=${parsed.status ?? "missing"}`);
        }
      } else if (node.kind === "implementation") {
        const marker = new RegExp(`${node.id}[^\\r\\n]*Status:\\s*${node.status}\\b`);
        if (!marker.test(content)) {
          errors.push(`${node.file} lacks '${node.id} - Status: ${node.status}' implementation marker`);
        }
      }
    } catch {
      errors.push(`missing file for ${node.id}: ${node.file}`);
    }
  }

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
    if (from && !rule.from.includes(from.kind)) {
      errors.push(`${link.from} (${from.kind}) cannot be source of ${link.relation}`);
    }
    if (to && !rule.to.includes(to.kind)) {
      errors.push(`${link.to} (${to.kind}) cannot be target of ${link.relation}`);
    }
    if (link.relation === "tested-by" && !["planned", "demonstration", "validation"].includes(link.evidenceStage)) {
      errors.push(`${link.from} tested-by ${link.to} requires an evidenceStage`);
    }
    if (link.relation !== "tested-by" && "evidenceStage" in link) {
      errors.push(`${link.from} ${link.relation} ${link.to} cannot declare evidenceStage`);
    }
  }

  const hasEvidenceChain = (requirementId, acceptedOnly = false) => {
    for (const governed of exactLinks(manifest, requirementId, "governed-by")) {
      const decision = nodesById.get(governed.to);
      for (const tested of exactLinks(manifest, governed.to, "tested-by")) {
        const experiment = nodesById.get(tested.to);
        for (const evaluated of exactLinks(manifest, tested.to, "evaluated-by")) {
          const evaluation = nodesById.get(evaluated.to);
          for (const exercises of exactLinks(manifest, evaluated.to, "exercises")) {
            const implementation = nodesById.get(exercises.to);
            for (const reported of exactLinks(manifest, exercises.to, "reported-in")) {
              const result = nodesById.get(reported.to);
              const evidence = result?.evidence;
              const scoped =
                evidence?.experiment === experiment?.id &&
                evidence?.evaluations?.includes(evaluation?.id) &&
                evidence?.implementations?.includes(implementation?.id);
              if (!scoped) continue;
              if (!acceptedOnly) return true;
              if (
                decision?.status === "Accepted" &&
                tested.evidenceStage === "validation" &&
                experiment?.status === "Validated" &&
                evaluation?.status === "Passed" &&
                implementation?.status === "Verified" &&
                result?.status === "Validated"
              ) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  };

  for (const requirement of manifest.nodes.filter((node) => REQUIREMENT_KINDS.has(node.kind))) {
    if (!hasEvidenceChain(requirement.id)) {
      errors.push(
        `${requirement.id} has no scoped requirement -> decision -> experiment -> evaluation -> implementation -> result chain`
      );
    }
    if (requirement.status === "Accepted" && !hasEvidenceChain(requirement.id, true)) {
      errors.push(`${requirement.id} is Accepted without a fully validated evidence chain`);
    }
  }

  for (const capability of manifest.nodes.filter((node) => node.kind === "capability")) {
    const requirements = exactLinks(manifest, capability.id, "requires");
    if (!requirements.length) errors.push(`${capability.id} does not require any requirement`);
    for (const link of requirements) {
      if (!hasEvidenceChain(link.to)) {
        errors.push(`${capability.id} has no scoped evidence chain through ${link.to}`);
      }
    }
    if (capability.status === "Accepted") {
      const incomplete = requirements.filter((link) => !hasEvidenceChain(link.to, true)).map((link) => link.to);
      if (incomplete.length) {
        errors.push(`${capability.id} is Accepted without validated chains through: ${incomplete.join(", ")}`);
      }
    }
  }

  for (const decision of manifest.nodes.filter((node) => node.kind === "decision")) {
    const content = artifactById.get(decision.id);
    if (!content) continue;
    const declared = new Set(
      parseAdrDeclarations(content).map(
        ({ stage, experiment, evaluation }) => `${stage}:${experiment}:${evaluation}`
      )
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
    if (!evidence) {
      errors.push(`${result.id} has no scoped evidence record`);
      continue;
    }
    const experiment = nodesById.get(evidence.experiment);
    if (experiment?.kind !== "experiment") errors.push(`${result.id} evidence references invalid experiment`);
    if (!evidence.automatedChecks?.length) errors.push(`${result.id} has no automated check evidence`);
    for (const check of evidence.automatedChecks ?? []) {
      if (check.outcome !== "Passed") errors.push(`${result.id} automated check ${check.id} is not Passed`);
      const content = artifactById.get(result.id) ?? "";
      if (!content.includes(check.id) || !content.includes(check.command)) {
        errors.push(`${result.file} does not record evidence for ${check.id} (${check.command})`);
      }
    }
    if (result.status === "AutomatedPassHumanPending") {
      if (experiment?.status !== "Demonstrated") {
        errors.push(`${result.id} requires its experiment to be Demonstrated, not ${experiment?.status}`);
      }
      if (evidence.humanEvaluation?.status !== "Pending") {
        errors.push(`${result.id} must record human evaluation as Pending`);
      }
    }
    if (result.status === "Validated") {
      if (experiment?.status !== "Validated" || evidence.humanEvaluation?.status !== "Passed") {
        errors.push(`${result.id} is Validated without a validated experiment and passed human evaluation`);
      }
    }
  }

  for (const experiment of manifest.nodes.filter((node) => node.kind === "experiment")) {
    if (experiment.status === "Demonstrated") {
      const matchingResults = manifest.nodes.filter(
        (node) => node.kind === "result" && node.evidence?.experiment === experiment.id
      );
      if (!matchingResults.some((result) => result.status === "AutomatedPassHumanPending" || result.status === "Recorded")) {
        errors.push(`${experiment.id} is Demonstrated without a recorded automated demonstration result`);
      }
    }
    if (experiment.status === "Validated") {
      const matchingResults = manifest.nodes.filter(
        (node) => node.kind === "result" && node.evidence?.experiment === experiment.id
      );
      if (!matchingResults.some((result) => result.status === "Validated")) {
        errors.push(`${experiment.id} is Validated without a validated result`);
      }
    }
  }

  return errors;
}

export async function validateRepository(root = repositoryRoot) {
  const read = (path) => readFile(resolve(root, path), "utf8");
  const manifest = JSON.parse(await read("spec/traceability.json"));
  const traceabilitySchema = JSON.parse(await read("spec/traceability.schema.json"));
  const errors = await validateTraceability({ manifest, traceabilitySchema, loadArtifact: read });

  const schemaDir = resolve(root, "spec/domain/schemas");
  for (const name of await readdir(schemaDir)) {
    if (!name.endsWith(".json")) continue;
    const schema = JSON.parse(await read(`spec/domain/schemas/${name}`));
    if (!schema.$schema || !schema.$id) errors.push(`schema lacks $schema or $id: ${name}`);
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
