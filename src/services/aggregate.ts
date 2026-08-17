import type { IErrorDict } from "../types/error.js";
import type { ApiService } from "../core/api-service.js";
import { safeAwait } from "../core/safe-await.js";

/**
 * Runs an aggregation query for a given model from the API.
 * @template T - The expected type of the aggregation response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to aggregate.
 * @param {Record<string, unknown>} body - Request body for the aggregate
 *   operation.
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the
 *   response data or an error, consistent with safeAwait.
 *
 * @example
 * const [rows, error] = await AggregateService<AggregateRow[]>(
 *   api,
 *   "ToLoadCalendar",
 *   {
 *     group_by: ["calendar_id"],
 *     agg: { n: { field: "id", function: "count" } },
 *   },
 * );
 * if (error) console.error("Failed to aggregate:", error);
 * else console.log("Aggregation rows:", rows);
 */
export const AggregateService = async <T>(
  api: ApiService,
  modelClass: string,
  body: Record<string, unknown>,
): Promise<[T | null, IErrorDict | null]> => {
  const normalizedModelClass = modelClass.toLowerCase();

  const [response, error] = await safeAwait(
    api.request<T>("POST", `/${normalizedModelClass}/aggregate/`, body),
  );

  if (error) {
    console.error("==> AggregateService ERROR:", error);
    return [null, error];
  }

  return [response, null];
};
