/*
 * IMP-011 - Status: Implemented
 * GENERATED from spec/contracts/governed-action.schema.json.
 * Normative for the planned experimental write-authority scaffold only. Run pnpm generate:contracts; do not hand edit.
 */

/**
 * Normative scaffold for time-bounded non-delete WriteGrants and fresh exact single-use DeletionAuthorizations. It does not enable execution by itself.
 */
export type NeoCRMGovernedExperimentalActionContract =
  WriteGrant | DeletionAuthorization | ActionReceipt;
/**
 * Operations eligible for a time-bounded WriteGrant. Policy must still classify the material effect and route any destructive or equivalent deletion effect to DeletionAuthorization.
 */
export type NonDeleteOperation =
  "create" | "update" | "link" | "assign" | "transition" | "append" | "send";
export type ActionReceipt = {
  [k: string]: unknown;
} & {
  kind: "ActionReceipt";
  receiptId: string;
  actionId: string;
  principalId: string;
  purpose: string;
  operation: NonDeleteOperation | "delete";
  /**
   * Policy-normalized material effect. Destruction, purge, erasure, destructive clearing, unlinking, or equivalent irreversible removal is deletion even when a source API uses another verb.
   */
  materialEffect: "non-destructive" | "deletion";
  authorityKind: "WriteGrant" | "DeletionAuthorization";
  /**
   * @minItems 1
   */
  targets: [ExactTarget, ...ExactTarget[]];
  authorityReference: string;
  attemptedAt: string;
  result:
    "succeeded" | "partial" | "failed" | "cancelled" | "uncertain" | "compensated" | "reversed";
  verification: string;
  humanReadableSummary: string;
  cost?: number;
  currency?: string;
  outcomeIds?: string[];
};

/**
 * A time-bounded grant for registered non-delete workflows. Operation names never override effect-based deletion classification.
 */
export interface WriteGrant {
  kind: "WriteGrant";
  grantId: string;
  principalId: string;
  grantorHumanActorId: string;
  purpose: string;
  experimentId: string;
  /**
   * @minItems 1
   */
  workflowDefinitionIds: [string, ...string[]];
  /**
   * @minItems 1
   */
  systems: [string, ...string[]];
  /**
   * @minItems 1
   */
  operations: [NonDeleteOperation, ...NonDeleteOperation[]];
  /**
   * @minItems 1
   */
  targetScopes: [WriteTargetScope, ...WriteTargetScope[]];
  riskCeiling: "low" | "medium" | "high";
  /**
   * A WriteGrant never authorizes deletion or an equivalent destructive material effect, regardless of the source-system verb.
   */
  materialEffectBoundary: "non-destructive-only";
  /**
   * The versioned policy that classifies material effect before authority is selected.
   */
  effectClassificationPolicyId: string;
  effectiveAt: string;
  expiresAt: string;
  revocable: true;
  limits: Limits;
  approvalMode: "per-action" | "bounded-duration" | "risk-triggered";
  verificationRequired: true;
  receiptRequired: true;
  compensationPlan: string;
  revokedAt?: string;
}
export interface WriteTargetScope {
  system: string;
  objectType: string;
  /**
   * @minItems 1
   */
  fields: [string, ...string[]];
  recordScope:
    | {
        kind: "exact-records";
        /**
         * @minItems 1
         */
        recordIds: [string, ...string[]];
      }
    | {
        kind: "registered-set";
        allowlistId: string;
      }
    | {
        kind: "create-new";
      };
}
export interface Limits {
  maxActions: number;
  maxActionsPerHour: number;
  maxCost: number;
  currency?: string;
}
export interface DeletionAuthorization {
  kind: "DeletionAuthorization";
  authorizationId: string;
  authorizingHumanActorId: string;
  principalId: string;
  operation: "delete";
  purpose: string;
  /**
   * @minItems 1
   */
  targets: [ExactTarget, ...ExactTarget[]];
  previewDigest: string;
  humanReadablePreview: string;
  issuedAt: string;
  expiresAt: string;
  singleUse: true;
  immutableTargetList: true;
  policyDecisionId: string;
  verificationRequired: true;
  receiptRequired: true;
  consumedAt?: string;
}
export interface ExactTarget {
  system: string;
  objectType: string;
  recordId: string;
  recordVersion?: string;
  /**
   * @minItems 1
   */
  fields?: [string, ...string[]];
}
