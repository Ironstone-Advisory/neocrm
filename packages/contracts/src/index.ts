/**
 * IMP-001
 * Checked TypeScript projection of spec/domain/schemas/neocrm.schema.json.
 * The JSON Schema is normative. Do not change this file without changing the
 * schema and traceability in the same commit.
 */

export type PartyType = "person" | "company" | "household";
export type RoleType =
  | "customer"
  | "prospect"
  | "partner"
  | "supplier"
  | "employee"
  | "decision_maker"
  | "contract_party";
export type EpistemicKind =
  | "fact"
  | "observation"
  | "hypothesis"
  | "unknown"
  | "conflict"
  | "recommendation";
export type Domain = "party" | "commercial" | "activity" | "knowledge" | "time";
export type Authority = "authoritative" | "corroborating" | "contextual";

export interface PartyBase {
  partyId: string;
  displayName: string;
}

export interface Person extends PartyBase {
  partyType: "person";
  givenName?: string;
  familyName?: string;
}

export interface Company extends PartyBase {
  partyType: "company";
  legalName?: string;
}

export interface Household extends PartyBase {
  partyType: "household";
}

export type Party = Person | Company | Household;
export type PartyRef = Pick<Party, "partyId" | "displayName" | "partyType">;

export interface Role {
  roleId: string;
  partyId: string;
  roleType: RoleType;
  contextPartyId?: string;
  validFrom: string;
  validTo?: string | null;
}

export interface Relationship {
  relationshipId: string;
  relationshipType: string;
  participantPartyIds: string[];
  direction?: "directed" | "undirected";
  validFrom: string;
  validTo?: string | null;
  evidenceIds?: string[];
}

export interface SourceRef {
  sourceId: string;
  adapterId: string;
  nativeId: string;
  retrievedAt: string;
  effectiveAt?: string | null;
  authority: Authority;
}

export interface Evidence {
  evidenceId: string;
  source: SourceRef;
  summary: string;
  untrustedContent?: boolean;
}

export interface Assertion {
  assertionId: string;
  kind: EpistemicKind;
  text: string;
  confidence: number;
  evidenceIds: string[];
  derivedFromIds: string[];
}

export interface ContextPlanStep {
  adapterId: string;
  domains: Domain[];
  reason: string;
  status: "planned" | "queried" | "skipped" | "failed" | "denied";
  detail?: string;
}

export interface ContextPlan {
  intent: "relationship_brief";
  subjectPartyId: string;
  steps: ContextPlanStep[];
}

export interface ActionProposal {
  actionId: string;
  actionType: string;
  targetAdapterId: string;
  rationale: string;
  preview: Record<string, unknown>;
  state:
    | "proposed"
    | "awaiting_approval"
    | "approved"
    | "disabled"
    | "executed"
    | "failed";
  requiresExplicitApproval: true;
  externalWrite: boolean;
  evidenceIds?: string[];
}

export interface AdapterCapability {
  adapterId: string;
  sourceId: string;
  readDomains: Domain[];
  writeActions: string[];
  authority: Authority;
  externalWritesEnabled: boolean;
}

export interface ResponseEnvelope {
  version: "1.0";
  traceId: string;
  intent: "relationship_brief";
  status: "complete" | "partial" | "needs_disambiguation" | "error";
  subject: PartyRef | { candidates: PartyRef[] };
  facts: Assertion[];
  observations: Assertion[];
  hypotheses: Assertion[];
  unknowns: Assertion[];
  conflicts: Assertion[];
  recommendations: Assertion[];
  evidence: Evidence[];
  sourcePlan: ContextPlan | null;
  actions: ActionProposal[];
  memory: {
    sessionContextUsed: boolean;
    durableMemoryWritten: false;
  };
  policy: {
    externalWrites: "disabled";
  };
}
