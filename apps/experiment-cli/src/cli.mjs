// IMP-010 - Status: Implemented. Fixture-first EXP-001 runner and live preflight.
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  createZohoAdapter,
  preflightZoho,
  zohoConfigFromEnv
} from "../../../adapters/zoho/src/index.mjs";
import { createZohoFixtureFetch } from "../../../adapters/zoho/src/fixture-fetch.mjs";
import {
  createObsidianAdapter,
  obsidianConfigFromEnv,
  preflightObsidian
} from "../../../adapters/obsidian/src/index.mjs";
import {
  createReadOnlyGrant,
  runRelationshipBriefAgent
} from "../../../packages/agent-runtime/src/index.mjs";
import { createRelationshipContextBoundary } from "../../../packages/context-engine/src/index.mjs";
import { opaqueId } from "../../../packages/relationship-intelligence/src/ids.mjs";
import { renderRelationshipBrief } from "../../assistant/src/assistant.mjs";

function argumentsOf(argv) {
  const args = argv.filter((argument) => argument !== "--");
  const value = (name, fallback) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : fallback;
  };
  return {
    mode: value("--mode", "fixture"),
    condition: String(value("--condition", "C")).toUpperCase(),
    query: value("--query", "What do I need to know before I speak with Alex Rivera?"),
    scheduled: args.includes("--scheduled"),
    preflight: args.includes("--preflight"),
    liveAcknowledged: args.includes("--live"),
    json: args.includes("--json")
  };
}

function safePrint(value) {
  console.log(JSON.stringify(value, null, 2));
}

function conditionLabel(condition) {
  return condition === "B" ? "NeoCRM with Zoho" : "NeoCRM with Zoho and Obsidian";
}

function readinessSummary({ mode, condition, preflight }) {
  const synthetic = mode === "fixture";
  const lines = [
    `EXP-001 ${synthetic ? "synthetic fixture" : "live"} preflight — Condition ${condition}`,
    `Configuration: ${conditionLabel(condition)}`,
    `- Zoho ${synthetic ? "fixture boundary" : "CRM read boundary"}: ${preflight.zoho?.ready ? "ready" : "not ready"}`
  ];
  if (condition === "C") {
    lines.push(
      `- Obsidian ${synthetic ? "fixture boundary" : "vault read boundary"}: ${preflight.obsidian?.ready ? "ready" : "not ready"}`
    );
  }
  lines.push(
    synthetic
      ? "This checks synthetic data only; it does not confirm live credentials, a live Zoho tenant, or a real vault."
      : "This checks configuration and boundary access only; it does not read relationship content."
  );
  return lines.join("\n");
}

function runSummary({ input, run }) {
  const queried = run.contextSnapshot?.sourceStatuses.filter(
    ({ status }) => status === "queried"
  ).length ?? 0;
  return [
    "EXP-001 run summary",
    `- Data mode: ${input.mode === "fixture" ? "synthetic fixture (not live)" : "live read-only"}`,
    `- Condition ${input.condition}: ${conditionLabel(input.condition)}`,
    `- Result: ${run.status}`,
    `- Agent path: ${run.agent.name}@${run.agent.version}`,
    `- Read boundaries used: ${queried}`,
    `- Evidence items: ${run.brief?.evidence.length ?? 0}`,
    "- External writes: disabled",
    "- Durable memory: not written",
    `- Run reference: ${run.runId}`
  ].join("\n");
}

async function fixtureSystem(condition) {
  const fixture = JSON.parse(
    await readFile(
      new URL("../../../experiments/fixtures/zoho-obsidian-parity.json", import.meta.url),
      "utf8"
    )
  );
  const transport = createZohoFixtureFetch(fixture);
  const zoho = createZohoAdapter(
    { region: "ca", accessToken: "fixture-token", maxRetries: 1 },
    { fetchImpl: transport.fetchImpl, now: () => fixture.clock, sleep: async () => {} }
  );
  const adapters = [zoho.adapter];
  let obsidian;
  if (condition === "C") {
    const vaultRoot = fileURLToPath(
      new URL("../../../experiments/fixtures/synthetic-obsidian-vault/", import.meta.url)
    );
    obsidian = createObsidianAdapter(
      { vaultRoot, approvedSubdirectories: ["relationships"], approvedTags: ["neocrm"] },
      { now: () => fixture.clock }
    );
    adapters.push(obsidian);
  }
  return {
    now: fixture.clock,
    identityResolver: zoho.identityResolver,
    adapters,
    preflight: {
      zoho: zoho.preflight(),
      ...(obsidian ? { obsidian: await obsidian.preflight() } : {})
    }
  };
}

async function liveSystem(condition) {
  const now = new Date().toISOString();
  let zoho;
  let zohoPreflight;
  try {
    zoho = createZohoAdapter(zohoConfigFromEnv());
    zohoPreflight = zoho.preflight();
  } catch {
    zohoPreflight = { ready: false, issue: "Zoho configuration is invalid." };
  }
  const adapters = zoho ? [zoho.adapter] : [];
  let obsidian;
  let obsidianPreflight;
  if (condition === "C") {
    try {
      obsidian = createObsidianAdapter(obsidianConfigFromEnv());
      obsidianPreflight = await obsidian.preflight();
      adapters.push(obsidian);
    } catch {
      obsidianPreflight = { ready: false, issue: "Obsidian configuration is invalid." };
    }
  }
  return {
    now,
    identityResolver: zoho?.identityResolver,
    adapters,
    preflight: {
      zoho: zohoPreflight,
      ...(condition === "C" ? { obsidian: obsidianPreflight } : {})
    }
  };
}

async function preflightOnly(mode, condition) {
  if (mode === "fixture") return (await fixtureSystem(condition)).preflight;
  const result = {};
  try {
    result.zoho = preflightZoho(zohoConfigFromEnv());
  } catch (error) {
    result.zoho = { ready: false, issue: error.message };
  }
  if (condition === "C") {
    try {
      result.obsidian = await preflightObsidian(obsidianConfigFromEnv());
    } catch (error) {
      result.obsidian = { ready: false, issue: error.message };
    }
  }
  return result;
}

const input = argumentsOf(process.argv.slice(2));
if (!["fixture", "live"].includes(input.mode)) throw new Error("--mode must be fixture or live.");
if (!["A", "B", "C"].includes(input.condition)) throw new Error("--condition must be A, B, or C.");
if (input.mode === "live" && !input.liveAcknowledged) {
  throw new Error("Live mode requires the explicit --live acknowledgement.");
}
if (input.condition === "A") {
  if (input.json) {
    safePrint({ experiment: "EXP-001", condition: "A", mode: "human_baseline", neoCrmRunPerformed: false });
  } else {
    console.log("Condition A is the human Zoho baseline. Follow experiments/EXP-001-zoho-obsidian-relationship-brief/conditions/A-zoho-baseline.md; no NeoCRM adapter run is performed.");
  }
  process.exit(0);
}
if (input.preflight) {
  const preflight = await preflightOnly(input.mode, input.condition);
  if (input.json) safePrint(preflight);
  else console.log(readinessSummary({ mode: input.mode, condition: input.condition, preflight }));
  process.exit(0);
}

const system = input.mode === "fixture"
  ? await fixtureSystem(input.condition)
  : await liveSystem(input.condition);
if (!Object.values(system.preflight).every((item) => item.ready)) {
  if (input.json) safePrint(system.preflight);
  else console.error(readinessSummary({ mode: input.mode, condition: input.condition, preflight: system.preflight }));
  throw new Error("Preflight is not ready; no relationship content was read.");
}

const trigger = {
  contractType: "trigger",
  triggerId: opaqueId(
    "trigger",
    input.mode,
    input.condition,
    input.scheduled ? "scheduled" : "conversational",
    input.query,
    system.now
  ),
  kind: input.scheduled ? "scheduled" : "conversational",
  receivedAt: system.now,
  query: input.query
};
const expiresAt = new Date(Date.parse(system.now) + 60 * 60 * 1000).toISOString();
const grant = createReadOnlyGrant({ expiresAt });
const contextBoundary = createRelationshipContextBoundary({
  identityResolver: system.identityResolver,
  adapters: system.adapters,
  now: system.now,
  logger: { log() {} }
});
const run = await runRelationshipBriefAgent({
  trigger,
  authorityGrant: grant,
  contextBoundary,
  now: system.now,
  auditLogger: { log() {} }
});

const machineResult = {
  experiment: "EXP-001",
  mode: input.mode,
  condition: input.condition,
  runId: run.runId,
  agent: `${run.agent.name}@${run.agent.version}`,
  triggerKind: run.trigger.kind,
  status: run.status,
  policyDecision: run.policyDecision.decision,
  evidenceCount: run.brief?.evidence.length ?? 0,
  sourceStatuses: run.contextSnapshot?.sourceStatuses ?? [],
  externalWrites: false,
  durableMemoryWritten: false
};
if (input.json) {
  // JSON is an operational envelope, not a content export. Keeping the
  // rendered relationship brief out of machine output prevents private source
  // bodies from being redirected into logs or automation by accident.
  safePrint({ run: machineResult });
} else {
  if (run.brief) console.log(renderRelationshipBrief(run.brief));
  console.log(`\n---\n${runSummary({ input, run })}`);
}
