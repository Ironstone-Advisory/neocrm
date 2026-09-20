import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFile(resolve(root, path), "utf8");
const manifest = JSON.parse(await read("spec/traceability.json"));
const errors = [];
const idPattern = /^(?:CAP|EXP|EVAL|IMP|RES)-\d{3}$|^ADR-\d{4}$|^(?:FR|NFR|SAFE)-[A-Z]+-\d{3}$/;
const ids = new Set();

for (const node of manifest.nodes) {
  if (!idPattern.test(node.id)) errors.push(`malformed id: ${node.id}`);
  if (ids.has(node.id)) errors.push(`duplicate id: ${node.id}`);
  ids.add(node.id);
  try {
    await access(resolve(root, node.file));
    const content = await read(node.file);
    if (!content.includes(node.id)) errors.push(`${node.file} does not mention ${node.id}`);
  } catch {
    errors.push(`missing file for ${node.id}: ${node.file}`);
  }
}

const outgoing = new Map();
for (const link of manifest.links) {
  if (!ids.has(link.from)) errors.push(`unknown link source: ${link.from}`);
  if (!ids.has(link.to)) errors.push(`unknown link target: ${link.to}`);
  const targets = outgoing.get(link.from) ?? [];
  targets.push(link.to);
  outgoing.set(link.from, targets);
}

const kindById = new Map(manifest.nodes.map((node) => [node.id, node.kind]));
for (const capability of manifest.nodes.filter((node) => node.kind === "capability")) {
  const seen = new Set([capability.id]);
  const queue = [capability.id];
  while (queue.length) {
    for (const next of outgoing.get(queue.shift()) ?? []) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  for (const kind of ["requirement", "quality", "safety", "decision", "experiment", "evaluation", "implementation", "result"]) {
    if (![...seen].some((id) => kindById.get(id) === kind)) {
      errors.push(`${capability.id} has no trace to kind ${kind}`);
    }
  }
}

const schemaDir = resolve(root, "spec/domain/schemas");
for (const name of await readdir(schemaDir)) {
  if (!name.endsWith(".json")) continue;
  const schema = JSON.parse(await read(`spec/domain/schemas/${name}`));
  if (!schema.$schema || !schema.$id) errors.push(`schema lacks $schema or $id: ${name}`);
}

const schema = JSON.parse(await read("spec/domain/schemas/neocrm.schema.json"));
const types = await read("packages/contracts/src/index.ts");
const projectedEnums = [
  ...schema.$defs.Party.oneOf.map((entry) => entry.$ref.split("/").at(-1).toLowerCase()),
  ...schema.$defs.Role.properties.roleType.enum,
  ...schema.$defs.Assertion.properties.kind.enum,
  ...schema.$defs.AdapterCapability.properties.authority.enum
];
for (const value of projectedEnums) {
  if (!types.includes(`"${value}"`)) errors.push(`TypeScript projection missing schema value: ${value}`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`spec validation passed: ${manifest.nodes.length} nodes, ${manifest.links.length} links`);
