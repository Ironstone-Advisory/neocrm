import { readFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const cap001Schema = JSON.parse(
  await readFile(
    new URL("../../../spec/contracts/capabilities/cap-001.schema.json", import.meta.url),
    "utf8"
  )
);
const agentRuntimeSchema = JSON.parse(
  await readFile(
    new URL("../../../spec/contracts/agent-runtime.schema.json", import.meta.url),
    "utf8"
  )
);
const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  // Conditional branches require properties declared by their parent schema.
  strictRequired: false,
  allowUnionTypes: true,
  validateFormats: true
});
addFormats(ajv);
ajv.addSchema(cap001Schema);
ajv.addSchema(agentRuntimeSchema);

const entryPoints = new Map([
  ...[
    "RelationshipBriefRequest",
    "IdentityResolutionResult",
    "AdapterCapability",
    "AdapterRequest",
    "AdapterResult",
    "Fixture",
    "ResponseEnvelope",
    "Assertion",
    "Recommendation"
  ].map((name) => [name, cap001Schema]),
  ...[
    "AgentDefinition",
    "AuthorityGrant",
    "Trigger",
    "Goal",
    "Plan",
    "AgentRun",
    "Handoff",
    "PolicyDecision",
    "ContextSnapshot",
    "Outcome",
    "LearningSignal",
    "AuditEvent"
  ].map((name) => [name, agentRuntimeSchema])
]);
const validators = Object.fromEntries(
  [...entryPoints].map(([name, owner]) => [
    name,
    ajv.getSchema(`${owner.$id}#/$defs/${name}`) ??
      ajv.compile({ $ref: `${owner.$id}#/$defs/${name}` })
  ])
);
validators.Root = ajv.getSchema(cap001Schema.$id);
validators.AgentRuntimeRoot = ajv.getSchema(agentRuntimeSchema.$id);

export class ContractValidationError extends Error {
  constructor(contractName, errors) {
    super(
      `${contractName} contract validation failed: ${ajv.errorsText(errors, {
        separator: "; "
      })}`
    );
    this.name = "ContractValidationError";
    this.code = "CONTRACT_VALIDATION_FAILED";
    this.contractName = contractName;
    this.errors = structuredClone(errors ?? []);
  }
}

export function validateContract(contractName, value) {
  const validate = validators[contractName];
  if (!validate) throw new Error(`Unknown contract entry point: ${contractName}`);
  const valid = validate(value);
  return { valid, errors: valid ? [] : structuredClone(validate.errors ?? []) };
}

export function assertContract(contractName, value) {
  const result = validateContract(contractName, value);
  if (!result.valid) throw new ContractValidationError(contractName, result.errors);
  return value;
}

export { cap001Schema as schema, agentRuntimeSchema };
