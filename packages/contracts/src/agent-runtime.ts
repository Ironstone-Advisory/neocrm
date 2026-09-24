/*
 * IMP-005 - Status: Implemented
 * GENERATED from spec/contracts/agent-runtime.schema.json.
 * Normative for bounded EXP-001 agent-runtime exchanges only. Run pnpm generate:contracts; do not hand edit.
 */

/**
 * Executable contracts for the EXP-001 single-agent reference path. They do not claim to implement the complete NeoCRM agency model.
 */
export type NeoCRMBoundedAgentRuntimeContracts =
  | AgentDefinition
  | AuthorityGrant
  | Trigger
  | Goal
  | Plan
  | AgentRun
  | Handoff
  | PolicyDecision
  | ContextSnapshot
  | Outcome
  | LearningSignal
  | AuditEvent;

export interface AgentDefinition {
  contractType: "agent_definition";
  agentId: string;
  name: string;
  version: string;
  /**
   * @minItems 1
   */
  capabilities: [string, ...string[]];
  /**
   * @minItems 1
   */
  allowedOperations: ["read", ..."read"[]];
}
export interface AuthorityGrant {
  contractType: "authority_grant";
  grantId: string;
  delegator: string;
  agentId: string;
  capability: "CAP-001";
  /**
   * @minItems 1
   * @maxItems 1
   */
  operations: ["read"];
  expiresAt: string;
}
export interface Trigger {
  contractType: "trigger";
  triggerId: string;
  kind: "conversational" | "scheduled";
  receivedAt: string;
  query: string;
  selectedPartyId?: string;
}
export interface Goal {
  contractType: "goal";
  goalId: string;
  intent: "relationship_brief";
  objective: string;
  /**
   * @minItems 1
   */
  requiredDomains: [
    "party" | "relationship" | "commercial" | "activity" | "knowledge" | "time",
    ...("party" | "relationship" | "commercial" | "activity" | "knowledge" | "time")[]
  ];
  constraints: {
    externalWrites: false;
    durableMemory: false;
    minimumNecessary: true;
  };
}
export interface Plan {
  contractType: "plan";
  planId: string;
  goalId: string;
  /**
   * @minItems 4
   */
  steps: [PlanStep, PlanStep, PlanStep, PlanStep, ...PlanStep[]];
}
export interface PlanStep {
  stepId: string;
  kind: "policy_precheck" | "identity_resolution" | "context_retrieval" | "synthesis";
  operation: "read";
  status: "planned" | "completed" | "blocked" | "failed";
}
export interface AgentRun {
  contractType: "agent_run";
  runId: string;
  agent: AgentDefinition;
  grant: AuthorityGrant;
  trigger: Trigger;
  goal: Goal;
  plan: Plan;
  policyDecision: PolicyDecision;
  status: "completed" | "needs_disambiguation" | "denied" | "failed";
  brief: {
    [k: string]: unknown;
  } | null;
  contextSnapshot: ContextSnapshot | null;
  handoff: Handoff;
  /**
   * @minItems 1
   */
  audit: [AuditEvent, ...AuditEvent[]];
}
export interface PolicyDecision {
  contractType: "policy_decision";
  decisionId: string;
  decision: "allow" | "deny";
  /**
   * @maxItems 1
   */
  allowedOperations: [] | ["read"];
  reasonCode: "READ_ONLY_GRANT_VALID" | "GRANT_EXPIRED" | "GRANT_INVALID" | "WRITE_NOT_ALLOWED";
}
export interface ContextSnapshot {
  contractType: "context_snapshot";
  snapshotId: string;
  capturedAt: string;
  subjectPartyId: string;
  evidenceIds: string[];
  sourceStatuses: {
    adapterId: string;
    status: "queried" | "skipped" | "failed" | "denied";
  }[];
  containsCredentials: false;
  containsRawPrivateContent: false;
}
export interface Handoff {
  contractType: "handoff";
  handoffId: string;
  fromAgentId: string;
  toAgentId: string;
  status: "not_required" | "requested" | "accepted" | "declined";
  reason: string;
}
export interface AuditEvent {
  contractType: "audit_event";
  eventId: string;
  runId: string;
  event: string;
  occurredAt: string;
  safeMetadata: {
    [k: string]: string | number | boolean | null;
  };
}
export interface Outcome {
  contractType: "outcome";
  outcomeId: string;
  runId: string;
  recordedAt: string;
  rating: number;
  notes: string;
}
export interface LearningSignal {
  contractType: "learning_signal";
  signalId: string;
  outcomeId: string;
  kind: "human_feedback";
  effect: "record_only";
  /**
   * @minItems 5
   */
  prohibitedMutations: [
    "prompt" | "policy" | "mapping" | "configuration" | "source_data",
    "prompt" | "policy" | "mapping" | "configuration" | "source_data",
    "prompt" | "policy" | "mapping" | "configuration" | "source_data",
    "prompt" | "policy" | "mapping" | "configuration" | "source_data",
    "prompt" | "policy" | "mapping" | "configuration" | "source_data",
    ...("prompt" | "policy" | "mapping" | "configuration" | "source_data")[]
  ];
}
