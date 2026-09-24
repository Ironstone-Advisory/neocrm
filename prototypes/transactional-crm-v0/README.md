# Transactional CRM v0 archive

**Archive status:** Preserved, non-authoritative, excluded from the active workspace

This directory now contains the original Fastify API, TypeScript domain package, PostgreSQL migration, and historical product/architecture/API/ADR documents. The files remain available for comparison; they are not imported, built, tested, or presented as current NeoCRM.

The prototype is intentionally incompatible with the active model in important ways: it uses `person | organization`, treats prospect as a lifecycle stage, omits Household and contextual multi-role semantics, and lacks the Agent, Goal, Plan, Delegation, ContextSnapshot, PolicyDecision, Consent, full Action lifecycle, Outcome, and LearningSignal model.

Do not deploy the migration or use prototype packages with client data. Reviving any part requires an explicit ADR, mapping to current semantics, safety review, workspace boundary, tests, and evidence.
