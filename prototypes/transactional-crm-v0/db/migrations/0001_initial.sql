-- ARCHIVED database-first prototype; not the canonical NeoCRM ontology or an active migration.
-- All application queries must scope records by workspace_id.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE party_kind AS ENUM ('person', 'organization');
CREATE TYPE activity_kind AS ENUM ('note', 'email', 'call', 'meeting', 'event');
CREATE TYPE activity_direction AS ENUM ('inbound', 'outbound', 'internal');
CREATE TYPE opportunity_stage AS ENUM (
  'discovery', 'qualified', 'proposal', 'negotiation', 'won', 'lost'
);
CREATE TYPE agreement_status AS ENUM ('draft', 'active', 'completed', 'cancelled');
CREATE TYPE work_item_status AS ENUM ('open', 'in_progress', 'done', 'cancelled');

CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE workspace_memberships (
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  kind party_kind NOT NULL,
  display_name TEXT NOT NULL,
  lifecycle_stage TEXT NOT NULL DEFAULT 'prospect'
    CHECK (lifecycle_stage IN ('prospect', 'active', 'former', 'archived')),
  external_references JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (id, workspace_id)
);

CREATE INDEX parties_workspace_name_idx ON parties (workspace_id, display_name);
CREATE INDEX parties_external_references_idx ON parties USING GIN (external_references);

CREATE TABLE person_details (
  party_id UUID PRIMARY KEY REFERENCES parties(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  preferred_name TEXT,
  job_title TEXT
);

CREATE TABLE organization_details (
  party_id UUID PRIMARY KEY REFERENCES parties(id) ON DELETE CASCADE,
  legal_name TEXT,
  website TEXT,
  industry TEXT
);

CREATE TABLE party_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  source_party_id UUID NOT NULL,
  target_party_id UUID NOT NULL,
  relationship_type TEXT NOT NULL,
  role_label TEXT,
  starts_on DATE,
  ends_on DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT party_relationships_distinct_parties
    CHECK (source_party_id <> target_party_id),
  CONSTRAINT party_relationships_source_workspace_fk
    FOREIGN KEY (source_party_id, workspace_id)
    REFERENCES parties (id, workspace_id) ON DELETE CASCADE,
  CONSTRAINT party_relationships_target_workspace_fk
    FOREIGN KEY (target_party_id, workspace_id)
    REFERENCES parties (id, workspace_id) ON DELETE CASCADE
);

CREATE INDEX party_relationships_source_idx
  ON party_relationships (workspace_id, source_party_id);
CREATE INDEX party_relationships_target_idx
  ON party_relationships (workspace_id, target_party_id);

CREATE TABLE offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('product', 'service')),
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (id, workspace_id),
  UNIQUE (workspace_id, name)
);

CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  stage opportunity_stage NOT NULL DEFAULT 'discovery',
  amount NUMERIC(14, 2),
  currency CHAR(3) NOT NULL DEFAULT 'CAD',
  expected_close_on DATE,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  offering_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (id, workspace_id),
  CONSTRAINT opportunities_offering_workspace_fk
    FOREIGN KEY (offering_id, workspace_id)
    REFERENCES offerings (id, workspace_id) ON DELETE RESTRICT
);

CREATE INDEX opportunities_workspace_stage_idx
  ON opportunities (workspace_id, stage, expected_close_on);

CREATE TABLE opportunity_parties (
  opportunity_id UUID NOT NULL,
  party_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'participant',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (opportunity_id, party_id),
  CONSTRAINT opportunity_parties_opportunity_workspace_fk
    FOREIGN KEY (opportunity_id, workspace_id)
    REFERENCES opportunities (id, workspace_id) ON DELETE CASCADE,
  CONSTRAINT opportunity_parties_party_workspace_fk
    FOREIGN KEY (party_id, workspace_id)
    REFERENCES parties (id, workspace_id) ON DELETE CASCADE
);

CREATE TABLE agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status agreement_status NOT NULL DEFAULT 'draft',
  starts_on DATE,
  ends_on DATE,
  value NUMERIC(14, 2),
  currency CHAR(3) NOT NULL DEFAULT 'CAD',
  opportunity_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (id, workspace_id),
  CONSTRAINT agreements_opportunity_workspace_fk
    FOREIGN KEY (opportunity_id, workspace_id)
    REFERENCES opportunities (id, workspace_id) ON DELETE RESTRICT
);

CREATE TABLE agreement_parties (
  agreement_id UUID NOT NULL,
  party_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (agreement_id, party_id),
  CONSTRAINT agreement_parties_agreement_workspace_fk
    FOREIGN KEY (agreement_id, workspace_id)
    REFERENCES agreements (id, workspace_id) ON DELETE CASCADE,
  CONSTRAINT agreement_parties_party_workspace_fk
    FOREIGN KEY (party_id, workspace_id)
    REFERENCES parties (id, workspace_id) ON DELETE CASCADE
);

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  kind activity_kind NOT NULL,
  direction activity_direction NOT NULL DEFAULT 'internal',
  occurred_at TIMESTAMPTZ NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  opportunity_id UUID,
  agreement_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (id, workspace_id),
  CONSTRAINT activities_time_range_valid
    CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at >= starts_at),
  CONSTRAINT activities_opportunity_workspace_fk
    FOREIGN KEY (opportunity_id, workspace_id)
    REFERENCES opportunities (id, workspace_id) ON DELETE RESTRICT,
  CONSTRAINT activities_agreement_workspace_fk
    FOREIGN KEY (agreement_id, workspace_id)
    REFERENCES agreements (id, workspace_id) ON DELETE RESTRICT
);

CREATE INDEX activities_timeline_idx
  ON activities (workspace_id, occurred_at DESC);
CREATE INDEX activities_metadata_idx ON activities USING GIN (metadata);

CREATE TABLE activity_parties (
  activity_id UUID NOT NULL,
  party_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'participant',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (activity_id, party_id),
  CONSTRAINT activity_parties_activity_workspace_fk
    FOREIGN KEY (activity_id, workspace_id)
    REFERENCES activities (id, workspace_id) ON DELETE CASCADE,
  CONSTRAINT activity_parties_party_workspace_fk
    FOREIGN KEY (party_id, workspace_id)
    REFERENCES parties (id, workspace_id) ON DELETE CASCADE
);

CREATE TABLE work_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status work_item_status NOT NULL DEFAULT 'open',
  due_at TIMESTAMPTZ,
  assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
  related_party_id UUID,
  related_opportunity_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  CONSTRAINT work_items_party_workspace_fk
    FOREIGN KEY (related_party_id, workspace_id)
    REFERENCES parties (id, workspace_id) ON DELETE RESTRICT,
  CONSTRAINT work_items_opportunity_workspace_fk
    FOREIGN KEY (related_opportunity_id, workspace_id)
    REFERENCES opportunities (id, workspace_id) ON DELETE RESTRICT
);

CREATE INDEX work_items_open_queue_idx
  ON work_items (workspace_id, status, due_at)
  WHERE status IN ('open', 'in_progress');
