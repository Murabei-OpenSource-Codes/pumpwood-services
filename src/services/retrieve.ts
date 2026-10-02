import type { IErrorDict } from "../types/error.js";
import type { PumpwoodPk } from "../types/http.js";
import type { ApiService } from "../core/api-service.js";
import { serializePumpwoodPkForPath } from "../core/serialize-pumpwood-pk.js";
import { safeAwait } from "../core/safe-await.js";

/**
 * Retrieves a single item for a given model from the API.
 * @template T - The expected type of the retrieve response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to retrieve from.
 * @param {PumpwoodPk} pk - The primary key of the item to retrieve.
 * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 */
export const RetrieveService = async <T>(
  api: ApiService,
  modelClass: string,
  pk: PumpwoodPk,
  queryParams?: Record<string, string>
): Promise<[T | null, IErrorDict | null]> => {
  const normalizedModelClass = modelClass.toLowerCase();
  const pathPk = encodeURIComponent(serializePumpwoodPkForPath(pk));

  const [response, error] = await safeAwait(
    queryParams
      ? api.request<T>("GET", `/${normalizedModelClass}/retrieve/${pathPk}/`, undefined, queryParams)
      : api.request<T>("GET", `/${normalizedModelClass}/retrieve/${pathPk}/`)
  );

  if (error) {
    console.error("==> RetrieveService ERROR:", error);
    return [null, error];
  }

  return [response, null];
};
