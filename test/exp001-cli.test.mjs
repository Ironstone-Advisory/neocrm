import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const cli = fileURLToPath(new URL("../apps/experiment-cli/src/cli.mjs", import.meta.url));

test("EXP-001 fixture preflight is a content-free, human-readable synthetic readiness summary", async () => {
  const { stdout } = await run(process.execPath, [cli, "--preflight", "--mode", "fixture", "--condition", "C"]);
  assert.match(stdout, /synthetic fixture preflight/i);
  assert.match(stdout, /fixture boundary: ready/i);
  assert.match(stdout, /does not confirm live credentials/i);
  assert.doesNotMatch(stdout, /credentialMode|apiOrigin|oauthOrigin|adapterId/i);
  assert.doesNotMatch(stdout, /Alex Rivera|Chief Operating Officer|too much change/i);
});

test("EXP-001 --json emits a machine-readable, secret-free preflight", async () => {
  const { stdout } = await run(process.execPath, [cli, "--preflight", "--mode", "fixture", "--condition", "C", "--json"]);
  const report = JSON.parse(stdout);
  assert.equal(report.zoho.ready, true);
  assert.equal(report.obsidian.ready, true);
  assert.doesNotMatch(stdout, /fixture-token/i);
  assert.doesNotMatch(stdout, /Alex Rivera|Chief Operating Officer|too much change/i);
});

test("EXP-001 fixture Conditions B and C traverse the same agent and canonical adapter contracts", async () => {
  const outputs = await Promise.all(
    ["B", "C"].map((condition) =>
      run(process.execPath, [cli, "--mode", "fixture", "--condition", condition, "--query", "What do I need to know before I speak with Alex Rivera?"])
    )
  );
  for (const { stdout } of outputs) {
    assert.match(stdout, /RelationshipBriefAgent@0\.1\.0/);
    assert.match(stdout, /External writes: disabled/);
    assert.match(stdout, /Durable memory: not written/);
    assert.match(stdout, /synthetic fixture \(not live\)/);
    assert.match(stdout, /Relationship brief: Alex Rivera/);
    assert.doesNotMatch(stdout, /sourceStatuses|credentialMode|apiOrigin|oauthOrigin/);
  }
  assert.doesNotMatch(outputs[0].stdout, /Obsidian note records/);
  assert.match(outputs[1].stdout, /Obsidian note records/);
  const runIds = outputs.map(({ stdout }) => stdout.match(/Run reference: (run_[A-Za-z0-9_-]+)/)?.[1]);
  assert.ok(runIds.every(Boolean));
  assert.notEqual(runIds[0], runIds[1]);
});

test("EXP-001 fixture replay is deterministic within one condition", async () => {
  const args = [cli, "--mode", "fixture", "--condition", "C", "--query", "What do I need to know before I speak with Alex Rivera?", "--json"];
  const [left, right] = await Promise.all([
    run(process.execPath, args),
    run(process.execPath, args)
  ]);
  const first = JSON.parse(left.stdout);
  const second = JSON.parse(right.stdout);
  assert.deepEqual(first, second);
  assert.equal(first.run.externalWrites, false);
  assert.equal(first.run.durableMemoryWritten, false);
});

test("EXP-001 JSON run envelope excludes relationship content and vault paths", async () => {
  const { stdout } = await run(process.execPath, [
    cli,
    "--mode",
    "fixture",
    "--condition",
    "C",
    "--query",
    "What do I need to know before I speak with Alex Rivera?",
    "--json"
  ]);
  const report = JSON.parse(stdout);
  assert.deepEqual(Object.keys(report), ["run"]);
  assert.equal(report.run.agent, "RelationshipBriefAgent@0.1.0");
  assert.doesNotMatch(
    stdout,
    /Alex Rivera|Chief Operating Officer|too much change|synthetic-obsidian-vault|[A-Z]:\\\\/i
  );
});

test("EXP-001 live mode cannot run without explicit acknowledgement", async () => {
  await assert.rejects(
    () => run(process.execPath, [cli, "--mode", "live", "--condition", "B"]),
    (error) => /explicit --live acknowledgement/i.test(error.stderr)
  );
});

test("EXP-001 acknowledged live mode fails closed before reads when configuration is incomplete", async () => {
  const env = {
    ...process.env,
    NEOCRM_ZOHO_REGION: "ca",
    NEOCRM_ZOHO_API_BASE_URL: "",
    NEOCRM_ZOHO_TOKEN_URL: "",
    NEOCRM_ZOHO_ACCESS_TOKEN: "",
    NEOCRM_ZOHO_REFRESH_TOKEN: "",
    NEOCRM_ZOHO_CLIENT_ID: "",
    NEOCRM_ZOHO_CLIENT_SECRET: ""
  };
  await assert.rejects(
    () => run(process.execPath, [cli, "--mode", "live", "--condition", "B", "--live"], { env }),
    (error) => {
      assert.match(error.stderr, /not ready/i);
      assert.match(error.stderr, /no relationship content was read/i);
      assert.doesNotMatch(`${error.stdout}\n${error.stderr}`, /Relationship brief:/i);
      return true;
    }
  );
});

test("EXP-001 Condition C reports incomplete live boundaries without paths or content", async () => {
  const env = {
    ...process.env,
    NEOCRM_ZOHO_REGION: "ca",
    NEOCRM_ZOHO_API_BASE_URL: "",
    NEOCRM_ZOHO_TOKEN_URL: "",
    NEOCRM_ZOHO_ACCESS_TOKEN: "",
    NEOCRM_ZOHO_REFRESH_TOKEN: "",
    NEOCRM_ZOHO_CLIENT_ID: "",
    NEOCRM_ZOHO_CLIENT_SECRET: "",
    NEOCRM_OBSIDIAN_VAULT_ROOT: "",
    NEOCRM_OBSIDIAN_APPROVED_DIRS: ""
  };
  await assert.rejects(
    () => run(process.execPath, [cli, "--mode", "live", "--condition", "C", "--live"], { env }),
    (error) => {
      const output = `${error.stdout}\n${error.stderr}`;
      assert.match(output, /Zoho CRM read boundary: not ready/i);
      assert.match(output, /Obsidian vault read boundary: not ready/i);
      assert.doesNotMatch(output, /Relationship brief:|C:\\|credentialMode|apiOrigin/i);
      return true;
    }
  );
});
