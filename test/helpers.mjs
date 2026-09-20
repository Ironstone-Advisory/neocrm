import { readFile } from "node:fs/promises";
import { createMockAdapters } from "../adapters/mock/src/index.mjs";
import { createAssistant } from "../apps/assistant/src/assistant.mjs";
import { createMemoryLogger } from "../packages/relationship-intelligence/src/index.mjs";

export async function loadFixture() {
  return JSON.parse(
    await readFile(
      new URL("../experiments/fixtures/acme-relationship.json", import.meta.url),
      "utf8"
    )
  );
}

export async function createTestSystem(options = {}) {
  const fixture = options.fixture ?? (await loadFixture());
  const sources = createMockAdapters(fixture, options);
  const logger = createMemoryLogger();
  const assistant = createAssistant({
    ...sources,
    now: fixture.clock,
    logger
  });
  return { fixture, ...sources, logger, assistant };
}

export const relationshipQuestion =
  "What do I need to know before I speak with Alex Chen?";

