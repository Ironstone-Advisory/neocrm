/*
 * IMP-001 - Status: Implemented
 * GENERATED from spec/contracts/capabilities/cap-001.schema.json.
 * Normative for CAP-001 exchanges only. Run pnpm generate:contracts; do not hand edit.
 */

/**
 * Normative Draft 2020-12 contracts for the bounded deterministic CAP-001 request, adapter, fixture, context, evidence, and response exchange. This is not the complete NeoCRM ontology.
 */
export type CAP001RelationshipBriefExchangeContracts =
  | RelationshipBriefRequest
  | IdentityResolutionResult
  | AdapterCapability
  | AdapterRequest
  | AdapterResult
  | Fixture
  | ResponseEnvelope;
export type ResponseEnvelope = {
  [k: string]: unknown;
} & {
  contractType: "response_envelope";
  version: "1.0";
  traceId: string;
  intent: "relationship_brief";
  status: "complete" | "partial" | "needs_disambiguation" | "needs_clarification" | "error";
  subject:
    | PartyRef
    | {
        candidates: PartyRef[];
      }
    | {
        unresolvedQuery: string;
      };
  facts: CategorizedFact[];
  observations: CategorizedObservation[];
  interpretations: CategorizedInterpretation[];
  hypotheses: CategorizedHypothesis[];
  unknowns: CategorizedUnknown[];
  conflicts: CategorizedConflict[];
  recommendations: Recommendation[];
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
};
export type CategorizedFact = Assertion & {
  kind?: "fact";
  [k: string]: unknown;
};
export type Assertion = {
  [k: string]: unknown;
} & {
  assertionId: string;
  predicate: string;
  value: unknown;
  kind: "fact" | "observation" | "interpretation" | "hypothesis" | "unknown" | "conflict";
  text: string;
  confidence?: number;
  evidenceIds: string[];
  derivation: DerivationMetadata;
  status: "active" | "disputed" | "corrected";
};
export type CategorizedObservation = Assertion & {
  kind?: "observation";
  [k: string]: unknown;
};
export type CategorizedInterpretation = Assertion & {
  kind?: "interpretation";
  [k: string]: unknown;
};
export type CategorizedHypothesis = Assertion & {
  kind?: "hypothesis";
  [k: string]: unknown;
};
export type CategorizedUnknown = Assertion & {
  kind?: "unknown";
  [k: string]: unknown;
};
export type CategorizedConflict = Assertion & {
  kind?: "conflict";
  [k: string]: unknown;
};
export type IdentityResolutionResult = {
  [k: string]: unknown;
} & {
  contractType: "identity_resolution_result";
  status: "resolved" | "ambiguous" | "not_found";
  candidates: PartyRef[];
  selectedPartyId?: string;
};
export type AdapterResult = {
  [k: string]: unknown;
} & {
  contractType: "adapter_result";
  adapterId: string;
  sourceId: string;
  status: "ok" | "failed" | "denied";
  retrievedAt: string;
  records: NativeRecord[];
  roles: Role[];
  relationships: Relationship[];
  error?: {
    code: string;
    message: string;
  };
};
export type Party = Person | Company | Household;

export interface RelationshipBriefRequest {
  contractType: "relationship_brief_request";
  version: "1.0";
  message: string;
  state: ConversationState;
}
export interface ConversationState {
  conversationId: string;
  turnCount: number;
  selectedPartyId?: string;
  pendingIdentityQuery?: string;
  corrections: ConversationCorrection[];
  lastBrief?: ResponseEnvelope;
}
export interface ConversationCorrection {
  assertionId: string;
  replacement: string;
  recordedAt: string;
}
export interface PartyRef {
  partyId: string;
  displayName: string;
  partyType: "person" | "company" | "household";
  disambiguationLabel?: string;
}
export interface DerivationMetadata {
  transformationId: string;
  extractor: "adapter" | "deterministic_rule" | "model" | "user";
  modelVersion: string | null;
  inputAssertionIds: string[];
}
export interface Recommendation {
  recommendationId: string;
  decisionType: string;
  predicate: string;
  text: string;
  /**
   * @minItems 1
   */
  options: [RecommendationOption, ...RecommendationOption[]];
  rationale: string;
  evidenceIds: string[];
  derivation: DerivationMetadata;
  status: "proposed" | "accepted" | "dismissed";
}
export interface RecommendationOption {
  optionId: string;
  label: string;
}
export interface Evidence {
  evidenceId: string;
  marker: string;
  source: SourceRef;
  summary: string;
  untrustedContent: boolean;
}
export interface SourceRef {
  sourceId: string;
  adapterId: string;
  nativeId: string;
  retrievedAt: string;
  effectiveAt?: string | null;
  authority: "authoritative" | "corroborating" | "contextual";
  completeness: "known_complete" | "known_partial" | "unknown";
  sourceModule?: string;
  fieldApiName?: string;
  modifiedAt?: string | null;
  transformation?: string;
}
export interface ContextPlan {
  intent: "relationship_brief";
  subjectPartyId: string;
  steps: ContextPlanStep[];
}
export interface ContextPlanStep {
  adapterId: string;
  /**
   * @minItems 1
   */
  domains: [
    "party" | "relationship" | "commercial" | "activity" | "knowledge" | "time",
    ...("party" | "relationship" | "commercial" | "activity" | "knowledge" | "time")[]
  ];
  filters: {
    [k: string]: unknown;
  };
  reason: string;
  authorization: "granted" | "denied" | "unknown";
  freshness: "fresh" | "stale" | "unknown";
  status: "planned" | "queried" | "skipped" | "failed" | "denied";
  detail?: string;
}
export interface ActionProposal {
  actionId: string;
  actionType: string;
  targetAdapterId: string;
  rationale: string;
  preview: {
    [k: string]: unknown;
  };
  state: "proposed" | "awaiting_approval" | "approved" | "disabled" | "executed" | "failed";
  requiresExplicitApproval: true;
  externalWrite: boolean;
  evidenceIds: string[];
}
export interface AdapterCapability {
  contractType: "adapter_capability";
  adapterId: string;
  sourceId: string;
  /**
   * @minItems 1
   */
  readDomains: [
    "party" | "relationship" | "commercial" | "activity" | "knowledge" | "time",
    ...("party" | "relationship" | "commercial" | "activity" | "knowledge" | "time")[]
  ];
  /**
   * @minItems 1
   */
  supportedFilters: [
    "partyId" | "effectiveAfter" | "effectiveBefore",
    ...("partyId" | "effectiveAfter" | "effectiveBefore")[]
  ];
  /**
   * @minItems 1
   */
  domainAuthorities: [DomainAuthority, ...DomainAuthority[]];
  freshnessPolicy: {
    maximumAgeSeconds: number;
  };
  authorization: {
    status: "granted" | "denied" | "unknown";
    scopes: string[];
  };
  writeActions: string[];
  externalWritesEnabled: boolean;
}
export interface DomainAuthority {
  domain: "party" | "relationship" | "commercial" | "activity" | "knowledge" | "time";
  authority: "authoritative" | "corroborating" | "contextual";
}
export interface AdapterRequest {
  contractType: "adapter_request";
  adapterId: string;
  /**
   * @minItems 1
   */
  domains: [
    "party" | "relationship" | "commercial" | "activity" | "knowledge" | "time",
    ...("party" | "relationship" | "commercial" | "activity" | "knowledge" | "time")[]
  ];
  filters: {
    partyId: string;
    effectiveAfter?: string;
    effectiveBefore?: string;
  };
}
export interface NativeRecord {
  nativeId: string;
  partyId: string;
  effectiveAt: string;
  summary: string;
  untrustedContent?: boolean;
  claims: NativeClaim[];
}
export interface NativeClaim {
  domain: "party" | "relationship" | "commercial" | "activity" | "knowledge" | "time";
  predicate: string;
  value: unknown;
  label: string;
  authority?: "authoritative" | "corroborating" | "contextual";
  contentType: "business_evidence" | "untrusted_source_text";
  epistemicCategory: "fact" | "observation" | "interpretation" | "hypothesis";
  confidence?: number;
  completeness?: "known_complete" | "known_partial" | "unknown";
  sourceModule?: string;
  fieldApiName?: string;
  modifiedAt?: string | null;
  transformation?: string;
  instructionLike?: boolean;
}
export interface Role {
  roleId: string;
  partyId: string;
  roleType:
    | "customer"
    | "prospect"
    | "partner"
    | "supplier"
    | "employee"
    | "decision_maker"
    | "contract_party";
  contextPartyId?: string;
  validFrom: string;
  validTo?: string | null;
  confidence: number;
  completeness?: "known_complete" | "known_partial" | "unknown";
  epistemicCategory: "fact" | "observation" | "interpretation" | "hypothesis";
  /**
   * @minItems 1
   */
  provenance: [SourceRef, ...SourceRef[]];
}
export interface Relationship {
  relationshipId: string;
  relationshipType: string;
  /**
   * @minItems 2
   */
  participantPartyIds: [string, string, ...string[]];
  direction: "directed" | "undirected";
  validFrom: string;
  validTo?: string | null;
  confidence: number;
  epistemicCategory: "fact" | "observation" | "interpretation" | "hypothesis";
  /**
   * @minItems 1
   */
  provenance: [SourceRef, ...SourceRef[]];
}
export interface Fixture {
  contractType: "fixture";
  fixtureId: string;
  clock: string;
  /**
   * @minItems 1
   */
  parties: [Party, ...Party[]];
  roles: Role[];
  relationships: Relationship[];
  /**
   * @minItems 1
   */
  sources: [FixtureSource, ...FixtureSource[]];
}
export interface Person {
  partyId: string;
  partyType: "person";
  displayName: string;
  givenName?: string;
  familyName?: string;
  aliases?: string[];
}
export interface Company {
  partyId: string;
  partyType: "company";
  displayName: string;
  legalName?: string;
  aliases?: string[];
}
export interface Household {
  partyId: string;
  partyType: "household";
  displayName: string;
  aliases?: string[];
}
export interface FixtureSource {
  capability: AdapterCapability;
  records: NativeRecord[];
}
