import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const schema = JSON.parse(
  await readFile(resolve(import.meta.dirname, "../spec/contracts/governed-action.schema.json"), "utf8")
);
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

const writeGrant = {
  kind: "WriteGrant",
  grantId: "grant-1",
  principalId: "user-1",
  grantorHumanActorId: "actor-1",
  purpose: "EXP-015 sandbox workflow portfolio",
  experimentId: "EXP-015",
  workflowDefinitionIds: ["zoho.create-task.v1", "zoho.update-task.v1"],
  systems: ["zoho-sandbox"],
  operations: ["create", "update", "link"],
  targetScopes: [{
    system: "zoho-sandbox",
    objectType: "Task",
    fields: ["Subject", "Due_Date"],
    recordScope: { kind: "registered-set", allowlistId: "exp015-task-set" }
  }],
  riskCeiling: "medium",
  materialEffectBoundary: "non-destructive-only",
  effectClassificationPolicyId: "material-effect-policy.v1",
  effectiveAt: "2026-09-24T12:00:00Z",
  expiresAt: "2026-09-24T16:00:00Z",
  revocable: true,
  limits: { maxActions: 20, maxActionsPerHour: 10, maxCost: 5, currency: "CAD" },
  approvalMode: "bounded-duration",
  verificationRequired: true,
  receiptRequired: true,
  compensationPlan: "Correct or reverse each verified target under a new governed action."
};

test("accepts a bounded non-delete WriteGrant", () => {
  assert.equal(validate(writeGrant), true, JSON.stringify(validate.errors));
});

test("structurally excludes delete and unlink from a general WriteGrant", () => {
  assert.equal(validate({ ...writeGrant, operations: ["update", "delete"] }), false);
  assert.equal(validate({ ...writeGrant, operations: ["update", "unlink"] }), false);
  assert.equal(validate({ ...writeGrant, materialEffectBoundary: "destructive-allowed" }), false);
  const { effectClassificationPolicyId: _policy, ...withoutEffectPolicy } = writeGrant;
  assert.equal(validate(withoutEffectPolicy), false);
});

test("accepts only an exact immutable single-use DeletionAuthorization shape", () => {
  const authorization = {
    kind: "DeletionAuthorization",
    authorizationId: "delete-auth-1",
    authorizingHumanActorId: "actor-1",
    principalId: "user-1",
    operation: "delete",
    purpose: "Remove one duplicate sandbox task after human preview",
    targets: [{ system: "zoho-sandbox", objectType: "Task", recordId: "task-123", recordVersion: "v4" }],
    previewDigest: "sha256:exact-preview",
    humanReadablePreview: "Delete Task task-123 at version v4 from the Zoho sandbox.",
    issuedAt: "2026-09-24T12:00:00Z",
    expiresAt: "2026-09-24T12:05:00Z",
    singleUse: true,
    immutableTargetList: true,
    policyDecisionId: "policy-deletion-1",
    verificationRequired: true,
    receiptRequired: true
  };
  assert.equal(validate(authorization), true, JSON.stringify(validate.errors));
  assert.equal(validate({ ...authorization, singleUse: false }), false);
  assert.equal(validate({ ...authorization, targets: [{ system: "zoho-sandbox", objectType: "Task", recordId: "*" }] }), false);
  const { previewDigest: _removed, ...withoutPreview } = authorization;
  assert.equal(validate(withoutPreview), false);
});

test("requires registered workflows and bounded record/field scopes", () => {
  const { workflowDefinitionIds: _workflowIds, ...withoutWorkflows } = writeGrant;
  assert.equal(validate(withoutWorkflows), false);
  assert.equal(
    validate({
      ...writeGrant,
      targetScopes: [{
        system: "zoho-sandbox",
        objectType: "Task",
        fields: ["Subject"],
        recordScope: { kind: "exact-records", recordIds: ["*"] }
      }]
    }),
    false
  );
});

test("binds receipts to authority by normalized material effect", () => {
  const receipt = {
    kind: "ActionReceipt",
    receiptId: "receipt-1",
    actionId: "action-1",
    principalId: "user-1",
    purpose: "Update one approved sandbox task",
    operation: "update",
    materialEffect: "non-destructive",
    authorityKind: "WriteGrant",
    targets: [{ system: "zoho-sandbox", objectType: "Task", recordId: "task-123", recordVersion: "v4" }],
    authorityReference: "grant-1",
    attemptedAt: "2026-09-24T12:01:00Z",
    result: "succeeded",
    verification: "Read-back matched the approved value.",
    humanReadableSummary: "Updated Task task-123 in the Zoho sandbox."
  };

  assert.equal(validate(receipt), true, JSON.stringify(validate.errors));
  assert.equal(
    validate({
      ...receipt,
      operation: "delete",
      materialEffect: "deletion",
      authorityKind: "DeletionAuthorization",
      authorityReference: "delete-auth-1"
    }),
    true,
    JSON.stringify(validate.errors)
  );
  assert.equal(validate({ ...receipt, operation: "delete", materialEffect: "deletion" }), false);
  assert.equal(validate({ ...receipt, materialEffect: "deletion" }), false);
  assert.equal(validate({ ...receipt, authorityKind: "DeletionAuthorization" }), false);
});
