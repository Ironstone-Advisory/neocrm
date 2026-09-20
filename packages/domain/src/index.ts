/**
 * Canonical, persistence-agnostic contracts for NeoCRM v0.1.
 *
 * Database implementations and HTTP handlers must preserve the invariants
 * documented in docs/domain-model.md.
 */
export const DOMAIN_VERSION = "v0.1" as const;

export type Id = string;
export type IsoDateTime = string;

export type PartyKind = "person" | "organization";
export const supportedPartyKinds: readonly PartyKind[] = [
  "person",
  "organization"
] as const;

export type ActivityKind = "note" | "email" | "call" | "meeting" | "event";
export type ActivityDirection = "inbound" | "outbound" | "internal";
export type OpportunityStage =
  | "discovery"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";
export type AgreementStatus = "draft" | "active" | "completed" | "cancelled";
export type WorkItemStatus = "open" | "in_progress" | "done" | "cancelled";

export interface WorkspaceContext {
  workspaceId: Id;
  actorId: Id;
}

export interface Party {
  id: Id;
  workspaceId: Id;
  kind: PartyKind;
  displayName: string;
  lifecycleStage: "prospect" | "active" | "former" | "archived";
  externalReferences: Record<string, string>;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface PersonDetails {
  partyId: Id;
  firstName: string;
  lastName: string;
  preferredName?: string;
  jobTitle?: string;
}

export interface OrganizationDetails {
  partyId: Id;
  legalName?: string;
  website?: string;
  industry?: string;
}

export interface PartyRelationship {
  id: Id;
  workspaceId: Id;
  sourcePartyId: Id;
  targetPartyId: Id;
  relationshipType: string;
  roleLabel?: string;
  startsOn?: string;
  endsOn?: string;
}

export interface Activity {
  id: Id;
  workspaceId: Id;
  kind: ActivityKind;
  direction: ActivityDirection;
  occurredAt: IsoDateTime;
  subject: string;
  body?: string;
  ownerId?: Id;
  startsAt?: IsoDateTime;
  endsAt?: IsoDateTime;
}

export interface WorkItem {
  id: Id;
  workspaceId: Id;
  title: string;
  status: WorkItemStatus;
  dueAt?: IsoDateTime;
  assignedToId?: Id;
  relatedPartyId?: Id;
  relatedOpportunityId?: Id;
}

export interface Offering {
  id: Id;
  workspaceId: Id;
  name: string;
  kind: "product" | "service";
  active: boolean;
}

export interface Opportunity {
  id: Id;
  workspaceId: Id;
  name: string;
  stage: OpportunityStage;
  amount?: number;
  currency: string;
  expectedCloseOn?: string;
  ownerId?: Id;
}

export interface Agreement {
  id: Id;
  workspaceId: Id;
  name: string;
  status: AgreementStatus;
  startsOn?: string;
  endsOn?: string;
  value?: number;
  currency: string;
}

export function assertWorkspaceScope(
  context: WorkspaceContext,
  record: { workspaceId: Id }
): void {
  if (context.workspaceId !== record.workspaceId) {
    throw new Error("Workspace scope violation");
  }
}
