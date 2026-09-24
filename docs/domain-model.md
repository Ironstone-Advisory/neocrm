# Historical relational model

This document previously described a relational v0.1 model. It is retained only as a database-prototype reference.

The authoritative NeoCRM model is semantic rather than storage-led. Read [the canonical semantic model](../requirements/semantic-model.md) and the detailed [domain documents](../domain/).

In particular, the prototype must not override these rules:

- Person, Company, and Household are Party types.
- Customer is a role, not a Party type.
- Roles, relationships, and types are distinct.
- Time, knowledge/provenance, and action policy are first-class domains.
- Adapters map implementations to canonical meaning; they do not define it.

