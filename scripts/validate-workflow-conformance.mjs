import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { workflowConformanceErrors } from "../packages/contracts/src/workflow-conformance.mjs";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFile(resolve(root, path), "utf8");
const json = async (path) => JSON.parse(await read(path));

const [schema, registry, traceability, sourceCatalogue, decisions] = await Promise.all([
  json("spec/contracts/workflow-definition.schema.json"),
  json("workflows/registry.json"),
  json("spec/traceability.json"),
  json("adapters/_catalog/capability-intents.json"),
  read("spec/product/decision-register.md")
]);

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validateSchema = ajv.compile(schema);
const knownTraceIds = new Set(traceability.nodes.map((node) => node.id));
const knownSourceIntentIds = new Set(sourceCatalogue.intents.map((intent) => intent.id));
const knownDecisionIds = new Set([...decisions.matchAll(/\|\s*(D[0-9]{2})\s*\|/g)].map((match) => match[1]));
const failures = [];

for (const entry of registry.workflows) {
  const definition = await json(entry.path);
  if (!validateSchema(definition)) {
    failures.push({ workflowId: entry.workflowId, kind: "schema", errors: structuredClone(validateSchema.errors ?? []) });
  }
  const errors = workflowConformanceErrors(definition, { knownTraceIds, knownSourceIntentIds, knownDecisionIds });
  if (errors.length > 0) failures.push({ workflowId: entry.workflowId, kind: "semantic", errors });
}

if (failures.length > 0) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
} else {
  console.log(`Workflow conformance OK: ${registry.definitionCount} definitions`);
}
