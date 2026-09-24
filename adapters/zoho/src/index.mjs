// IMP-008 - Status: Implemented. Production-shaped, read-only Zoho adapter.
import { setTimeout as delay } from "node:timers/promises";
import { assertContract } from "../../../packages/contracts/src/runtime.mjs";
import { opaqueId } from "../../../packages/relationship-intelligence/src/ids.mjs";

const REGION_HOSTS = Object.freeze({
  us: { api: "https://www.zohoapis.com", oauth: "https://accounts.zoho.com/oauth/v2/token" },
  eu: { api: "https://www.zohoapis.eu", oauth: "https://accounts.zoho.eu/oauth/v2/token" },
  in: { api: "https://www.zohoapis.in", oauth: "https://accounts.zoho.in/oauth/v2/token" },
  au: { api: "https://www.zohoapis.com.au", oauth: "https://accounts.zoho.com.au/oauth/v2/token" },
  ca: { api: "https://www.zohoapis.ca", oauth: "https://accounts.zohocloud.ca/oauth/v2/token" },
  jp: { api: "https://www.zohoapis.jp", oauth: "https://accounts.zoho.jp/oauth/v2/token" },
  sa: { api: "https://www.zohoapis.sa", oauth: "https://accounts.zoho.sa/oauth/v2/token" }
});

const SUPPORTED_MODULES = new Set([
  "Contacts",
  "Accounts",
  "Deals",
  "Leads",
  "Tasks",
  "Calls",
  "Meetings",
  "Notes"
]);
const DEFAULT_MODULES = ["Contacts", "Accounts", "Deals"];
const DEFAULT_FIELDS = Object.freeze({
  Contacts: ["id", "Full_Name", "First_Name", "Last_Name", "Title", "Account_Name", "Modified_Time"],
  Accounts: ["id", "Account_Name", "Modified_Time"],
  Deals: ["id", "Deal_Name", "Stage", "Closing_Date", "Amount", "Modified_Time"],
  Leads: ["id", "Full_Name", "First_Name", "Last_Name", "Designation", "Company", "Modified_Time"],
  Tasks: ["id", "Subject", "Status", "Due_Date", "Modified_Time"],
  Calls: ["id", "Subject", "Call_Start_Time", "Modified_Time"],
  Meetings: ["id", "Event_Title", "Start_DateTime", "Modified_Time"],
  Notes: ["id", "Note_Title", "Note_Content", "Modified_Time"]
});

function validatedHttpsUrl(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new TypeError(`${label} must be an absolute HTTPS URL.`);
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.hash ||
    url.search
  ) {
    throw new TypeError(
      `${label} must be an absolute HTTPS URL without credentials, query parameters, or a fragment.`
    );
  }
  return url.toString().replace(/\/$/, "");
}

function validatedZohoBoundaryUrl(value, expected, label) {
  const actual = validatedHttpsUrl(value, label);
  const canonicalExpected = validatedHttpsUrl(expected, label);
  if (actual !== canonicalExpected) {
    throw new TypeError(`${label} must match the selected Zoho region boundary.`);
  }
  return actual;
}

function boundedInteger(value, fallback, minimum, maximum, label) {
  const number = Number(value ?? fallback);
  if (!Number.isInteger(number) || !Number.isFinite(number)) {
    throw new TypeError(`${label} must be a finite integer.`);
  }
  return Math.max(minimum, Math.min(number, maximum));
}

function optionalSecret(value, label) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") throw new TypeError(`${label} must be a string.`);
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function objectPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw sanitizedError("ZOHO_RESPONSE_INVALID");
  }
  return payload;
}

function arrayField(payload, key) {
  const value = objectPayload(payload)[key];
  if (!Array.isArray(value)) throw sanitizedError("ZOHO_RESPONSE_INVALID");
  return value;
}

function recordArray(payload) {
  const records = arrayField(payload, "data");
  if (
    records.some(
      (record) =>
        !record ||
        typeof record !== "object" ||
        Array.isArray(record) ||
        record.id === undefined ||
        record.id === null ||
        String(record.id).length === 0
    )
  ) {
    throw sanitizedError("ZOHO_RESPONSE_INVALID");
  }
  return records;
}

function hasIdentityNameField(fields) {
  return fields.includes("Full_Name") || fields.includes("First_Name") || fields.includes("Last_Name");
}

function normalizeConfig(input = {}) {
  const region = String(input.region ?? "us").toLowerCase();
  if (!REGION_HOSTS[region]) {
    throw new TypeError("Unsupported Zoho region.");
  }
  const defaults = REGION_HOSTS[region];
  if (input.modules !== undefined && !Array.isArray(input.modules)) {
    throw new TypeError("Zoho modules must be an array from the supported explicit allowlist.");
  }
  const modules = [...new Set(input.modules ?? DEFAULT_MODULES)];
  if (modules.some((module) => !SUPPORTED_MODULES.has(module))) {
    throw new TypeError("Zoho modules must come from the supported explicit allowlist.");
  }
  if (!modules.includes("Contacts")) {
    throw new TypeError("Contacts must be enabled for EXP-001 identity resolution.");
  }
  const fields = Object.fromEntries(
    modules.map((module) => {
      const configured = input.fields?.[module];
      if (configured !== undefined && !Array.isArray(configured)) {
        throw new TypeError(`Zoho ${module} fields must be an array of allowlisted API names.`);
      }
      const selected = [...new Set(configured ?? DEFAULT_FIELDS[module])];
      const allowlist = new Set(DEFAULT_FIELDS[module]);
      if (selected.some((field) => !allowlist.has(field))) {
        throw new TypeError(`Zoho ${module} fields must come from the explicit field allowlist.`);
      }
      if (!selected.includes("id")) selected.unshift("id");
      if (["Contacts", "Leads"].includes(module) && !hasIdentityNameField(selected)) {
        throw new TypeError(`Zoho ${module} fields must include an allowlisted identity name field.`);
      }
      return [module, selected];
    })
  );
  return Object.freeze({
    region,
    apiBaseUrl: validatedZohoBoundaryUrl(
      input.apiBaseUrl ?? defaults.api,
      defaults.api,
      "Zoho API base URL"
    ),
    tokenUrl: validatedZohoBoundaryUrl(
      input.tokenUrl ?? defaults.oauth,
      defaults.oauth,
      "Zoho OAuth token URL"
    ),
    accessToken: optionalSecret(input.accessToken, "Zoho access token"),
    refreshToken: optionalSecret(input.refreshToken, "Zoho refresh token"),
    clientId: optionalSecret(input.clientId, "Zoho client ID"),
    clientSecret: optionalSecret(input.clientSecret, "Zoho client secret"),
    modules,
    fields,
    pageSize: boundedInteger(input.pageSize, 50, 1, 200, "Zoho page size"),
    maxPages: boundedInteger(input.maxPages, 3, 1, 10, "Zoho maximum pages"),
    timeoutMs: boundedInteger(input.timeoutMs, 8000, 100, 30000, "Zoho timeout"),
    maxRetries: boundedInteger(input.maxRetries, 2, 0, 4, "Zoho maximum retries")
  });
}

export function zohoConfigFromEnv(env = process.env) {
  const optional = (value) => {
    const text = String(value ?? "").trim();
    return text || undefined;
  };
  const optionalModules = String(env.NEOCRM_ZOHO_OPTIONAL_MODULES ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return {
    region: optional(env.NEOCRM_ZOHO_REGION),
    apiBaseUrl: optional(env.NEOCRM_ZOHO_API_BASE_URL),
    tokenUrl: optional(env.NEOCRM_ZOHO_TOKEN_URL),
    accessToken: optional(env.NEOCRM_ZOHO_ACCESS_TOKEN),
    refreshToken: optional(env.NEOCRM_ZOHO_REFRESH_TOKEN),
    clientId: optional(env.NEOCRM_ZOHO_CLIENT_ID),
    clientSecret: optional(env.NEOCRM_ZOHO_CLIENT_SECRET),
    modules: [...DEFAULT_MODULES, ...optionalModules]
  };
}

export function preflightZoho(input = {}) {
  const config = normalizeConfig(input);
  const hasAccessToken = Boolean(config.accessToken);
  const canRefresh = Boolean(
    config.refreshToken && config.clientId && config.clientSecret
  );
  return Object.freeze({
    adapterId: "zoho-crm",
    ready: hasAccessToken || canRefresh,
    credentialMode: hasAccessToken ? "access_token" : canRefresh ? "refresh_token" : "missing",
    apiOrigin: new URL(config.apiBaseUrl).origin,
    oauthOrigin: new URL(config.tokenUrl).origin,
    modules: [...config.modules],
    fields: structuredClone(config.fields),
    operations: ["GET"],
    oauthTokenExchange: canRefresh ? "configured" : "not_configured",
    externalWritesEnabled: false
  });
}

class ZohoBoundaryError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ZohoBoundaryError";
    this.code = code;
  }
}

function sanitizedError(code) {
  const messages = {
    ZOHO_NOT_CONFIGURED: "Zoho read access is not configured.",
    ZOHO_TIMEOUT: "Zoho did not respond within the configured timeout.",
    ZOHO_RATE_LIMITED: "Zoho temporarily limited read requests.",
    ZOHO_UNAVAILABLE: "Zoho read access is temporarily unavailable.",
    ZOHO_RESPONSE_INVALID: "Zoho returned an invalid read response.",
    ZOHO_ACCESS_DENIED: "Zoho read access was denied."
  };
  return new ZohoBoundaryError(code, messages[code] ?? "Zoho read boundary failed closed.");
}

function partyRef(record, module = "Contacts") {
  const id = String(record.id);
  const displayName = String(
    record.Full_Name ?? [record.First_Name, record.Last_Name].filter(Boolean).join(" ")
  ).trim();
  const accountName = typeof record.Account_Name === "object"
    ? record.Account_Name?.name
    : record.Account_Name ?? record.Company;
  return {
    partyId: `zoho:${module}:${id}`,
    displayName: displayName || "Unnamed contact",
    partyType: "person",
    ...(accountName ? { disambiguationLabel: String(accountName) } : {})
  };
}

function iso(value, fallback) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : fallback;
}

function claim({ domain, predicate, value, label, category, module, field, modifiedAt, authority }) {
  return {
    domain,
    predicate,
    value,
    label,
    authority,
    contentType: "business_evidence",
    epistemicCategory: category,
    completeness: "known_complete",
    sourceModule: module,
    fieldApiName: field,
    modifiedAt,
    transformation: `zoho.${module}.${field}.v1`
  };
}

export function createZohoAdapter(input = {}, options = {}) {
  const config = normalizeConfig(input);
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  if (typeof fetchImpl !== "function") throw new TypeError("A fetch implementation is required.");
  const sleep = options.sleep ?? ((milliseconds) => delay(milliseconds));
  const clock = options.now ?? (() => new Date().toISOString());
  const metadataCache = new Map();
  let accessToken = config.accessToken;
  let refreshInFlight = null;

  const readDomains = ["party", "relationship", "commercial"];
  if (config.modules.some((module) => ["Tasks", "Calls", "Meetings"].includes(module))) {
    readDomains.push("activity");
  }
  if (config.modules.includes("Meetings")) readDomains.push("time");
  if (config.modules.includes("Notes")) readDomains.push("knowledge");
  const domainAuthorities = [
    { domain: "party", authority: "authoritative" },
    { domain: "relationship", authority: "corroborating" },
    { domain: "commercial", authority: "corroborating" }
  ];
  if (readDomains.includes("activity")) domainAuthorities.push({ domain: "activity", authority: "corroborating" });
  if (readDomains.includes("time")) domainAuthorities.push({ domain: "time", authority: "corroborating" });
  if (readDomains.includes("knowledge")) domainAuthorities.push({ domain: "knowledge", authority: "contextual" });
  const capability = assertContract("AdapterCapability", {
    contractType: "adapter_capability",
    adapterId: "zoho-crm",
    sourceId: "zoho",
    readDomains,
    supportedFilters: ["partyId", "effectiveAfter", "effectiveBefore"],
    domainAuthorities,
    freshnessPolicy: { maximumAgeSeconds: 900 },
    authorization: {
      status: preflightZoho(config).ready ? "granted" : "unknown",
      scopes: ["ZohoCRM.modules.READ", "ZohoCRM.settings.fields.READ"]
    },
    writeActions: [],
    externalWritesEnabled: false
  });

  async function exchangeRefreshToken() {
    const body = new URLSearchParams({
      refresh_token: config.refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: "refresh_token"
    });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
    let response;
    try {
      response = await fetchImpl(config.tokenUrl, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body,
        signal: controller.signal,
        redirect: "error"
      });
    } catch (error) {
      clearTimeout(timeout);
      if (error?.name === "AbortError") throw sanitizedError("ZOHO_TIMEOUT");
      throw sanitizedError("ZOHO_UNAVAILABLE");
    }
    if (!response.ok) {
      clearTimeout(timeout);
      throw sanitizedError("ZOHO_ACCESS_DENIED");
    }
    let rawPayload;
    try {
      rawPayload = await response.json();
    } catch (error) {
      if (error?.name === "AbortError") throw sanitizedError("ZOHO_TIMEOUT");
      throw sanitizedError("ZOHO_RESPONSE_INVALID");
    } finally {
      clearTimeout(timeout);
    }
    const payload = objectPayload(rawPayload);
    if (typeof payload.access_token !== "string" || payload.access_token.length === 0) {
      throw sanitizedError("ZOHO_RESPONSE_INVALID");
    }
    accessToken = payload.access_token;
    return accessToken;
  }

  async function token() {
    if (accessToken) return accessToken;
    if (!(config.refreshToken && config.clientId && config.clientSecret)) {
      throw sanitizedError("ZOHO_NOT_CONFIGURED");
    }
    if (!refreshInFlight) {
      refreshInFlight = exchangeRefreshToken().finally(() => {
        refreshInFlight = null;
      });
    }
    return refreshInFlight;
  }

  async function get(path, search = {}) {
    const url = new URL(path, `${config.apiBaseUrl}/`);
    if (url.origin !== new URL(config.apiBaseUrl).origin) {
      throw sanitizedError("ZOHO_ACCESS_DENIED");
    }
    for (const [key, value] of Object.entries(search)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }

    for (let attempt = 0; attempt <= config.maxRetries; attempt += 1) {
      const bearer = await token();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
      let response;
      try {
        response = await fetchImpl(url, {
          method: "GET",
          headers: { Authorization: `Zoho-oauthtoken ${bearer}` },
          signal: controller.signal,
          redirect: "error"
        });
      } catch (error) {
        clearTimeout(timeout);
        if (error?.name === "AbortError") throw sanitizedError("ZOHO_TIMEOUT");
        if (attempt === config.maxRetries) throw sanitizedError("ZOHO_UNAVAILABLE");
        await sleep(25 * (attempt + 1));
        continue;
      }
      if (response.status === 401 || response.status === 403) {
        clearTimeout(timeout);
        throw sanitizedError("ZOHO_ACCESS_DENIED");
      }
      if ([429, 502, 503, 504].includes(response.status)) {
        clearTimeout(timeout);
        if (attempt === config.maxRetries) {
          throw sanitizedError(response.status === 429 ? "ZOHO_RATE_LIMITED" : "ZOHO_UNAVAILABLE");
        }
        const retryAfterSeconds = Number(response.headers.get("retry-after") ?? 0);
        const retryAfter = Number.isFinite(retryAfterSeconds)
          ? Math.max(0, Math.min(retryAfterSeconds * 1000, 1000))
          : 0;
        await sleep(retryAfter || 25 * (attempt + 1));
        continue;
      }
      if (!response.ok) {
        clearTimeout(timeout);
        throw sanitizedError("ZOHO_UNAVAILABLE");
      }
      let payload;
      try {
        payload = await response.json();
      } catch (error) {
        if (error?.name === "AbortError") throw sanitizedError("ZOHO_TIMEOUT");
        throw sanitizedError("ZOHO_RESPONSE_INVALID");
      } finally {
        clearTimeout(timeout);
      }
      return objectPayload(payload);
    }
    throw sanitizedError("ZOHO_UNAVAILABLE");
  }

  async function fieldsFor(module) {
    if (metadataCache.has(module)) return metadataCache.get(module);
    const payload = await get("crm/v7/settings/fields", { module });
    const available = new Set(
      arrayField(payload, "fields")
        .filter((field) => field && typeof field === "object" && !Array.isArray(field))
        .map((field) => String(field.api_name ?? ""))
        .filter(Boolean)
    );
    const selected = config.fields[module].filter(
      (field) => field === "id" || available.has(field)
    );
    if (!selected.includes("id")) selected.unshift("id");
    if (["Contacts", "Leads"].includes(module) && !hasIdentityNameField(selected)) {
      throw sanitizedError("ZOHO_RESPONSE_INVALID");
    }
    metadataCache.set(module, selected);
    return selected;
  }

  async function pages(path, module) {
    const fields = await fieldsFor(module);
    const records = [];
    for (let page = 1; page <= config.maxPages; page += 1) {
      const payload = await get(path, {
        fields: fields.join(","),
        page,
        per_page: config.pageSize
      });
      records.push(...recordArray(payload));
      if (!payload.info?.more_records) break;
    }
    return records.sort((left, right) => String(left.id).localeCompare(String(right.id)));
  }

  const identityResolver = Object.freeze({
    async resolve({ query, selectedPartyId } = {}) {
      let records = [];
      let resolvedModule = "Contacts";
      if (selectedPartyId) {
        const match = /^zoho:(Contacts|Leads):([^:]+)$/.exec(selectedPartyId);
        if (match && config.modules.includes(match[1])) {
          resolvedModule = match[1];
          const fields = await fieldsFor(resolvedModule);
          const payload = await get(`crm/v7/${resolvedModule}/${encodeURIComponent(match[2])}`, {
            fields: fields.filter((field) => ["id", "Full_Name", "First_Name", "Last_Name", "Account_Name", "Company"].includes(field)).join(",")
          });
          records = recordArray(payload);
        }
      } else {
        const searchWord = String(query ?? "").trim().slice(0, 100);
        if (!searchWord) {
          throw new ZohoBoundaryError(
            "INVALID_IDENTITY_QUERY",
            "Zoho identity search requires a non-empty query."
          );
        }
        const fields = await fieldsFor("Contacts");
        const payload = await get("crm/v7/Contacts/search", {
          word: searchWord,
          fields: fields.filter((field) => ["id", "Full_Name", "First_Name", "Last_Name", "Account_Name"].includes(field)).join(","),
          page: 1,
          per_page: Math.min(config.pageSize, 20)
        });
        records = recordArray(payload);
        if (records.length === 0 && config.modules.includes("Leads")) {
          resolvedModule = "Leads";
          const fields = await fieldsFor("Leads");
          const payload = await get("crm/v7/Leads/search", {
            word: searchWord,
            fields: fields.filter((field) => ["id", "Full_Name", "First_Name", "Last_Name", "Company"].includes(field)).join(","),
            page: 1,
            per_page: Math.min(config.pageSize, 20)
          });
          records = recordArray(payload);
        }
      }
      const candidates = records
        .map((record) => partyRef(record, resolvedModule))
        .sort((left, right) => left.partyId.localeCompare(right.partyId))
        .slice(0, 20);
      const result = {
        contractType: "identity_resolution_result",
        status: candidates.length === 1 ? "resolved" : candidates.length > 1 ? "ambiguous" : "not_found",
        candidates
      };
      if (candidates.length === 1) result.selectedPartyId = candidates[0].partyId;
      return assertContract("IdentityResolutionResult", result);
    }
  });

  const adapter = Object.freeze({
    capability,
    async read(request) {
      const validated = assertContract("AdapterRequest", request);
      if (validated.adapterId !== capability.adapterId) {
        throw new ZohoBoundaryError("INVALID_ADAPTER_REQUEST", "Zoho request was routed incorrectly.");
      }
      const match = /^zoho:(Contacts|Leads):([^:]+)$/.exec(validated.filters.partyId);
      if (!match) {
        throw new ZohoBoundaryError("INVALID_PARTY_REFERENCE", "Zoho Party reference is invalid.");
      }
      const retrievedAt = new Date(clock()).toISOString();
      const base = {
        contractType: "adapter_result",
        adapterId: capability.adapterId,
        sourceId: capability.sourceId,
        retrievedAt,
        records: [],
        roles: [],
        relationships: []
      };
      try {
        const module = match[1];
        const nativeId = match[2];
        const contactFields = await fieldsFor(module);
        const contactPayload = await get(`crm/v7/${module}/${encodeURIComponent(nativeId)}`, {
          fields: contactFields.join(",")
        });
        const contact = recordArray(contactPayload)[0];
        if (!contact) return assertContract("AdapterResult", { ...base, status: "ok" });
        const modifiedAt = iso(contact.Modified_Time, retrievedAt);
        const contactClaims = [];
        const title = contact.Title ?? contact.Designation;
        if (validated.domains.includes("party") && title) {
          contactClaims.push(claim({
            domain: "party",
            predicate: "person.title",
            value: title,
            label: `Zoho records the ${module === "Leads" ? "lead" : "contact"} title as ${title}.`,
            category: "fact",
            module,
            field: module === "Leads" ? "Designation" : "Title",
            modifiedAt,
            authority: "authoritative"
          }));
        }
        const account = typeof contact.Account_Name === "object" ? contact.Account_Name : null;
        const companyName = account?.name ?? contact.Company;
        if (validated.domains.includes("relationship") && companyName) {
          contactClaims.push(claim({
            domain: "relationship",
            predicate: "employment.company",
            value: companyName,
            label: `Zoho links the ${module === "Leads" ? "lead" : "contact"} to ${companyName}.`,
            category: "observation",
            module,
            field: module === "Leads" ? "Company" : "Account_Name",
            modifiedAt,
            authority: "corroborating"
          }));
        }
        const records = [{
          nativeId: `${module}:${contact.id}`,
          partyId: validated.filters.partyId,
          effectiveAt: modifiedAt,
          summary: "Allowlisted Zoho contact fields.",
          untrustedContent: true,
          claims: contactClaims
        }];
        const roles = [];
        const relationships = [];
        if (module === "Contacts" && account?.id && validated.domains.includes("relationship")) {
          if (config.modules.includes("Accounts")) {
            const accountFields = await fieldsFor("Accounts");
            const accountPayload = await get(`crm/v7/Accounts/${encodeURIComponent(account.id)}`, {
              fields: accountFields.join(",")
            });
            const accountRecord = recordArray(accountPayload)[0];
            if (accountRecord) {
              const accountModified = iso(accountRecord.Modified_Time, retrievedAt);
              records.push({
                nativeId: `Accounts:${accountRecord.id}`,
                partyId: validated.filters.partyId,
                effectiveAt: accountModified,
                summary: "Allowlisted Zoho company reference fields.",
                untrustedContent: true,
                claims: [claim({
                  domain: "relationship",
                  predicate: "relationship.company",
                  value: {
                    partyId: `zoho:Accounts:${accountRecord.id}`,
                    partyType: "company",
                    displayName: accountRecord.Account_Name
                  },
                  label: `Zoho identifies the related Company as ${accountRecord.Account_Name}.`,
                  category: "observation",
                  module: "Accounts",
                  field: "Account_Name",
                  modifiedAt: accountModified,
                  authority: "corroborating"
                })]
              });
            }
          }
          const provenance = [{
            sourceId: "zoho",
            adapterId: "zoho-crm",
            nativeId: `Contacts:${contact.id}`,
            retrievedAt,
            effectiveAt: modifiedAt,
            authority: "corroborating",
            completeness: "known_complete",
            sourceModule: "Contacts",
            fieldApiName: "Account_Name",
            modifiedAt,
            transformation: "zoho.contact.account-role.v1"
          }];
          relationships.push({
            relationshipId: opaqueId("relationship", validated.filters.partyId, account.id),
            relationshipType: "associated_with_company",
            participantPartyIds: [validated.filters.partyId, `zoho:Accounts:${account.id}`],
            direction: "directed",
            validFrom: modifiedAt,
            validTo: null,
            confidence: 1,
            epistemicCategory: "observation",
            provenance
          });
        }
        if (module === "Leads") {
          roles.push({
            roleId: opaqueId("role", validated.filters.partyId, "prospect", contact.id),
            partyId: validated.filters.partyId,
            roleType: "prospect",
            validFrom: modifiedAt,
            validTo: null,
            confidence: 1,
            epistemicCategory: "observation",
            provenance: [{ sourceId: "zoho", adapterId: "zoho-crm", nativeId: `Leads:${contact.id}`, retrievedAt, effectiveAt: modifiedAt, authority: "corroborating", completeness: "known_complete", sourceModule: "Leads", fieldApiName: "id", modifiedAt, transformation: "zoho.lead.prospect-role.v1" }]
          });
        }
        if (module === "Contacts" && config.modules.includes("Deals") && validated.domains.includes("commercial")) {
          const deals = await pages(
            `crm/v7/Contacts/${encodeURIComponent(nativeId)}/Deals`,
            "Deals"
          );
          for (const deal of deals) {
            const dealModified = iso(deal.Modified_Time, retrievedAt);
            const claims = [];
            if (deal.Deal_Name) claims.push(claim({ domain: "commercial", predicate: "commercial.matter", value: deal.Deal_Name, label: `Zoho records the opportunity ${deal.Deal_Name}.`, category: "observation", module: "Deals", field: "Deal_Name", modifiedAt: dealModified, authority: "corroborating" }));
            if (deal.Deal_Name) claims.push(claim({ domain: "commercial", predicate: "commercial.opportunity", value: { opportunityId: `zoho:Deals:${deal.id}`, name: deal.Deal_Name }, label: `Zoho maps ${deal.Deal_Name} as an Opportunity, not a committed Deal or Contract.`, category: "observation", module: "Deals", field: "Deal_Name", modifiedAt: dealModified, authority: "corroborating" }));
            if (deal.Stage) claims.push(claim({ domain: "commercial", predicate: "commercial.stage", value: deal.Stage, label: `Zoho records the opportunity stage as ${deal.Stage}.`, category: "observation", module: "Deals", field: "Stage", modifiedAt: dealModified, authority: "corroborating" }));
            if (deal.Closing_Date) claims.push(claim({ domain: "commercial", predicate: "commercial.decision_date", value: deal.Closing_Date, label: `Zoho records the opportunity closing date as ${deal.Closing_Date}.`, category: "observation", module: "Deals", field: "Closing_Date", modifiedAt: dealModified, authority: "corroborating" }));
            records.push({ nativeId: `Deals:${deal.id}`, partyId: validated.filters.partyId, effectiveAt: dealModified, summary: "Allowlisted Zoho opportunity fields.", untrustedContent: true, claims });
          }
          if (deals.length > 0) {
            const deal = deals[0];
            const dealModified = iso(deal.Modified_Time, retrievedAt);
            roles.push({
              roleId: opaqueId("role", validated.filters.partyId, "prospect", deal.id),
              partyId: validated.filters.partyId,
              roleType: "prospect",
              validFrom: dealModified,
              validTo: null,
              confidence: 1,
              epistemicCategory: "observation",
              provenance: [{ sourceId: "zoho", adapterId: "zoho-crm", nativeId: `Deals:${deal.id}`, retrievedAt, effectiveAt: dealModified, authority: "corroborating", completeness: "known_complete", sourceModule: "Deals", fieldApiName: "id", modifiedAt: dealModified, transformation: "zoho.deal.prospect-role.v1" }]
            });
          }
        }
        if (module === "Contacts") {
          const relatedDefinitions = [
            { module: "Tasks", domain: "activity", predicate: "activity.task", textField: "Subject", timeField: "Due_Date" },
            { module: "Calls", domain: "activity", predicate: "activity.call", textField: "Subject", timeField: "Call_Start_Time" },
            { module: "Meetings", domain: "activity", predicate: "activity.meeting", textField: "Event_Title", timeField: "Start_DateTime" },
            { module: "Notes", domain: "knowledge", predicate: "knowledge.zoho_note", textField: "Note_Content", timeField: "Modified_Time" }
          ];
          for (const definition of relatedDefinitions) {
            if (!config.modules.includes(definition.module) || !validated.domains.includes(definition.domain)) continue;
            const related = await pages(`crm/v7/Contacts/${encodeURIComponent(nativeId)}/${definition.module}`, definition.module);
            for (const item of related) {
              const itemTime = iso(item[definition.timeField] ?? item.Modified_Time, retrievedAt);
              const value = item[definition.textField];
              if (!value) continue;
              const claims = [claim({
                domain: definition.domain,
                predicate: definition.predicate,
                value: definition.module === "Notes" ? { untrustedText: value } : value,
                label: `Zoho ${definition.module} records: “${value}”`,
                category: "observation",
                module: definition.module,
                field: definition.textField,
                modifiedAt: iso(item.Modified_Time, retrievedAt),
                authority: definition.module === "Notes" ? "contextual" : "corroborating"
              })];
              if (definition.module === "Meetings" && validated.domains.includes("time") && item.Start_DateTime) {
                claims.push(claim({ domain: "time", predicate: "meeting.next", value: item.Start_DateTime, label: `Zoho records a meeting at ${item.Start_DateTime}.`, category: "fact", module: "Meetings", field: "Start_DateTime", modifiedAt: iso(item.Modified_Time, retrievedAt), authority: "corroborating" }));
              }
              records.push({ nativeId: `${definition.module}:${item.id}`, partyId: validated.filters.partyId, effectiveAt: itemTime, summary: `Allowlisted Zoho ${definition.module} fields.`, untrustedContent: true, claims });
            }
          }
        }
        return assertContract("AdapterResult", {
          ...base,
          status: "ok",
          records: records.filter((record) => record.claims.length > 0),
          roles,
          relationships
        });
      } catch (error) {
        const denied = error?.code === "ZOHO_ACCESS_DENIED";
        return assertContract("AdapterResult", {
          ...base,
          status: denied ? "denied" : "failed",
          error: {
            code: denied ? "SOURCE_ACCESS_DENIED" : "SOURCE_UNAVAILABLE",
            message: denied ? "Access denied by source policy." : "Source unavailable."
          }
        });
      }
    }
  });

  return Object.freeze({
    identityResolver,
    adapter,
    preflight: () => preflightZoho(config)
  });
}
