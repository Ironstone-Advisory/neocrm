# Value models and pricing implications

**Status:** Product hypothesis; not an approved package or price list  
**Currency:** Public competitor anchors are USD unless noted

## Principle

NeoCRM should charge for useful, understandable work without monetizing trust as an optional extra.

Identity controls, provenance, consent, policy evaluation, plain-language action history, user correction, basic export/deletion, spend visibility, and safe approval behavior are product-integrity requirements. They belong in the core. Advanced regulated retention, legal hold, supervisory reporting, specialized data, high-volume execution, and sophisticated analytics can be value-add capabilities.

This is a packaging hypothesis for a future product, not a statement that CAP-001 implements these capabilities or that the canonical roadmap has adopted them. Any semantic extension or delivery commitment requires Rob's review and a separate traceable decision.

## Market packaging patterns

| Pattern | Examples | Benefit | Buyer risk | NeoCRM implication |
|---|---|---|---|---|
| Per-seat plus product modules | HubSpot, Salesforce, Microsoft, Zoho, Freshworks, Creatio | Familiar and budgetable | Functional fragmentation and multiple minimums | Use a simple base workspace plus coherent outcome-oriented modules, not a fee for every object or view. |
| Seat or edition plus AI/action credits | HubSpot, Salesforce, Microsoft, Attio, Apollo, Outreach, Creatio | Aligns price with variable compute/action volume | Credits can hide unit economics and cause surprise overage | Show a real unit such as “relationship brief,” “meeting processed,” or “approved external action,” with estimated and actual cost in the action ledger. |
| Contact, profile, or audience volume | ActiveCampaign, Braze, Marketing Cloud, Customer Insights | Fits high-volume marketing | Penalizes responsible retention and can blur active versus stored people | Avoid as the core relationship-system metric; reserve for marketing execution/data services whose cost truly scales with active audience. |
| Outcome or resolution pricing | Intercom; selected service-agent offers | Easy business-value story | Vendor-defined outcomes can misattribute value or reward premature closure | Use only for objectively measurable Outcomes with exclusions, dispute rules, and attribution limits. Never price on clicks, replies, or opaque “engagement.” |
| Data/enrichment credits | Apollo, Clay, 6sense, HubSpot | Maps to licensed external data | Can encourage unnecessary collection and obscure source quality | Keep external-data consumption separate, source-attributed, optional, and subject to minimization and legal-purpose checks. |
| Custom platform fee | Gong, Outreach, Salesloft/Clari Forecast, Demandbase, Braze, Marketo | Supports enterprise implementation and scale | Low transparency and poor SMB fit | Publish entry assumptions and a usage estimator for the SMB/mid-market offer. |

## Public reference points

These are comparison anchors, not normalized total-cost estimates.

| Product | Public anchor at the research cutoff | Commercial shape |
|---|---|---|
| HubSpot | Sales Starter $7/seat/month annually; Pro $90; Enterprise $150; additional credits $9/1,000 when paid annually. [Pricing](https://www.hubspot.com/pricing/sales?tab=tab-billing), [credits](https://www.hubspot.com/products/artificial-intelligence/credits) | Hub/seat subscription plus included and purchased credits; some onboarding fees. |
| Zoho CRM / One | CRM annual $14/$23/$40/$52 per user/month; Zoho One $37/employee or $90/named user. [CRM](https://www.zoho.com/crm/zohocrm-pricing.html), [One](https://www.zoho.com/one/pricing/) | Low-cost seat/edition or broad suite. |
| Attio | Free; Plus $35; Pro $79 per seat/month annually; 5,000 extra credits $70/month annually. [Pricing](https://attio.com/pricing/usd) | Seat/edition plus workspace/user credits. |
| Apollo | Free; $49/$79/$119 per user/month annually with tiered credits. [Pricing](https://www.apollo.io/pricing) | Seat plus data/action/conversation limits and add-ons. |
| Salesforce | Sales $25–$550 per user/month; Agentforce Sales from $125; Flex Credits $500/100,000, normally $0.10 per standard action. [Sales](https://www.salesforce.com/sales/pricing/?bc=OTH&region=united-states), [Agentforce](https://www.salesforce.com/agentforce/pricing/) | Seats, editions, clouds, add-ons, credits, and selected conversation/outcome units. |
| Microsoft Dynamics 365 | Sales $65/$105/$150 per user/month; Customer Insights $1,700/tenant/month; Copilot Studio $200/25,000 credits. [Sales](https://www.microsoft.com/en-us/dynamics-365/products/sales), [Customer Insights](https://www.microsoft.com/en-us/dynamics-365/products/customer-insights/pricing), [Copilot Studio](https://www.microsoft.com/licensing/guidance/Microsoft-Copilot-Studio) | Seats plus tenant capacity and agent credits. |
| Creatio | Public guidance starts at $40 platform plus $15 per CRM application per user/month; AI packages and minimum terms may apply. [Pricing guidance](https://www.creatio.com/glossary/crm-pricing) | Platform plus app seats plus AI credits. |
| Freshworks | Freshsales $9/$39/$59 per user/month annually; Freshdesk Omni $29/$79/$119; service AI Agent $49/100 sessions after allowance. [Sales](https://www.freshworks.com/crm/pricing/), [Service](https://www.freshworks.com/freshdesk/omni/pricing/) | Seats plus sessions and copilot add-ons. |
| Intercom | Annual Essential $29, Advanced $85, Expert $132 per seat/month; Fin uses outcome pricing such as a resolved conversation. [Plans](https://www.intercom.com/help/en/articles/9061614-fin-and-intercom-plans-explained), [outcomes](https://www.intercom.com/help/en/articles/8205718-fin-ai-agent-outcomes) | Seats plus defined AI outcomes. |
| Braze | Custom, based on platform edition, monthly active users, and Action Credits. [Pricing](https://www.braze.com/pricing) | Platform, audience scale, channels, and action credits. |
| ActiveCampaign | Starts at $15 for under 1,000 contacts; higher marketing tiers and add-ons vary. [Pricing](https://www.activecampaign.com/pricing), [FAQ](https://www.activecampaign.com/about/faq) | Contact volume plus tier/modules. |

## Recommended product-value architecture

### Core: Relationship Control Plane

This is the product, not an add-on.

- conversational relationship workspace;
- Party, Role, Relationship, Activity, Conversation, Time, Commitment, commercial/service, and Goal/Plan views;
- minimum-necessary context assembly across replaceable adapters;
- identity resolution and visible data-quality conflicts;
- evidence, provenance, freshness, uncertainty, correction, and source gaps;
- Consent, Preference, PolicyDecision, Delegation, Approval, and governed Action lifecycle;
- plain-language and structured action/audit history;
- basic budget, usage, cost, and failure visibility;
- user-owned export, correction, deletion, and portability;
- Levels 0–2 autonomy.

Safety and explainability must not be removed from a lower-priced plan.

### Value-add 1: Sales Intelligence & Follow-Through

**Job:** Keep a small B2B team prepared, consistent, and responsive without surrendering judgment.

- conversation/meeting evidence and commitment extraction;
- relationship and buying-group briefs;
- explainable qualification and opportunity risk;
- next-best relationship action;
- consent-aware follow-up drafts;
- playbooks, sequences, cadence stop rules, and typed handoffs;
- account and mutual action plans;
- optional low-risk Zoho action execution after approval.

**Likely value metric:** active relationship owner plus processed conversations and approved actions—not emails sent.

### Value-add 2: Intelligent Marketing Follow

**Job:** Continue relevant engagement based on relationship state, not merely list membership.

- campaign briefs, audiences, key messages, assets, and variants;
- relationship-aware triggers and adaptive journeys;
- inbound conversational qualification and handoff;
- channel/time recommendations, contact limits, suppression, and deliberate non-action;
- experiments, holdouts, assignment, and honest attribution;
- customer and business Outcome balancing.

**Likely value metric:** active audience or evaluated journey plus actual agent work; consent and suppression remain core controls.

### Value-add 3: Revenue Analytics & Planning

**Job:** Help an owner understand pipeline, uncertainty, capacity, and scenarios in dialogue.

- semantic metric catalogue and natural-language “show work” analysis;
- pipeline movement, opportunity risk, and evidence gaps;
- forecast scenarios, submissions, ranges, and back-testing;
- anomaly detection and causal experiment reporting;
- territory, assignment, quota, and work-balance extensions when justified.

**Likely value metric:** organization/workspace capacity rather than per-query charges for ordinary analysis.

### Value-add 4: Trust Archive & Advanced Compliance

**Job:** Prove what happened and apply records obligations without turning logs into a technical dumping ground.

- immutable machine events linked to readable receipts;
- record snapshots and archive packages;
- retention schedules, legal holds, disposition review, proof, and regulated exports;
- consent evidence archive;
- supervisory search and exception reporting;
- jurisdiction-specific policies and evidence packs.

**Boundary:** A readable action history and basic retention/export/delete controls remain core. The module adds regulated records-management depth.

### Value-add 5: Education & Enablement

**Job:** Improve human and customer capability in the flow of work.

- competencies and skill evidence;
- contextual coaching and reviewed call moments;
- role-play/simulation and certification;
- employee onboarding and playbook education;
- customer onboarding, education paths, and learning Outcomes.

**Likely value metric:** learner/coach seats or programs; prohibit opaque employee-surveillance scoring.

### Value-add 6: Agent Operations & Active Management

**Job:** Operate a portfolio of agents safely, economically, and measurably.

- agent definitions, skills, versions, tests, and controlled releases;
- session/run/tool/policy traces and replay;
- spend forecasts, budgets, service levels, incidents, and value ledger;
- simulation, shadow mode, dry runs, and compensation;
- exception detection, supervisor recommendations, and work redistribution;
- later bounded Level-3 execution.

**Likely value metric:** included baseline runs plus transparent, action-specific usage. Never charge an inscrutable number of credits without a unit explanation.

### Value-add 7: Data & Signal Fabric

**Job:** Add trustworthy external and behavioral signals without losing provenance or control.

- enrichment and identity-reconciliation proposals;
- intent, job-change, web, product, billing, and service signals;
- source licensing, collection window, freshness/decay, confidence, and subject scope;
- optional data-provider costs separated from NeoCRM processing;
- mapping, sync receipts, and reversible write-back.

**Likely value metric:** connected source and licensed data/action units.

### Value-add 8: Customer Success & Service Guard

**Job:** Carry relationship meaning through onboarding, support, adoption, renewal, and expansion.

- entitlement/subscription/usage signals;
- success plans, health Insights, onboarding and renewal workflows;
- case and knowledge context;
- resolution recommendations, escalation, and customer-effort Outcomes;
- knowledge-gap and service-quality learning.

**Likely value metric:** managed customer relationship/account or service user—not opaque “health points.”

### Optional later: Commercial Operations

Catalog, CPQ, pricing, quote, approval, order, invoice, payment, subscription billing, and commerce should initially remain external adapter capabilities. Add semantic extensions only when experiments show that NeoCRM must reason over them. Autonomous pricing, negotiation, or contracting is not a v0.1 capability.

## Recommended commercial model

Use a hybrid with four transparent layers:

1. **Base organization subscription** for the Relationship Control Plane, governance, audit, and a useful included capacity.
2. **Named or active-user pricing** for collaborative workspaces where human users receive ongoing value.
3. **Outcome-oriented modules** for distinct value models such as Sales Follow-Through, Marketing Follow, Trust Archive, or Agent Operations.
4. **Metered variable work** only where provider/compute/channel costs genuinely vary, shown in a human-readable usage and value ledger.

Each metered action should expose:

- the unit name and customer job;
- estimated cost before execution;
- included versus chargeable quantity;
- actual cost after completion;
- source/model/tool contribution;
- whether work completed, failed, was rejected, or was reversed;
- linked Outcome and attribution limitations;
- budget threshold, alert, pause, and hard-stop controls.

## Outcome pricing rule

Outcome pricing is acceptable only when all of these are true:

- the Outcome is objectively defined before work begins;
- NeoCRM's contribution can be distinguished from other causes with declared limits;
- the customer can inspect and dispute the evidence;
- safety, consent, escalation, or human review does not reduce the vendor's incentive to behave correctly;
- a premature closure, reply, click, meeting, or model-generated classification is not treated as business value;
- negative and unintended Outcomes remain visible.

Good candidates may eventually include a verified service resolution under an agreed definition or an approved, completed, and verified administrative action. Revenue attribution is generally too multi-causal for simple outcome pricing.

## Pricing tests before launch

1. Can a five-person firm predict next month's bill without understanding model tokens or abstract credits?
2. Can a mid-market administrator cap spend by agent, feature, action type, source, and team?
3. Does the user see cost before approving an action?
4. Do failed, denied, duplicated, or rolled-back actions consume capacity, and is that rule explicit?
5. Are trust, consent, provenance, audit, correction, and basic export/delete available in every plan?
6. Can the user compare cost per accepted recommendation, verified action, and observed Outcome?
7. Can the product downgrade to a cheaper model or human workflow within policy rather than stop unexpectedly?
8. Are third-party data charges distinguishable from NeoCRM agent work?
