import type { IErrorDict } from "../types/error.js";
import type { ApiService } from "../core/api-service.js";
import { safeAwait } from "../core/safe-await.js";

/**
 * Lists values for a dimension key on a given model from the API.
 * @template T - The expected type of the response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class.
 * @param {Record<string, unknown>} [body] - Request body with filter_dict,
 *   exclude_dict, and key.
 * @param {Record<string, string>} [queryParams] - Optional query parameters
 *   (e.g. base_filter_skip).
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the
 *   dimension values or an error.
 *
 * @example
 * const [values, error] = await ListDimensionValuesService<string[]>(
 *   api,
 *   "mymodel",
 *   { key: "region", filter_dict: { is_active: true } },
 * );
 * if (error) console.error("Failed to list dimension values:", error);
 * else console.log("Dimension values:", values);
 */
export const ListDimensionValuesService = async <T>(
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
          `/${normalizedModelClass}/list-dimension-values/`,
          requestBody,
          queryParams,
        )
      : api.request<T>(
          "POST",
          `/${normalizedModelClass}/list-dimension-values/`,
          requestBody,
        ),
  );

  if (error) {
    console.error("==> ListDimensionValuesService ERROR:", error);
    return [null, error];
  }

  return [response, null];
};
