import { createHash } from "node:crypto";

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stable(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

/** Deterministic, collision-resistant and opaque outside the producing boundary. */
export function opaqueId(namespace, ...parts) {
  const digest = createHash("sha256")
    .update(stable([namespace, ...parts]))
    .digest("base64url")
    .slice(0, 24);
  return `${namespace}_${digest}`;
}

export { stable as stableValue };
