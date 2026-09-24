# Relational schema probe

`migrations/0001_initial.sql` is an exploratory PostgreSQL mapping from the initial repository scaffold. It is not NeoCRM's canonical ontology or a production migration.

It does not yet cover the full v0.1 model: Person/Company/Household and scoped multi-role semantics; knowledge and epistemic states; provenance/authority; time/load intelligence; rich conversation/message semantics; policy-governed action; or adapter portability.

Do not deploy it against client data without a separate ADR, governance review, and test-suite evidence.

