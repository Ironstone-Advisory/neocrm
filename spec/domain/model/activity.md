# Activity and Conversation

An **Activity** is a canonical record of an interaction or event involving Parties. It is distinct from the communications channel that supplied it.

Examples include email, SMS, WhatsApp, phone call, video meeting, in-person meeting, and CRM activity.

```yaml
activity_id: ACT-10482
type: email
occurred_at: 2026-09-18T14:32:00-04:00
participants: [party:person:example]
channel: gmail
direction: outbound
related_entities: [party:company:example, opportunity:example]
source:
  system: gmail
  native_id: provider-message-id
```

Raw content remains in the source system, subject to policy. NeoCRM retains the semantic representation needed for relationship reasoning.

A **Conversation** groups related activities into an interaction episode. It can include multiple channels when they jointly describe one continuing relationship moment.
