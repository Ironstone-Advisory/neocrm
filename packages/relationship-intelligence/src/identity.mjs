import { assertContract } from "../../contracts/src/runtime.mjs";

export async function resolveIdentity({ identityResolver, query, selectedPartyId }) {
  if (!identityResolver || typeof identityResolver.resolve !== "function") {
    throw new TypeError("An identity resolver with resolve() is required.");
  }
  const result = assertContract(
    "IdentityResolutionResult",
    await identityResolver.resolve({ query, selectedPartyId })
  );
  if (
    result.status === "resolved" &&
    !result.candidates.some((candidate) => candidate.partyId === result.selectedPartyId)
  ) {
    const error = new Error("Identity resolver selected a Party outside its candidate set.");
    error.code = "IDENTITY_RESULT_INCONSISTENT";
    throw error;
  }
  return result;
}
