import type { IErrorDict } from "../types/error.js";
import type { ApiService } from "../core/api-service.js";
import { safeAwait } from "../core/safe-await.js";

/**
 * Retrieves the options/metadata for a given model class from the API.
 * Useful for fetching field definitions, choices, and validation rules.
 * @template T - The expected type of the options response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to retrieve options for.
 * @param {Record<string, any>} [body] - Optional body parameters to send in the POST request.
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the options data or an error.
 *
 * @example
 * const [options, error] = await RetrieveOptionsService(api, "descriptiongeoarea");
 * if (error) console.error("Failed to fetch options:", error);
 * else console.log("Field options:", options);
 */
export const RetrieveOptionsService = async <T>(
  api: ApiService,
  modelClass: string,
  body?: Record<string, any>
): Promise<[T | null, IErrorDict | null]> => {
  const normalizedModelClass = modelClass.toLowerCase();

  const [response, error] = await safeAwait(
    api.request<T>("POST", `/${normalizedModelClass}/retrieve-options/`, body ?? {})
  );

  if (error) {
    console.error("==> RetrieveOptionsService ERROR:", error);
    return [null, error];
  }

  return [response, null];
};
