import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFile(resolve(root, path), "utf8");

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true
  });
}

function requireText(errors, content, expected, label) {
  if (!content.includes(expected)) errors.push(`${label} is missing: ${expected}`);
}

export async function checkArticleClaims() {
  const errors = [];
  const [article, ledger, checklist, figure, manifestText] = await Promise.all([
    read("article/draft.md"),
    read("article/evidence-ledger.md"),
    read("article/publication-checklist.md"),
    read("article/figures/architecture.mmd"),
    read("spec/traceability.json")
  ]);
  const manifest = JSON.parse(manifestText);

  const h1s = article.match(/^# (?!#).+$/gm) ?? [];
  if (h1s.length !== 1) errors.push(`article must contain exactly one H1; found ${h1s.length}`);
  const title = h1s[0]?.slice(2).trim() ?? "";
  if (title.length > 60) errors.push(`article title exceeds 60 characters: ${title.length}`);

  const meta = article.match(/^\*\*Meta description:\*\* (.+)$/m)?.[1]?.trim() ?? "";
  if (!meta) errors.push("article has no meta description");
  else if (meta.length > 160) errors.push(`meta description exceeds 160 characters: ${meta.length}`);

  const opening = article.match(/## What if we started from scratch\?\s+([\s\S]*?)(?=\n## )/)?.[1]?.trim() ?? "";
  const openingWords = opening.match(/[\p{L}\p{N}’'-]+/gu)?.length ?? 0;
  if (openingWords < 100 || openingWords > 150) {
    errors.push(`opening must contain 100-150 words; found ${openingWords}`);
  }

  const traceClaim = `**${manifest.nodes.length} typed nodes and ${manifest.links.length} typed links**`;
  const traceLedgerClaim = `**${manifest.nodes.length} typed specification nodes / ${manifest.links.length} typed links**`;
  requireText(errors, article, traceClaim, "article traceability claim");
  requireText(errors, ledger, traceLedgerClaim, "ledger traceability claim");

  const evaluation = runNode(["evals/run-eval.mjs"]);
  if (evaluation.status !== 0) {
    errors.push(`EVAL-001 command failed: ${(evaluation.stderr || evaluation.stdout).trim()}`);
  } else {
    try {
      const result = JSON.parse(evaluation.stdout);
      const caseCount = result.eligibility.executedCaseCount;
      const gateCount = result.safetyGates.length;
      requireText(errors, article, `**${caseCount} of ${caseCount} cases**`, "article EVAL-001 case claim");
      requireText(errors, ledger, `**EVAL-001 executed ${caseCount}/${caseCount} cases**`, "ledger EVAL-001 case claim");
      requireText(errors, article, `**${result.weightedScore}/${result.maximumScore}**`, "article EVAL-001 score claim");
      requireText(errors, ledger, `**EVAL-001 scored ${result.weightedScore}/${result.maximumScore}**`, "ledger EVAL-001 score claim");
      requireText(errors, article, `**${gateCount} of ${gateCount} safety gates**`, "article safety-gate claim");
      requireText(errors, ledger, `**EVAL-001 passed ${gateCount}/${gateCount} safety gates**`, "ledger safety-gate claim");
    } catch (error) {
      errors.push(`EVAL-001 did not return parseable JSON: ${error.message}`);
    }
  }

  const mutations = runNode(["--test", "test/eval-mutations.test.mjs"]);
  const mutationCount = Number(mutations.stdout.match(/(?:^|\n).*tests\s+(\d+)\s*$/m)?.[1]);
  const mutationPasses = Number(mutations.stdout.match(/(?:^|\n).*pass\s+(\d+)\s*$/m)?.[1]);
  const mutationFailures = Number(mutations.stdout.match(/(?:^|\n).*fail\s+(\d+)\s*$/m)?.[1]);
  if (mutations.status !== 0 || !mutationCount || mutationPasses !== mutationCount || mutationFailures !== 0) {
    errors.push("mutation evaluation did not complete with every mutation test passing");
  } else {
    requireText(errors, article, `**${mutationCount} of ${mutationCount} negative tests**`, "article mutation claim");
    requireText(errors, ledger, `**${mutationCount}/${mutationCount} mutation tests passed**`, "ledger mutation claim");
  }

  for (const condition of ["B", "C"]) {
    const fixture = runNode([
      "apps/experiment-cli/src/cli.mjs",
      "--mode",
      "fixture",
      "--condition",
      condition,
      "--query",
      "What do I need to know before I speak with Alex Rivera?"
    ]);
    if (fixture.status !== 0) errors.push(`synthetic fixture condition ${condition} failed`);
  }
  requireText(errors, article, "Conditions B and C are runnable today against committed synthetic fixtures.", "article fixture boundary");
  requireText(errors, ledger, "Synthetic fixture Conditions B and C are runnable", "ledger fixture claim");
  requireText(errors, article, "External writes and durable conversational memory remain disabled in this slice.", "article no-write boundary");
  requireText(errors, ledger, "External writes and durable conversational memory are disabled", "ledger no-write claim");

  requireText(errors, figure, "CS -.-> L7", "figure Canonical Semantics plane");
  requireText(errors, figure, "GC -.-> L1", "figure Governance / Control plane");
  requireText(errors, figure, "Relationship Intelligence Layer - Layers 2 to 4", "figure RIL scope");

  requireText(errors, article, "Human usefulness remains pending.", "article human-evidence boundary");
  requireText(errors, ledger, "Do not claim business impact.", "ledger business-outcome boundary");
  requireText(errors, checklist, "Search the article package for unresolved placeholders: `{{`.", "publication placeholder gate");

  return { errors, openingWords, nodeCount: manifest.nodes.length, linkCount: manifest.links.length };
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isDirectRun) {
  const result = await checkArticleClaims();
  if (result.errors.length) {
    console.error(result.errors.map((error) => `- ${error}`).join("\n"));
    process.exitCode = 1;
  } else {
    console.log(
      `article claim check passed: ${result.nodeCount} nodes, ${result.linkCount} links, ${result.openingWords}-word opening`
    );
  }
}
