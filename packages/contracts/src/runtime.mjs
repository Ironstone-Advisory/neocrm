import { readFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const schema = JSON.parse(
  await readFile(
    new URL("../../../spec/domain/schemas/neocrm.schema.json", import.meta.url),
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
ajv.addSchema(schema);

const entryPoints = [
  "RelationshipBriefRequest",
  "IdentityResolutionResult",
  "AdapterCapability",
  "AdapterRequest",
  "AdapterResult",
  "Fixture",
  "ResponseEnvelope"
];
const validators = Object.fromEntries(
  entryPoints.map((name) => [
    name,
    ajv.getSchema(`${schema.$id}#/$defs/${name}`) ??
      ajv.compile({ $ref: `${schema.$id}#/$defs/${name}` })
  ])
);
validators.Root = ajv.getSchema(schema.$id);

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

export { schema };
