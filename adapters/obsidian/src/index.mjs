// IMP-009 - Status: Implemented. Vault-confined, read-only Obsidian adapter.
import { lstat, readFile, readdir, realpath } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { assertContract } from "../../../packages/contracts/src/runtime.mjs";

const DEFAULT_EXCLUDED = new Set([
  ".obsidian",
  ".git",
  "attachments",
  "plugins",
  "plugin-data",
  "templates",
  "daily",
  "daily-notes"
]);

function cleanRelativePath(value) {
  const raw = String(value ?? "");
  const text = raw.replaceAll("\\", "/").replace(/^\.\//, "");
  const segments = text.split("/");
  if (
    !text ||
    text === "." ||
    text.includes("\0") ||
    isAbsolute(raw) ||
    isAbsolute(text) ||
    /^[a-zA-Z]:/.test(text) ||
    text.startsWith("//") ||
    segments.some((segment) => !segment || segment === "." || segment === "..")
  ) {
    throw new TypeError("Approved Obsidian paths must be safe vault-relative paths.");
  }
  return text.replace(/\/$/, "");
}

function boundedInteger(value, fallback, minimum, maximum, label) {
  const number = Number(value ?? fallback);
  if (!Number.isInteger(number) || !Number.isFinite(number)) {
    throw new TypeError(`${label} must be a finite integer.`);
  }
  return Math.max(minimum, Math.min(number, maximum));
}

function normalizeConfig(input = {}) {
  if (!input.vaultRoot) throw new TypeError("An Obsidian vault root is required.");
  if (
    input.approvedSubdirectories !== undefined &&
    !Array.isArray(input.approvedSubdirectories)
  ) {
    throw new TypeError("Approved Obsidian subdirectories must be an array.");
  }
  if (input.approvedTags !== undefined && !Array.isArray(input.approvedTags)) {
    throw new TypeError("Approved Obsidian tags must be an array.");
  }
  const additionalExclusions = Array.from(input.excludedDirectoryNames ?? []);
  const excludedDirectoryNames = new Set([
    ...DEFAULT_EXCLUDED,
    ...additionalExclusions.map((value) => String(value).toLowerCase())
  ]);
  const approvedSubdirectories = [
    ...new Set((input.approvedSubdirectories ?? ["relationships"]).map(cleanRelativePath))
  ];
  if (approvedSubdirectories.length === 0) {
    throw new TypeError("At least one approved Obsidian subdirectory is required.");
  }
  if (
    approvedSubdirectories.some((directory) =>
      directory
        .split("/")
        .some((segment) => excludedDirectoryNames.has(segment.toLowerCase()))
    )
  ) {
    throw new TypeError("Approved Obsidian paths cannot include an excluded directory.");
  }
  const approvedTags = [
    ...new Set((input.approvedTags ?? []).map((tag) => String(tag).replace(/^#/, "").trim()).filter(Boolean))
  ];
  return Object.freeze({
    vaultRoot: resolve(String(input.vaultRoot)),
    approvedSubdirectories,
    approvedTags,
    excludedDirectoryNames,
    maxFiles: boundedInteger(input.maxFiles, 500, 1, 5000, "Obsidian maximum files"),
    maxNoteBytes: boundedInteger(
      input.maxNoteBytes,
      256000,
      1024,
      1000000,
      "Obsidian maximum note bytes"
    )
  });
}

export function obsidianConfigFromEnv(env = process.env) {
  return {
    vaultRoot: env.NEOCRM_OBSIDIAN_VAULT_ROOT,
    approvedSubdirectories: String(env.NEOCRM_OBSIDIAN_APPROVED_DIRS ?? "relationships")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    approvedTags: String(env.NEOCRM_OBSIDIAN_APPROVED_TAGS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  };
}

function inside(root, target) {
  const difference = relative(root, target);
  return difference === "" || (!difference.startsWith(`..${sep}`) && difference !== ".." && !isAbsolute(difference));
}

function stripQuotes(value) {
  const text = String(value).trim();
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    return text.slice(1, -1);
  }
  return text;
}

function scalar(value) {
  const text = stripQuotes(value);
  if (/^-?[0-9]+$/.test(text)) return Number(text);
  if (text === "true") return true;
  if (text === "false") return false;
  if (text === "null") return null;
  return text;
}

export function parseFrontmatter(markdown) {
  const text = String(markdown).replace(/^\uFEFF/, "");
  if (!text.startsWith("---\n") && !text.startsWith("---\r\n")) {
    return { attributes: {}, body: text };
  }
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error("Invalid frontmatter boundary.");
  const attributes = Object.create(null);
  let currentArray = null;
  for (const rawLine of match[1].split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) continue;
    const item = rawLine.match(/^\s+-\s+(.+)$/);
    if (item && currentArray) {
      attributes[currentArray].push(String(scalar(item[1])));
      continue;
    }
    const entry = rawLine.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!entry) throw new Error("Unsupported frontmatter syntax.");
    const [, key, rawValue] = entry;
    if (["__proto__", "constructor", "prototype"].includes(key)) {
      throw new Error("Unsafe frontmatter key.");
    }
    if (/[*&!>{}|]/.test(rawValue)) throw new Error("Unsafe or unsupported frontmatter feature.");
    if (rawValue === "") {
      attributes[key] = [];
      currentArray = key;
    } else if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      const insideValue = rawValue.slice(1, -1).trim();
      attributes[key] = insideValue
        ? insideValue.split(",").map((value) => String(scalar(value)))
        : [];
      currentArray = null;
    } else {
      attributes[key] = scalar(rawValue);
      currentArray = null;
    }
  }
  return { attributes, body: text.slice(match[0].length).trim() };
}

function tagsOf(attributes) {
  const tags = attributes.tags ?? attributes.neocrm_tags ?? [];
  return (Array.isArray(tags) ? tags : [tags])
    .map((tag) => String(tag).replace(/^#/, "").trim())
    .filter(Boolean);
}

function partyRefs(attributes) {
  const values = attributes.neocrm_parties ?? [];
  return (Array.isArray(values) ? values : [values]).map(String);
}

function isDailyNote(relativePath) {
  const name = relativePath.split("/").at(-1).replace(/\.md$/i, "");
  return /^\d{4}-\d{2}-\d{2}$/.test(name);
}

async function canonicalRoot(config) {
  const root = await realpath(config.vaultRoot);
  const info = await lstat(root);
  if (!info.isDirectory()) throw new Error("Configured vault root is not a directory.");
  return root;
}

async function collectMarkdown(config, root) {
  const files = [];
  const visitedDirectories = new Set();
  async function walk(candidate) {
    const canonical = await realpath(candidate);
    if (!inside(root, canonical)) {
      const error = new Error("Obsidian path escaped the configured vault boundary.");
      error.code = "VAULT_BOUNDARY_VIOLATION";
      throw error;
    }
    const directoryKey = process.platform === "win32"
      ? canonical.toLocaleLowerCase("en-US")
      : canonical;
    if (visitedDirectories.has(directoryKey)) return;
    visitedDirectories.add(directoryKey);
    const entries = await readdir(canonical, { withFileTypes: true });
    entries.sort((left, right) =>
      left.name < right.name ? -1 : left.name > right.name ? 1 : 0
    );
    for (const entry of entries) {
      const lower = entry.name.toLowerCase();
      if (config.excludedDirectoryNames.has(lower)) continue;
      const joined = resolve(canonical, entry.name);
      const resolved = await realpath(joined);
      if (!inside(root, resolved)) {
        const error = new Error("Obsidian symlink escaped the configured vault boundary.");
        error.code = "VAULT_BOUNDARY_VIOLATION";
        throw error;
      }
      const info = await lstat(resolved);
      if (info.isDirectory()) {
        await walk(resolved);
      } else if (info.isFile() && lower.endsWith(".md")) {
        const vaultRelative = relative(root, resolved).replaceAll("\\", "/");
        if (!isDailyNote(vaultRelative)) files.push({ absolute: resolved, relative: vaultRelative, size: info.size, modifiedAt: info.mtime.toISOString() });
        if (files.length > config.maxFiles) throw new Error("Obsidian file cap exceeded.");
      }
    }
  }

  for (const directory of config.approvedSubdirectories) {
    const candidate = resolve(root, directory);
    if (!inside(root, candidate)) throw new Error("Approved directory escaped vault root.");
    try {
      await walk(candidate);
    } catch (error) {
      if (error?.code === "ENOENT") continue;
      throw error;
    }
  }
  return files.sort((left, right) =>
    left.relative < right.relative ? -1 : left.relative > right.relative ? 1 : 0
  );
}

export async function preflightObsidian(input = {}) {
  const config = normalizeConfig(input);
  let rootAccessible = false;
  let approvedDirectoriesAccessible = false;
  try {
    const root = await canonicalRoot(config);
    rootAccessible = true;
    approvedDirectoriesAccessible = (
      await Promise.all(
        config.approvedSubdirectories.map(async (directory) => {
          const canonical = await realpath(resolve(root, directory));
          if (!inside(root, canonical)) return false;
          const info = await lstat(canonical);
          return info.isDirectory();
        })
      )
    ).every(Boolean);
  } catch {
    approvedDirectoriesAccessible = false;
  }
  return Object.freeze({
    adapterId: "obsidian-vault",
    ready: rootAccessible && approvedDirectoriesAccessible,
    vaultRootConfigured: true,
    rootAccessible,
    approvedDirectoriesAccessible,
    approvedSubdirectories: [...config.approvedSubdirectories],
    approvedTags: [...config.approvedTags],
    fileTypes: [".md"],
    explicitPartyReferencesRequired: true,
    externalWritesEnabled: false
  });
}

export function createObsidianAdapter(input = {}, options = {}) {
  const config = normalizeConfig(input);
  const clock = options.now ?? (() => new Date().toISOString());
  const capability = assertContract("AdapterCapability", {
    contractType: "adapter_capability",
    adapterId: "obsidian-vault",
    sourceId: "obsidian",
    readDomains: ["knowledge"],
    supportedFilters: ["partyId", "effectiveAfter", "effectiveBefore"],
    domainAuthorities: [{ domain: "knowledge", authority: "contextual" }],
    freshnessPolicy: { maximumAgeSeconds: 86400 },
    authorization: { status: "granted", scopes: ["vault.read.approved"] },
    writeActions: [],
    externalWritesEnabled: false
  });

  return Object.freeze({
    capability,
    preflight: () => preflightObsidian(config),
    async read(request) {
      const validated = assertContract("AdapterRequest", request);
      if (validated.adapterId !== capability.adapterId || !validated.domains.includes("knowledge")) {
        throw new Error("Obsidian request exceeds the declared read boundary.");
      }
      const retrievedAt = new Date(clock()).toISOString();
      const base = { contractType: "adapter_result", adapterId: capability.adapterId, sourceId: capability.sourceId, retrievedAt, records: [], roles: [], relationships: [] };
      try {
        const root = await canonicalRoot(config);
        const files = await collectMarkdown(config, root);
        const records = [];
        for (const file of files) {
          if (file.size > config.maxNoteBytes) continue;
          const markdown = await readFile(file.absolute, "utf8");
          let parsed;
          try {
            parsed = parseFrontmatter(markdown);
          } catch {
            continue;
          }
          const { attributes, body } = parsed;
          if (attributes.neocrm_schema !== 1 || attributes.neocrm_kind !== "relationship-note") continue;
          if (!partyRefs(attributes).includes(validated.filters.partyId)) continue;
          const tags = tagsOf(attributes);
          if (config.approvedTags.length > 0 && !tags.some((tag) => config.approvedTags.includes(tag))) continue;
          const category = String(attributes.neocrm_epistemic ?? "");
          if (!["observation", "interpretation", "hypothesis"].includes(category)) continue;
          if (!body) continue;
          const occurredAt = Number.isFinite(Date.parse(attributes.occurred_at))
            ? new Date(attributes.occurred_at).toISOString()
            : file.modifiedAt;
          const after = validated.filters.effectiveAfter ? Date.parse(validated.filters.effectiveAfter) : Number.NEGATIVE_INFINITY;
          const before = validated.filters.effectiveBefore ? Date.parse(validated.filters.effectiveBefore) : Number.POSITIVE_INFINITY;
          if (Date.parse(occurredAt) < after || Date.parse(occurredAt) > before) continue;
          records.push({
            nativeId: file.relative,
            partyId: validated.filters.partyId,
            effectiveAt: occurredAt,
            summary: `Approved Obsidian relationship note (${category}).`,
            untrustedContent: true,
            claims: [{
              domain: "knowledge",
              predicate: `knowledge.note_${category}`,
              value: { untrustedText: body },
              label: `Obsidian note records this ${category}: “${body}”`,
              authority: "contextual",
              contentType: "business_evidence",
              epistemicCategory: category,
              completeness: "known_partial",
              sourceModule: "vault",
              fieldApiName: "body",
              modifiedAt: file.modifiedAt,
              transformation: "obsidian.explicit-relationship-note.v1"
            }]
          });
        }
        return assertContract("AdapterResult", { ...base, status: "ok", records });
      } catch {
        return assertContract("AdapterResult", {
          ...base,
          status: "failed",
          error: { code: "SOURCE_UNAVAILABLE", message: "Source boundary failed closed." }
        });
      }
    }
  });
}
