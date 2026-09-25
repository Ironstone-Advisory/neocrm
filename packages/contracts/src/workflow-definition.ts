/*
 * IMP-012 - Status: Implemented
 * GENERATED from spec/contracts/workflow-definition.schema.json.
 * Normative for host-neutral workflow-definition scaffolding; it does not implement routing or execution only. Run pnpm generate:contracts; do not hand edit.
 */

/**
 * A versioned, host-neutral discovery and orchestration definition. A WorkflowDefinition describes a reusable relationship-management job; it is neither a runtime Plan instantiated for one Goal nor a PlaybookDefinition that supplies a reusable Plan pattern. The contract is specification scaffolding and grants no source, write, send, schedule, connection, or deletion authority.
 */
export type NeoCRMWorkflowDefinition = {
  [k: string]: unknown;
} & {
  kind: "WorkflowDefinition";
  schemaVersion: "1.0.0";
  workflowId: string;
  version: string;
  slug: string;
  title: string;
  workflowClass: "business" | "meta" | "shared-control";
  definitionBoundary: {
    isRuntimePlan: false;
    isPlaybookDefinition: false;
    statement: "This definition describes a reusable job and its governance envelope. A Plan is instantiated for one Goal and run; a PlaybookDefinition supplies reusable guidance.";
  };
  classification: {
    primaryDomain: "sales" | "marketing" | "service" | "meta" | "shared";
    canonicalPerspective: "sales" | "engagement" | "service" | "cross-functional" | "control";
    secondaryDomains: ("sales" | "engagement" | "service" | "cross-functional" | "control")[];
    routable: boolean;
    repositoryPath: string;
  };
  intent: {
    intentId: string;
    name: string;
    description: string;
    /**
     * @minItems 2
     */
    aliases: [string, string, ...string[]];
    classification: "inform" | "decide" | "draft" | "propose-action" | "coordinate" | "control";
  };
  goal: {
    goalType: string;
    objectiveTemplate: string;
    /**
     * @minItems 2
     */
    successSignals: [string, string, ...string[]];
    /**
     * @minItems 2
     */
    constraints: [string, string, ...string[]];
  };
  job: {
    jobToBeDone: string;
    /**
     * @minItems 1
     */
    useWhen: [string, ...string[]];
    /**
     * @minItems 1
     */
    produces: [string, ...string[]];
    /**
     * @minItems 2
     */
    nonGoals: [string, string, ...string[]];
  };
  /**
   * @minItems 2
   */
  inputs: [WorkflowInput, WorkflowInput, ...WorkflowInput[]];
  /**
   * @minItems 2
   */
  outputs: [WorkflowOutput, WorkflowOutput, ...WorkflowOutput[]];
  flow: {
    triggerModes: (
      | "human"
      | "conversational"
      | "event"
      | "signal"
      | "scheduled"
      | "outcome-gap"
      | "workflow-call"
    )[];
    /**
     * @minItems 5
     */
    steps: [
      WorkflowStep,
      WorkflowStep,
      WorkflowStep,
      WorkflowStep,
      WorkflowStep,
      ...WorkflowStep[]
    ];
    /**
     * @minItems 1
     */
    branches: [Branch, ...Branch[]];
    /**
     * @minItems 2
     */
    completionCriteria: [string, string, ...string[]];
    /**
     * @minItems 3
     */
    failureModes: [FailureMode, FailureMode, FailureMode, ...FailureMode[]];
    /**
     * @minItems 1
     */
    escalations: [Escalation, ...Escalation[]];
    /**
     * @minItems 3
     */
    stopConditions: [string, string, string, ...string[]];
    scheduleRegistration: "not-implemented";
  };
  /**
   * @minItems 1
   */
  handoffs: [Handoff, ...Handoff[]];
  /**
   * @minItems 2
   */
  policies: [Policy, Policy, ...Policy[]];
  sources: {
    /**
     * @minItems 0
     */
    capabilityIntents: string[];
    meaningRule: "Sources are selected by adapter capability intent and provide evidence; vendor products and schemas do not define NeoCRM canonical meaning.";
    readScope: {
      principalBound: true;
      purposeBound: true;
      minimumNecessary: true;
      subjectScope: string;
      /**
       * @minItems 1
       */
      fieldScope: [string, ...string[]];
      timeScope: string;
      deniedOrFailedSourceTreatment: "Disclose the gap; never infer absence, zero, or permission from an unavailable source.";
    };
    zeroConnectorFallback: {
      supported: true;
      /**
       * @minItems 1
       */
      modes: [
        "pasted-text" | "uploaded-document" | "csv" | "user-owned-local-source" | "manual-entry",
        ...(
          "pasted-text" | "uploaded-document" | "csv" | "user-owned-local-source" | "manual-entry"
        )[]
      ];
      degradationDisclosure: string;
    };
  };
  authority: {
    [k: string]: unknown;
  };
  operationalControls: {
    budgets: {
      [k: string]: unknown;
    };
    idempotency: {
      requiredForExternalEffects: true;
      keyStrategy: string;
    };
    retry: {
      mode: "none" | "safe-read-only" | "policy-controlled";
      maxAttempts: number;
      uncertainOutcome: "Stop, verify target state, and require human resolution before any potentially duplicative or destructive retry.";
    };
    cursorCheckpoint: {
      mode: "not-required" | "planned";
      resumeRule: string;
    };
    time: {
      timezoneSource:
        | "authenticated-user"
        | "resolved-party-with-user-confirmation"
        | "explicit-workspace-policy";
      quietHoursRequiredForContact: true;
      scheduleTruthRule: "Never claim a future run exists until a scheduler returns a durable schedule identifier and human-readable receipt.";
    };
    decisionSupport: {
      evidenceRequired: true;
      counterevidenceRequired: true;
      unknownsRequired: true;
      modelVersionRequired: true;
      expiryRequired: true;
      permittedUseRequired: true;
    };
    verification: {
      requiredForExternalEffects: true;
      method: string;
    };
    compensation: {
      requiredForExternalEffects: true;
      rule: "Compensation is a new governed action; it is not an unaudited rollback shortcut.";
    };
    receipt: {
      requiredForExternalEffects: true;
      humanReadable: true;
      /**
       * @minItems 5
       */
      contents: [
        (
          | "authority"
          | "targets"
          | "result"
          | "verification"
          | "cost"
          | "correction"
          | "compensation"
          | "timestamp"
        ),
        (
          | "authority"
          | "targets"
          | "result"
          | "verification"
          | "cost"
          | "correction"
          | "compensation"
          | "timestamp"
        ),
        (
          | "authority"
          | "targets"
          | "result"
          | "verification"
          | "cost"
          | "correction"
          | "compensation"
          | "timestamp"
        ),
        (
          | "authority"
          | "targets"
          | "result"
          | "verification"
          | "cost"
          | "correction"
          | "compensation"
          | "timestamp"
        ),
        (
          | "authority"
          | "targets"
          | "result"
          | "verification"
          | "cost"
          | "correction"
          | "compensation"
          | "timestamp"
        ),
        ...(
          | "authority"
          | "targets"
          | "result"
          | "verification"
          | "cost"
          | "correction"
          | "compensation"
          | "timestamp"
        )[]
      ];
    };
  };
  experience: {
    menuLabel: string;
    oneLineSummary: string;
    /**
     * @minItems 1
     */
    personas: [Persona, ...Persona[]];
    /**
     * @minItems 2
     */
    aliases: [string, string, ...string[]];
    /**
     * @minItems 3
     */
    searchTerms: [string, string, string, ...string[]];
    /**
     * @minItems 1
     */
    invocationExamples: [string, ...string[]];
    /**
     * @minItems 2
     */
    outputPresentation: [string, string, ...string[]];
    emptyState: string;
  };
  traceability: {
    capabilityIds: string[];
    objectIds: string[];
    viewIds: string[];
    /**
     * @minItems 1
     */
    requirementIds: [string, ...string[]];
    decisionRegisterIds: string[];
    experimentIds: string[];
    evaluationIds: string[];
  };
  status: {
    specificationStatus: "Proposed" | "Accepted";
    implementationStatus: "NotStarted" | "Partial";
    evidenceMaturity: "Unassessed" | "Demonstrated";
    deliveryHorizon: "CurrentSlice" | "P1" | "P2";
    runtimeClaim: "Definition scaffolding only; no workflow router, live write, send, schedule, or connection-registration runtime is claimed.";
    evidenceBoundary: string;
  };
  evaluation: {
    status: "NotStarted" | "Demonstrated";
    plannedFixtureIds: string[];
    evidenceGap: string;
    /**
     * @minItems 3
     */
    acceptanceCriteria: [string, string, string, ...string[]];
    /**
     * @minItems 1
     */
    knownGaps: [string, ...string[]];
  };
  changeControl: {
    owner: "NeoCRM product architecture";
    lastReviewed: string;
    /**
     * @minItems 3
     */
    definitionChangesRequire: [
      (
        | "schema-validation"
        | "traceability-review"
        | "evaluation-review"
        | "safety-review"
        | "human-approval"
      ),
      (
        | "schema-validation"
        | "traceability-review"
        | "evaluation-review"
        | "safety-review"
        | "human-approval"
      ),
      (
        | "schema-validation"
        | "traceability-review"
        | "evaluation-review"
        | "safety-review"
        | "human-approval"
      ),
      ...(
        | "schema-validation"
        | "traceability-review"
        | "evaluation-review"
        | "safety-review"
        | "human-approval"
      )[]
    ];
    authorityExpansionRequires: "A separately reviewed contract, policy, experiment, and human approval; editing this definition cannot grant authority.";
    historyPolicy: "Version definitions and preserve superseded evidence; do not silently rewrite observed outcomes or receipts.";
  };
};
export type WorkflowOutput = {
  [k: string]: unknown;
} & {
  outputId: string;
  name: string;
  semanticType:
    | "brief"
    | "recommendation"
    | "draft"
    | "plan"
    | "metric"
    | "risk"
    | "handoff"
    | "action-proposal"
    | "policy-decision-input"
    | "evidence-gap"
    | "receipt-input"
    | "learning-signal";
  epistemicCategory:
    | "fact"
    | "observation"
    | "interpretation"
    | "hypothesis"
    | "unknown"
    | "conflict"
    | "not-applicable";
  proposalState: "none" | "draft" | "action-proposal";
  evidenceRequired: true;
  humanReviewRequired: boolean;
} & {
  outputId: string;
  name: string;
  semanticType:
    | "brief"
    | "recommendation"
    | "draft"
    | "plan"
    | "metric"
    | "risk"
    | "handoff"
    | "action-proposal"
    | "policy-decision-input"
    | "evidence-gap"
    | "receipt-input"
    | "learning-signal";
  epistemicCategory:
    | "fact"
    | "observation"
    | "interpretation"
    | "hypothesis"
    | "unknown"
    | "conflict"
    | "not-applicable";
  proposalState: "none" | "draft" | "action-proposal";
  evidenceRequired: true;
  humanReviewRequired: boolean;
} & {
  outputId: string;
  name: string;
  semanticType:
    | "brief"
    | "recommendation"
    | "draft"
    | "plan"
    | "metric"
    | "risk"
    | "handoff"
    | "action-proposal"
    | "policy-decision-input"
    | "evidence-gap"
    | "receipt-input"
    | "learning-signal";
  epistemicCategory:
    | "fact"
    | "observation"
    | "interpretation"
    | "hypothesis"
    | "unknown"
    | "conflict"
    | "not-applicable";
  proposalState: "none" | "draft" | "action-proposal";
  evidenceRequired: true;
  humanReviewRequired: boolean;
};

export interface WorkflowInput {
  inputId: string;
  name: string;
  semanticType:
    | "principal"
    | "intent"
    | "goal"
    | "party"
    | "relationship"
    | "commercial"
    | "activity"
    | "conversation"
    | "consent"
    | "engagement"
    | "service"
    | "entitlement"
    | "knowledge"
    | "time"
    | "metric"
    | "content"
    | "policy"
    | "evidence";
  required: boolean;
  sourceCapabilityIntent: string | null;
  purpose: string;
  /**
   * @minItems 1
   */
  fieldScope: [string, ...string[]];
  freshness: FreshnessRequirement;
  classification: "public" | "internal" | "confidential" | "restricted";
  missingness: "stop" | "degrade-and-disclose" | "optional";
}
export interface FreshnessRequirement {
  mode: "point-in-time" | "bounded-window" | "as-available";
  maximumAge: string | null;
  staleBehavior: "stop" | "degrade-and-disclose" | "request-refresh";
}
export interface WorkflowStep {
  stepId: string;
  name: string;
  kind:
    | "scope"
    | "identity"
    | "context"
    | "analysis"
    | "synthesis"
    | "proposal"
    | "preview"
    | "policy"
    | "authority"
    | "human-review"
    | "execution"
    | "verification"
    | "receipt"
    | "handoff"
    | "learning";
  dependsOn: string[];
  inputIds: string[];
  outputIds: string[];
  policyIds: string[];
  /**
   * @minItems 1
   */
  completionCriteria: [string, ...string[]];
  failureBehavior: "stop" | "degrade" | "escalate";
  escalationId: string | null;
}
export interface Branch {
  branchId: string;
  afterStepId: string;
  condition: string;
  onTrueStepId: string;
  onFalseStepId: string;
}
export interface FailureMode {
  failureId: string;
  condition: string;
  response: "stop" | "degrade" | "escalate" | "request-input";
  disclosureRequired: true;
}
export interface Escalation {
  escalationId: string;
  targetRole: string;
  reason: string;
  /**
   * @minItems 1
   */
  requiredPayload: [string, ...string[]];
}
export interface Handoff {
  handoffId: string;
  direction: "inbound" | "outbound" | "internal";
  targetRole: string;
  /**
   * @minItems 1
   */
  payloadTypes: [string, ...string[]];
  /**
   * @minItems 1
   */
  acceptanceCriteria: [string, ...string[]];
  failureBehavior: "return-to-sender" | "escalate" | "stop";
}
export interface Policy {
  policyId: string;
  name: string;
  /**
   * @minItems 1
   */
  requirementRefs: [string, ...string[]];
  gate:
    "before-read" | "before-synthesis" | "before-proposal" | "before-execution" | "after-execution";
  decisionRequired: true;
  failureBehavior: "stop" | "degrade" | "escalate";
}
export interface Persona {
  personaId: string;
  label: string;
  /**
   * @minItems 1
   */
  aliases: [string, ...string[]];
}
