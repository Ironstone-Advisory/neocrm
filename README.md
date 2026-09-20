# NeoCRM

> **NeoCRM owns the semantic model, not the storage model.**
>
> **Persistence is replaceable. Intelligence is not.**
>
> **Calendar = View; Time = Domain.**
>
> **NeoCRM doesn't own the world's data. It creates a coherent model of the relationships represented by that data.**

**Status:** v0.1 — experimental semantic architecture.

NeoCRM is an AI-first relationship-intelligence system. It makes relationship data, activity, knowledge, commitments, commercial context, and time useful together—without making any vendor's schema or interface the product's model.

## Architecture at a glance

```mermaid
flowchart TB
    X["Experience layer<br/>ChatGPT • Web • Calendar • Dashboards"]:::experience
    R["Relationship Intelligence Layer<br/>intent • entity resolution • context assembly<br/>semantic routing • memory • provenance • policy • action orchestration"]:::intelligence
    S["Canonical Semantic Core<br/>Party • Relationship • Commercial • Activity • Time • Knowledge • Action"]:::semantic
    A["Replaceable adapters<br/>mapping • authority • retrieval • controlled write-back"]:::adapter
    C["Operational CRM<br/>Zoho • Google Sheets • Salesforce • HubSpot"]:::operational
    K["Knowledge<br/>Obsidian • Markdown • Web research"]:::knowledge
    M["Activity and messaging<br/>Gmail • SMS • WhatsApp • Meetings"]:::activity
    T["Calendar and capacity<br/>Google Calendar • Outlook"]:::time

    X --> R
    R <--> S
    R --> A
    A --> C
    A --> K
    A --> M
    A --> T

    classDef experience fill:#2563eb,stroke:#1e3a8a,color:#ffffff,stroke-width:2px;
    classDef intelligence fill:#7c3aed,stroke:#4c1d95,color:#ffffff,stroke-width:3px;
    classDef semantic fill:#0f766e,stroke:#134e4a,color:#ffffff,stroke-width:3px;
    classDef adapter fill:#64748b,stroke:#334155,color:#ffffff,stroke-width:2px;
    classDef operational fill:#16a34a,stroke:#166534,color:#ffffff,stroke-width:2px;
    classDef knowledge fill:#d97706,stroke:#92400e,color:#ffffff,stroke-width:2px;
    classDef activity fill:#db2777,stroke:#9d174d,color:#ffffff,stroke-width:2px;
    classDef time fill:#0891b2,stroke:#155e75,color:#ffffff,stroke-width:2px;
```

The teal Semantic Core and purple Relationship Intelligence Layer are NeoCRM itself. The surrounding systems are replaceable implementation substrates.

## What v0.1 establishes

- a canonical semantic model for Party, Relationship, Commercial, Activity, Time, Knowledge, and Action;
- the Relationship Intelligence Layer: intent, entity resolution, context assembly, semantic routing, memory, provenance, policy, reasoning, and action orchestration;
- adapters that map systems such as Zoho, Google Sheets, Obsidian, Gmail, SMS/WhatsApp, Google Calendar, and Outlook to the canonical model;
- explicit distinctions between type, role, and relationship—especially Customer as a role available to Person, Company, or Household;
- first-class time, commitments, availability, capacity, workload, and time series; and
- a requirement → ADR → experiment → evidence → revised-design loop.

It does **not** yet claim a final database, public API, production UI, complete security implementation, or autonomous agent. The current API and PostgreSQL material are exploratory implementation probes, not the definition of NeoCRM.

## Start here

1. [Thesis](vision/thesis.md) and [design principles](vision/principles.md).
2. [Canonical semantic model](requirements/semantic-model.md).
3. [Architecture overview](architecture/overview.md) and [colour Mermaid source](architecture/diagrams/layered-architecture.mmd).
4. [Domain concepts](domain/) and [architecture decisions](adr/).
5. [Experiments](experiments/README.md), which turn architecture claims into evidence.

## Repository map

| Directory | Purpose |
| --- | --- |
| [vision/](vision/) | Origin, thesis, principles, and vocabulary |
| [requirements/](requirements/) | Behavioural, quality, and semantic requirements |
| [architecture/](architecture/) | Layered architecture, adapters, provenance/policy, and time |
| [domain/](domain/) | Canonical domain concepts |
| [adr/](adr/) | Architectural Decision Records |
| [experiments/](experiments/) | Testable hypotheses and evidence |
| [research/](research/) | Research curation |
| [apps/](apps/) and [db/](db/) | Non-authoritative implementation probes |
