import type { IErrorDict } from "../types/error.js";
import type { ApiService } from "../core/api-service.js";
import { safeAwait } from "../core/safe-await.js";

/**
 * Lists dimension keys available for a given model from the API.
 * @template T - The expected type of the response data (default: string[]).
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class.
 * @param {Record<string, unknown>} [body] - Request body with filter_dict
 *   and exclude_dict.
 * @param {Record<string, string>} [queryParams] - Optional query parameters
 *   (e.g. base_filter_skip).
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the
 *   dimension keys or an error.
 *
 * @example
 * const [keys, error] = await ListDimensionsService<string[]>(
 *   api,
 *   "mymodel",
 *   { filter_dict: { is_active: true } },
 * );
 * if (error) console.error("Failed to list dimensions:", error);
 * else console.log("Dimension keys:", keys);
 */
export const ListDimensionsService = async <T>(
  api: ApiService,
  modelClass: string,
  body?: Record<string, unknown>,
  queryParams?: Record<string, string>,
): Promise<[T | null, IErrorDict | null]> => {
  const requestBody = body ?? {};
  const normalizedModelClass = modelClass.toLowerCase();

  const [response, error] = await safeAwait(
    queryParams
      ? api.request<T>(
          "POST",
          `/${normalizedModelClass}/list-dimensions/`,
          requestBody,
          queryParams,
        )
      : api.request<T>(
          "POST",
          `/${normalizedModelClass}/list-dimensions/`,
          requestBody,
        ),
  );

  if (error) {
    console.error("==> ListDimensionsService ERROR:", error);
    return [null, error];
  }

  return [response, null];
};
