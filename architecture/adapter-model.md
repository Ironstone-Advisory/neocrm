# Adapter Model

An adapter maps between an external system and NeoCRM's canonical semantics. It does not transfer ownership of those semantics to the external system.

## Adapter domains

| Domain | Question answered | Example sources |
| --- | --- | --- |
| Operational | Who and what is formally recorded? | Zoho, Salesforce, ERP, spreadsheets |
| Knowledge | What is known, observed, or hypothesized? | Markdown, Obsidian, research repository |
| Activity | What interactions occurred? | Gmail, SMS, WhatsApp, calls, meetings |
| Calendar | What is planned, available, or overloaded? | Google Calendar, Outlook |
| Action | What should be changed or sent? | Email, messaging, tasks, calendar invitations |

## Adapter contract

Each adapter should expose:

- capability declaration and authorization scope;
- native-to-canonical mapping;
- source identifiers and retrieval timestamps;
- read, propose, and execute boundaries;
- error, freshness, and partial-result semantics;
- write-back and audit behaviour where applicable.

## Non-goal

Adapters are not miniature copies of each other. An adapter may expose only the capabilities its source supports. The canonical layer must make those limitations explicit rather than hiding them.
