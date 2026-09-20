# Chatbot experience

**Status:** Provisional

The chatbot is NeoCRM's primary experimental UX, not its source of truth or
policy boundary. Natural language is translated into a typed intent and context
plan. The Relationship Intelligence Layer assembles evidence and returns a
structured response envelope; the chat layer renders it.

For CAP-001 the supported intent is `relationship_brief`. The assistant:

1. extracts the named person;
2. resolves exactly one Party or asks the user to choose among candidates;
3. plans the minimum operational, knowledge, activity, and time sources;
4. makes source failure, denial, and staleness visible;
5. separates evidence-backed facts and observations from hypotheses,
   conflicts, unknowns, and recommendations; and
6. performs no external writes.

Source text is untrusted. A command inside a note or message is quoted or
summarized only as evidence and cannot alter this protocol.

