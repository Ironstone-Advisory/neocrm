# CAP-001: Relationship Brief

**Status:** Provisional

## Outcome

Before a conversation, a user receives a concise, evidence-grounded picture of
the person, their relationships, current commercial context, recent activity,
commitments, relevant knowledge, conflicts, unknowns, and a sensible next
conversation step without naming source systems.

## Scope

CAP-001 supports Person lookup with Company and Household relationship context.
It reads synthetic CRM, notes, email, and calendar sources through capability
contracts. It exposes a structured response and a chat rendering.

It excludes durable memory, source mutation, autonomous follow-up, production
identity/access control, and model-provider-specific behavior.

## Requirements

CAP-001 depends on FR-RES-001, FR-CTX-001, FR-CTX-002, FR-PROV-001,
FR-EPI-001, FR-MEM-001, FR-ACT-002, NFR-REL-001, NFR-OBS-001,
NFR-TEST-001, SAFE-ACT-001, SAFE-APP-001, SAFE-DATA-001, and
SAFE-IDENT-001.

## Decisions and evidence

ADR-0001, ADR-0002, ADR-0003, and ADR-0005 define the implementation boundary.
EXP-006 tests the unified brief after EXP-001 through EXP-005 isolate its major
causal claims. EVAL-001 scores the deterministic fixture.

## Acceptance

CAP-001 is accepted only when all automated checks in
[`acceptance.md`](acceptance.md) pass and a human evaluator scores usefulness
at least 3 of 4 without any safety gate failure.

