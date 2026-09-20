import { readFile } from "node:fs/promises";
import { createMockAdapters } from "../../../adapters/mock/src/index.mjs";
import { createAssistant } from "./assistant.mjs";

const fixture = JSON.parse(
  await readFile(
    new URL("../../../experiments/fixtures/acme-relationship.json", import.meta.url),
    "utf8"
  )
);
const question =
  process.argv
    .slice(2)
    .filter((argument) => argument !== "--")
    .join(" ") || "What do I need to know before I speak with Alex Chen?";
const sources = createMockAdapters(fixture);
const assistant = createAssistant({
  ...sources,
  now: fixture.clock,
  logger: { log() {} }
});
const response = await assistant.respond(question);
console.log(response.message);

