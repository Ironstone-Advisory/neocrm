import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFile(resolve(root, path), "utf8");

test("records all forty-eight approved product decisions exactly once", async () => {
  const register = await read("spec/product/decision-register.md");
  const ids = [...register.matchAll(/^\| D(\d{2}) \|/gm)].map((match) => Number(match[1]));
  assert.deepEqual(ids, Array.from({ length: 48 }, (_, index) => index + 1));
  assert.match(register, /\*\*Status:\*\* Accepted/);
});

test("preserves the modified authority and multi-workflow decisions", async () => {
  const register = await read("spec/product/decision-register.md");
  assert.match(register, /D08[^\n]+minimum-necessary[^\n]+time-bounded grants/i);
  assert.match(register, /D13[^\n]+broad registered portfolio of Zoho workflows/i);
  assert.match(register, /Every deletion requires a \*\*fresh, exact, human authorization\*\*/i);
  assert.match(register, /general or time-bounded WriteGrant never includes `delete`/i);
});

test("keeps CAP-001 and EXP-001 read-only while later write experiments remain planned", async () => {
  const [readme, exp001, exp015, eval004] = await Promise.all([
    read("README.md"),
    read("experiments/EXP-001-zoho-obsidian-relationship-brief/spec.md"),
    read("experiments/EXP-015-multi-workflow-zoho-write/spec.md"),
    read("evals/approved-portfolio-experiment-plan.json")
  ]);
  assert.match(readme, /CAP-001[^\n]+EXP-001[^\n]+read-only/i);
  assert.match(exp001, /read-only/i);
  assert.match(exp015, /\*\*Status:\*\* Planned/);
  assert.match(eval004, /defined plan, not an implemented evaluator/i);
});
