# Canonical CRM Test Suite

**Status:** Proposed

CTS-01 through CTS-25 are the product-level regression contract for semantics, adapters, context, Agents, workflows, policy, and future views. A capability implements only the applicable subset. EVAL-001 is a deterministic CAP-001 subset and cannot be reported as full CTS conformance.

| ID | Canonical question or operation | Required semantic behavior |
| --- | --- | --- |
| CTS-01 | Who are all our customers? | Return People, Companies, and Households holding a contextual Customer Role; do not assume one type. |
| CTS-02 | Who are our customers at Acme? | Traverse Customer Role, Company structure, Relationships, and people with scope/time distinctions. |
| CTS-03 | Is Jane a customer, employee, decision maker, or all three? | Show Party type and concurrent Roles with context, validity, and sources. |
| CTS-04 | What is Acme's organizational structure? | Distinguish divisions/business units, subsidiaries, partners, and legal entities. |
| CTS-05 | Who knows whom at Acme? | Return a provenance-aware relationship graph with ambiguity and access controls. |
| CTS-06 | Prepare me for my call with Jane. | Resolve identity first; fuse minimum authorized facts, activity, knowledge, commercial/service state, Time, Unknowns, Goal, and suggested conversation Plan. |
| CTS-07 | What changed since our last meaningful interaction? | Compare temporal state without treating missing, failed, or denied records as negative facts. |
| CTS-08 | What did we promise Acme? | Traverse Contracts, Deals, Commitments, Messages, WorkItems, responsible Actors, and status. |
| CTS-09 | Which services has Acme bought, considered, or declined? | Keep Offer/Product/Service distinct from Opportunity, Deal, and Contract. |
| CTS-10 | Which opportunities involve services never sold to this company? | Join commercial history/current pipeline under declared completeness and mapping limits. |
| CTS-11 | Which contracts expire in 90 days? | Interpret expiry through Time-domain semantics with source, freshness, and policy. |
| CTS-12 | Show the conversation that led to this proposal. | Reconstruct ordered Conversation from Messages/Activities with consent, provenance, and missingness. |
| CTS-13 | What commitments are outstanding? | Return owner/beneficiary, Goal, WorkItem, due time, state, evidence, and risk/Unknowns. |
| CTS-14 | Which opportunities are losing momentum? | Return a reviewable Insight with declared temporal/activity rule, Signals, exceptions, and limitations. |
| CTS-15 | How has relationship activity changed over six months? | Produce a TimeSeries with provenance, window/denominator, gaps, and no causal overclaim. |
| CTS-16 | How much capacity remains next month? | Combine Availability, Workload, Commitments, Plans, and declared Capacity assumptions. |
| CTS-17 | Why do you think this opportunity is at risk? | Separate Fact, Observation, Interpretation, Hypothesis, Unknown/Conflict, independent evidence dimensions, and Recommendation. |
| CTS-18 | What do we not know before the meeting? | Surface specific Unknowns and evidence-gathering WorkItems without invented completion. |
| CTS-19 | Draft the three highest-priority follow-ups. | Produce a Goal-linked Plan/drafts and rationale under Delegation; do not send. |
| CTS-20 | Send follow-up 1 and create tasks for 2/3. | Use Action lifecycle, independent PolicyDecision, exact Approval, isolated/idempotent execution, verification, audit, Outcome, and compensation. |
| CTS-21 | Update Jane's title from a relationship note. | Detect authority/conflict, propose a governed update, require review, and retain both evidence paths. |
| CTS-22 | Answer the same question over Zoho and Google Sheets. | Preserve Intent/semantics while disclosing mapping, coverage, authority, and capability differences. |
| CTS-23 | Replace Obsidian with a web knowledge repository. | Preserve context/provenance contracts without rewriting Agent/orchestration meaning. |
| CTS-24 | Handle two people named Jane Smith. | Request safe clarification before private retrieval; never merge or disclose protected context. |
| CTS-25 | Handle an action outside policy or evidence. | Deny/defer safely, explain what may be disclosed, preserve audit, and offer escalation without self-expanding authority. |

Future Agent implementations must additionally show which AgentDefinition/version, Goal, Plan, ContextSnapshot, PolicyDecision, Delegation, Handoff, Approval, Action, Outcome, and LearningSignal participated where applicable. Passing fluent-output checks without CTS-17, CTS-18, CTS-21, CTS-24, and CTS-25 is not trusted relationship work.
