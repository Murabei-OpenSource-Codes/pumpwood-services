import type { IErrorDict } from "../types/error.js";
import type { ApiService } from "../core/api-service.js";
/**
 * Fetches all items for a given model without pagination.
 * Use for small datasets (comments, versions, lookups) where pagination is not needed.
 * @template T - The expected type of the response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to list.
 * @param {any} [body] - Optional request body (filter_dict, fields, order_by, etc.).
 * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the response data or an error.
 *
 * @example
 * const [items, error] = await ListWithoutPagService(api, "descriptiongeoarea", {
 *   filter_dict: { is_active: true },
 *   fields: ["pk", "name"],
 *   order_by: ["name"],
 * });
 * if (error) console.error("Failed to fetch items:", error);
 * else console.log("Items:", items);
 */
export declare const ListWithoutPagService: <T>(api: ApiService, modelClass: string, body?: any, queryParams?: Record<string, string>) => Promise<[T | null, IErrorDict | null]>;
//# sourceMappingURL=list-without-pag.d.ts.map