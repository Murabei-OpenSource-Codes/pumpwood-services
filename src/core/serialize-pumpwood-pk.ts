import type { PumpwoodPk } from "../types/http.js";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validatePrimaryKeyDict(primaryKeyDict: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(primaryKeyDict)) {
    if (typeof value === "object" && value !== null) {
      throw new Error(
        "primary_key_dict must be a flat dictionary. Nested type found at key [{key}]".replace(
          "{key}",
          key,
        ),
      );
    }
  }
}

/**
 * Encode a flat primary-key dict to a base64url string (pumpwood-communication
 * CompositePkBase64Converter.dump_dict).
 */
export function dumpPumpwoodPkDict(primaryKeyDict: Record<string, unknown>): string {
  validatePrimaryKeyDict(primaryKeyDict);
  const json = JSON.stringify(primaryKeyDict);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_");
}

/**
 * Serialize pk for use in retrieve/delete URL path segments.
 */
export function serializePumpwoodPkForPath(pk: PumpwoodPk): string {
  if (typeof pk === "number") {
    return String(pk);
  }
  if (typeof pk === "string") {
    return pk;
  }
  if (isPlainObject(pk)) {
    return dumpPumpwoodPkDict(pk);
  }
  throw new Error(
    "Retrieve pk must be a number, string, or dict, got type [{type}]".replace(
      "{type}",
      typeof pk,
    ),
  );
}
