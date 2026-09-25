# Product definition

**Status:** Accepted product baseline

## Product

NeoCRM is an agent-native relationship-management system in which people and governed specialist agents collaborate toward customer, relationship, service, commercial, and ethical Goals. It assembles shared context across replaceable systems, coordinates work, keeps evidence and uncertainty visible, permits effects only within explicit authority, and evaluates Outcomes to support governed improvement.

The product is not a chatbot over a CRM. Conversation is one Presentation view. The product includes the agent workforce, relationship orchestration, context/data access, shared semantics, hybrid persistence roles, integration boundaries, infrastructure controls, and workspaces required for accountable relationship work.

## Unified functional perspectives

- **Sales:** CustomerNeed, Opportunity, Offer, Deal, Contract, commitment, revenue and customer-value Outcomes.
- **Service:** ServiceCase, request, entitlement, SLA, resolution, commitment, service and customer-effort Outcomes.
- **Marketing/engagement:** Campaign, consented Audience, Journey, Touchpoint/Activity, engagement and trust Outcomes.
- **Shared:** Party, Role, Relationship, Goal, Plan, WorkItem, Activity, Conversation, Time, Knowledge, Policy, Consent, Action, Outcome, and Insight.

These are views over one relationship model, not separate departmental customer silos.

The approved operational portfolio extends these perspectives with Trust Archive, identity/data-quality lifecycle, conversation intelligence, sales execution and planning, semantic metrics/experiments, customer success, content/brand governance, education, and bounded agent operations. It reuses existing semantics before adding objects: buying groups remain Party/Role/Relationship projections, account plans remain Plans, health and qualification remain expiring Insights, and agent value begins as an inspectable projection.

## Operating promise

NeoCRM should help a relationship owner:

1. understand what matters now and why;
2. establish a shared Goal with people and Agents;
3. receive a policy-bounded Plan and specialist contributions;
4. review evidence, uncertainty, conflicts, and customer constraints;
5. approve, perform, or delegate appropriate work;
6. verify effects and capture Outcomes; and
7. improve future work through reviewed LearningSignals.

## Current evidence boundary

The repository currently implements a synthetic deterministic CAP-001 context probe plus a thin, read-only EXP-001 reference path with production-shaped Zoho and Obsidian adapters. The committed evidence is fixture-based: no permissioned live Zoho tenant or private Obsidian vault run has been recorded. The slice performs no production model reasoning, durable memory, proactive work, external writes, multi-Agent collaboration, or production learning. Broader product statements are specifications and hypotheses until independently evidenced.

Accepted experimental authority does not change that evidence boundary. Later experiments may receive scoped, revocable, time-bounded non-delete WriteGrants; each deletion always requires fresh exact human authorization for an immutable target list. No such gateway is implemented in the current slice.
