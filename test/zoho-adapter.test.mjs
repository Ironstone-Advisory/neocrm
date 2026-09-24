import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createZohoAdapter, preflightZoho, zohoConfigFromEnv } from "../adapters/zoho/src/index.mjs";
import { createZohoFixtureFetch } from "../adapters/zoho/src/fixture-fetch.mjs";
import { validateContract } from "../packages/contracts/src/runtime.mjs";

async function dataset() {
  return JSON.parse(await readFile(new URL("../experiments/fixtures/zoho-obsidian-parity.json", import.meta.url), "utf8"));
}

async function system(options = {}) {
  const data = await dataset();
  const transport = createZohoFixtureFetch(data, options.transport);
  const source = createZohoAdapter(
    { region: "ca", accessToken: "secret-fixture-token", maxRetries: options.maxRetries ?? 1, maxPages: options.maxPages ?? 2, modules: options.modules },
    { fetchImpl: transport.fetchImpl, now: () => data.clock, sleep: async () => {} }
  );
  return { data, transport, source };
}

test("Zoho preflight reports allowlists without exposing secrets", () => {
  const report = preflightZoho({ region: "ca", accessToken: "super-secret" });
  assert.equal(report.ready, true);
  assert.deepEqual(report.operations, ["GET"]);
  assert.deepEqual(report.modules, ["Contacts", "Accounts", "Deals"]);
  assert.doesNotMatch(JSON.stringify(report), /super-secret/);
});

test("blank optional environment values remain unset rather than invalid overrides", () => {
  const config = zohoConfigFromEnv({
    NEOCRM_ZOHO_REGION: " ca ",
    NEOCRM_ZOHO_API_BASE_URL: " ",
    NEOCRM_ZOHO_TOKEN_URL: "",
    NEOCRM_ZOHO_ACCESS_TOKEN: " "
  });
  const report = preflightZoho(config);
  assert.equal(report.ready, false);
  assert.equal(report.apiOrigin, "https://www.zohoapis.ca");
  assert.equal(report.oauthOrigin, "https://accounts.zohocloud.ca");
});

test("Zoho identity search is minimal and contextual reads remain GET-only", async () => {
  const { data, transport, source } = await system();
  const identity = await source.identityResolver.resolve({ query: "Alex Rivera" });
  assert.equal(identity.status, "resolved");
  assert.equal(identity.selectedPartyId, "zoho:Contacts:zc-101");
  const result = await source.adapter.read({
    contractType: "adapter_request",
    adapterId: "zoho-crm",
    domains: ["party", "relationship", "commercial"],
    filters: { partyId: identity.selectedPartyId }
  });
  assert.equal(result.status, "ok");
  assert.equal(validateContract("AdapterCapability", source.adapter.capability).valid, true);
  assert.equal(validateContract("AdapterResult", result).valid, true);
  assert.ok(transport.calls.every((call) => call.method === "GET"));
  assert.ok(transport.calls.findIndex((call) => call.url.endsWith("/Contacts/search")) < transport.calls.findIndex((call) => call.url.endsWith("/Contacts/zc-101")));
  assert.ok(result.records.some((record) => record.nativeId === "Deals:zd-301"));
  const provenance = result.records.flatMap((record) => record.claims).find((item) => item.fieldApiName === "Stage");
  assert.equal(provenance.sourceModule, "Deals");
  assert.equal(provenance.transformation, "zoho.Deals.Stage.v1");
  assert.ok(!result.roles.some((role) => role.roleType === "customer"));
  assert.ok(result.roles.some((role) => role.roleType === "prospect"));
  assert.equal(data.fixtureId, "FIX-EXP-001-ZOHO-OBSIDIAN-v1");
});

test("Zoho identity resolution refuses broad blank searches and disabled Lead references", async () => {
  const { transport, source } = await system();
  await assert.rejects(
    () => source.identityResolver.resolve({ query: "   " }),
    (error) => error.code === "INVALID_IDENTITY_QUERY"
  );
  const disabled = await source.identityResolver.resolve({
    selectedPartyId: "zoho:Leads:guess"
  });
  assert.equal(disabled.status, "not_found");
  assert.equal(transport.calls.length, 0);
});

test("Zoho pagination stops at the configured cap", async () => {
  const data = await dataset();
  const calls = [];
  const base = createZohoFixtureFetch(data);
  const fetchImpl = async (input, init) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith("/Contacts/zc-101/Deals")) {
      calls.push(Number(url.searchParams.get("page")));
      return Response.json({ data: data.zoho.Deals, info: { more_records: true } });
    }
    return base.fetchImpl(input, init);
  };
  const source = createZohoAdapter(
    { region: "ca", accessToken: "x", maxPages: 2 },
    { fetchImpl, now: () => data.clock }
  );
  const result = await source.adapter.read({ contractType: "adapter_request", adapterId: "zoho-crm", domains: ["commercial"], filters: { partyId: "zoho:Contacts:zc-101" } });
  assert.equal(result.status, "ok");
  assert.deepEqual(calls, [1, 2]);
});

test("Zoho timeout fails with a sanitized boundary error", async () => {
  const fetchImpl = async (_input, init = {}) => new Promise((_resolve, reject) => {
    init.signal.addEventListener("abort", () => {
      const error = new Error("raw transport timeout with secret-token");
      error.name = "AbortError";
      reject(error);
    });
  });
  const source = createZohoAdapter(
    { region: "ca", accessToken: "secret-token", timeoutMs: 100, maxRetries: 0 },
    { fetchImpl }
  );
  await assert.rejects(
    () => source.identityResolver.resolve({ query: "Alex" }),
    (error) => error.code === "ZOHO_TIMEOUT" && !/secret-token|raw transport/i.test(error.message)
  );
});

test("Zoho timeout remains active while a response body is read", async () => {
  const fetchImpl = async (_input, init = {}) => ({
    ok: true,
    status: 200,
    headers: new Headers(),
    async json() {
      return new Promise((_resolve, reject) => {
        init.signal.addEventListener("abort", () => {
          const error = new Error("raw slow body with secret-token");
          error.name = "AbortError";
          reject(error);
        });
      });
    }
  });
  const source = createZohoAdapter(
    { region: "ca", accessToken: "secret-token", timeoutMs: 100, maxRetries: 0 },
    { fetchImpl }
  );
  await assert.rejects(
    () => source.identityResolver.resolve({ query: "Alex" }),
    (error) => error.code === "ZOHO_TIMEOUT" && !/secret-token|raw slow body/i.test(error.message)
  );
});

test("enabled Zoho Leads map to a Party candidate plus Prospect role, never Customer", async () => {
  const data = await dataset();
  data.zoho.Contacts = [{
    id: "zc-other",
    Full_Name: "Other Person",
    First_Name: "Other",
    Last_Name: "Person",
    Account_Name: null,
    Modified_Time: data.clock
  }];
  data.zoho.Leads = [{ id: "zl-1", Full_Name: "Jamie Lee", Designation: "Director", Company: "Example Co", Modified_Time: data.clock }];
  const transport = createZohoFixtureFetch(data);
  const source = createZohoAdapter(
    { region: "ca", accessToken: "x", modules: ["Contacts", "Accounts", "Deals", "Leads"] },
    { fetchImpl: transport.fetchImpl, now: () => data.clock }
  );
  const identity = await source.identityResolver.resolve({ query: "Jamie Lee" });
  assert.equal(identity.selectedPartyId, "zoho:Leads:zl-1");
  const result = await source.adapter.read({ contractType: "adapter_request", adapterId: "zoho-crm", domains: ["party", "relationship"], filters: { partyId: identity.selectedPartyId } });
  assert.ok(result.roles.some((role) => role.roleType === "prospect"));
  assert.ok(!result.roles.some((role) => role.roleType === "customer"));
});

test("Zoho explicit module allowlist rejects unsupported modules", () => {
  assert.throws(() => createZohoAdapter({ region: "ca", accessToken: "x", modules: ["Contacts", "Invoices"] }, { fetchImpl: async () => new Response() }), /allowlist/);
});

test("Zoho region boundaries reject attacker-controlled API and OAuth endpoints", () => {
  for (const config of [
    { region: "ca", accessToken: "secret", apiBaseUrl: "https://attacker.example" },
    { region: "ca", refreshToken: "r", clientId: "c", clientSecret: "s", tokenUrl: "https://attacker.example/oauth/v2/token" },
    { region: "unknown", accessToken: "secret", apiBaseUrl: "https://www.zohoapis.ca" },
    { region: "ca", accessToken: "secret", apiBaseUrl: "https://www.zohoapis.ca?next=https://attacker.example" }
  ]) {
    assert.throws(() => preflightZoho(config), /region|boundary|query parameters/i);
  }
});

test("Zoho field configuration is an explicit per-module allowlist", () => {
  assert.throws(
    () => createZohoAdapter(
      {
        region: "ca",
        accessToken: "x",
        fields: { Contacts: ["id", "Full_Name", "Sensitive_Custom_Field"] }
      },
      { fetchImpl: async () => new Response() }
    ),
    /field allowlist/i
  );
  assert.throws(
    () => createZohoAdapter({ region: "ca", accessToken: "x", maxPages: "many" }),
    /finite integer/i
  );
  assert.throws(
    () => createZohoAdapter(
      { region: "ca", accessToken: "x", fields: { Contacts: ["id"] } },
      { fetchImpl: async () => new Response() }
    ),
    /identity name field/i
  );
});

test("Zoho retries rate-limited GET requests within the configured cap", async () => {
  const { transport, source } = await system({ transport: { failures: [{ status: 429, headers: { "retry-after": "0" } }] }, maxRetries: 1 });
  const identity = await source.identityResolver.resolve({ query: "Alex Rivera" });
  assert.equal(identity.status, "resolved");
  assert.ok(transport.calls.length >= 3);
  assert.ok(transport.calls.every((call) => call.method === "GET"));
});

test("Zoho sanitized failures never expose tokens, raw URLs, or response bodies", async () => {
  const { source } = await system({ transport: { failures: [{ status: 403 }] }, maxRetries: 0 });
  await assert.rejects(
    () => source.identityResolver.resolve({ query: "Alex Rivera" }),
    (error) => {
      assert.equal(error.code, "ZOHO_ACCESS_DENIED");
      assert.doesNotMatch(error.message, /secret|https:|fixture_failure/i);
      return true;
    }
  );
});

test("Zoho refresh token exchange is the only permitted POST", async () => {
  const data = await dataset();
  const calls = [];
  const fixture = createZohoFixtureFetch(data);
  const fetchImpl = async (input, init = {}) => {
    const method = String(init.method ?? "GET").toUpperCase();
    calls.push({
      url: String(input),
      method,
      redirect: init.redirect,
      authorization: init.headers?.Authorization,
      body: init.body ? String(init.body) : ""
    });
    if (method === "POST") return Response.json({ access_token: "refreshed" });
    return fixture.fetchImpl(input, init);
  };
  const source = createZohoAdapter(
    { region: "ca", refreshToken: "r", clientId: "c", clientSecret: "s" },
    { fetchImpl, now: () => data.clock }
  );
  await source.identityResolver.resolve({ query: "Alex Rivera" });
  const posts = calls.filter((call) => call.method === "POST");
  assert.equal(posts.length, 1);
  assert.equal(posts[0].url, "https://accounts.zohocloud.ca/oauth/v2/token");
  assert.equal(posts[0].redirect, "error");
  assert.match(posts[0].body, /refresh_token=r/);
  assert.equal(posts[0].authorization, undefined);
  assert.ok(calls.filter((call) => call.method === "GET").every((call) => call.url.startsWith("https://www.zohoapis.ca/")));
  assert.ok(calls.filter((call) => call.method === "GET").every((call) => call.redirect === "error"));
  assert.ok(calls.filter((call) => call.method === "GET").every((call) => call.authorization === "Zoho-oauthtoken refreshed"));
  assert.ok(calls.filter((call) => call.method === "GET").every((call) => !/refresh_token|client_secret/.test(call.body)));
});

test("concurrent Zoho reads share one bounded refresh exchange", async () => {
  const data = await dataset();
  const fixture = createZohoFixtureFetch(data);
  let posts = 0;
  const fetchImpl = async (input, init = {}) => {
    if (String(init.method ?? "GET").toUpperCase() === "POST") {
      posts += 1;
      await Promise.resolve();
      return Response.json({ access_token: "shared-token" });
    }
    return fixture.fetchImpl(input, init);
  };
  const source = createZohoAdapter(
    { region: "ca", refreshToken: "r", clientId: "c", clientSecret: "s" },
    { fetchImpl, now: () => data.clock }
  );
  const [left, right] = await Promise.all([
    source.identityResolver.resolve({ query: "Alex Rivera" }),
    source.identityResolver.resolve({ query: "Alex Rivera" })
  ]);
  assert.equal(left.status, "resolved");
  assert.equal(right.status, "resolved");
  assert.equal(posts, 1);
});

test("malformed Zoho payloads fail with sanitized response errors", async () => {
  const source = createZohoAdapter(
    { region: "ca", accessToken: "secret-token", maxRetries: 0 },
    { fetchImpl: async () => Response.json({ fields: "not-an-array", secret: "raw-secret" }) }
  );
  await assert.rejects(
    () => source.identityResolver.resolve({ query: "Alex" }),
    (error) => {
      assert.equal(error.code, "ZOHO_RESPONSE_INVALID");
      assert.doesNotMatch(error.message, /raw-secret|secret-token|not-an-array/i);
      return true;
    }
  );
});
