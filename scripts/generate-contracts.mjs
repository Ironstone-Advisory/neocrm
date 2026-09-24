import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { compile } from "json-schema-to-typescript";

const root = resolve(import.meta.dirname, "..");
const targets = [
  {
    schemaPath: resolve(root, "spec/contracts/capabilities/cap-001.schema.json"),
    outputPath: resolve(root, "packages/contracts/src/index.ts"),
    name: "NeoCRMContract",
    implementationId: "IMP-001",
    source: "spec/contracts/capabilities/cap-001.schema.json",
    scope: "CAP-001 exchanges"
  },
  {
    schemaPath: resolve(root, "spec/contracts/agent-runtime.schema.json"),
    outputPath: resolve(root, "packages/contracts/src/agent-runtime.ts"),
    name: "NeoCRMAgentRuntimeContract",
    implementationId: "IMP-005",
    source: "spec/contracts/agent-runtime.schema.json",
    scope: "bounded EXP-001 agent-runtime exchanges"
  }
];

let mismatches = 0;
for (const target of targets) {
  const schema = JSON.parse(await readFile(target.schemaPath, "utf8"));
  const generated = await compile(schema, target.name, {
  bannerComment:
    `/*\n * ${target.implementationId} - Status: Implemented\n * GENERATED from ${target.source}.\n * Normative for ${target.scope} only. Run pnpm generate:contracts; do not hand edit.\n */`,
  style: {
    bracketSpacing: true,
    printWidth: 100,
    semi: true,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: "none",
    useTabs: false
  }
  });

  if (process.argv.includes("--check")) {
    const current = await readFile(target.outputPath, "utf8");
    if (current !== generated) {
      console.error(`generated TypeScript contract is out of date: ${target.outputPath}`);
      mismatches += 1;
    }
  } else {
    await writeFile(target.outputPath, generated, "utf8");
    console.log(`generated ${target.outputPath}`);
  }
}

if (mismatches > 0) process.exit(1);
if (process.argv.includes("--check")) {
  console.log("generated TypeScript contracts match the normative schemas");
}
