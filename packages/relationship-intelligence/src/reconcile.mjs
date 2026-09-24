import { createAssertion } from "./assertions.mjs";
import { stableValue } from "./ids.mjs";

function plainName(predicate) {
  return predicate.split(".").at(-1).replaceAll("_", " ");
}

export function reconcileAssertions(assertions) {
  const byPredicate = Map.groupBy(assertions, (assertion) => assertion.predicate);
  const conflicts = [];
  for (const [predicate, candidates] of byPredicate) {
    const active = candidates.filter((candidate) => candidate.status === "active");
    const values = new Map(active.map((candidate) => [stableValue(candidate.value), candidate.value]));
    if (values.size < 2) continue;
    const inputs = active.map((candidate) => candidate.assertionId);
    conflicts.push(
      createAssertion({
        kind: "conflict",
        predicate: `conflict.${predicate}`,
        value: [...values.values()],
        text: `Sources disagree about ${plainName(predicate)}: ${[...values.values()]
          .map(String)
          .join(" versus ")}.`,
        confidence: Math.min(...active.map((candidate) => candidate.confidence)),
        evidenceIds: active.flatMap((candidate) => candidate.evidenceIds),
        inputAssertionIds: inputs,
        transformationId: "reconcile-distinct-values-v1"
      })
    );
  }
  return { assertions, conflicts };
}
