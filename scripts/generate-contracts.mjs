import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { compile } from "json-schema-to-typescript";

const root = resolve(import.meta.dirname, "..");
const schemaPath = resolve(root, "spec/domain/schemas/neocrm.schema.json");
const outputPath = resolve(root, "packages/contracts/src/index.ts");
const schema = JSON.parse(await readFile(schemaPath, "utf8"));
const generated = await compile(schema, "NeoCRMContract", {
  bannerComment:
    "/*\n * IMP-001 - Status: Implemented\n * GENERATED from spec/domain/schemas/neocrm.schema.json.\n * JSON Schema is normative. Run pnpm generate:contracts; do not hand edit.\n */",
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
  const current = await readFile(outputPath, "utf8");
  if (current !== generated) {
    console.error("generated TypeScript contracts are out of date");
    process.exit(1);
  }
  console.log("generated TypeScript contracts match the normative schema");
} else {
  await writeFile(outputPath, generated, "utf8");
  console.log("generated packages/contracts/src/index.ts");
}

