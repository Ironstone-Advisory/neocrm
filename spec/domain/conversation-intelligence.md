# Conversation intelligence

**Status:** Accepted specification; Planned implementation and evidence

- **OBJ-089 TranscriptSegment** — bounded source span with Conversation/Message/recording reference, exact offsets or timestamps, captured text or protected content reference, language, provenance, access classification, and retention.
- **OBJ-090 SpeakerAttribution** — proposed or confirmed mapping of a segment to Party/Actor/unknown speaker with method, evidence, confidence semantics, alternatives, and human disposition.
- **OBJ-091 ExtractionProposal** — versioned proposal for a claim, need, objection, risk, relationship change, next step, or other canonical assertion, linked to exact source segments, model/rule version, uncertainty, counter-evidence, status, and reviewer.
- **OBJ-092 CommitmentCandidate** — proposed Commitment with promisor, beneficiary, action/result, due/condition, evidence spans, ambiguity, conflicts, and accept/correct/reject state. Only accepted promotion creates or changes a canonical Commitment.

Raw transcripts are not automatically durable memory. Source permission, purpose, consent/notice, classification, retention, correction, and deletion rules apply independently from extraction quality.
