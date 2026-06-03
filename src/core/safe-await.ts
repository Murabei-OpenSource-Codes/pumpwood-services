import type { IErrorDict } from "../types/error.js";
import { normalizeToErrorDict } from "../types/error.js";

/**
 * Safely awaits a promise, returning a tuple with either the resolved data or an error dictionary.
 * Errors are normalized to the PumpWood IErrorDict format.
 *
 * @template T - The type of the resolved promise value.
 * 
 * @param {Promise<T>} promise - The promise to be awaited.
 * 
 * @returns {Promise<[T, null] | [null, IErrorDict]>} A tuple where:
 *   - First element (`T`) is the resolved data and second is `null` (success),
 *   - OR first element is `null` and second (`IErrorDict`) is the normalized error (failure).
 *
 * @example
 * const [data, error] = await safeAwait(fetchData());
 * if (error) console.error("Failed:", error.message);
 * else console.log("Data:", data);
 */
export async function safeAwait<T>(
  promise: Promise<T>,
): Promise<[T, null] | [null, IErrorDict]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, normalizeToErrorDict(error)];
  }
}
