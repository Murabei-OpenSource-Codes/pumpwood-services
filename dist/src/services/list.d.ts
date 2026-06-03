import type { IErrorDict } from "../types/error.js";
import type { ApiService } from "../core/api-service.js";
/**
 * Fetches a list of items for a given model from the API.
 * @template T - The expected type of the list response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to list.
 * @param {any} [body] - Optional request body for the list operation.
 * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 *
 * @example
 * const [users, error] = await ListService<User[]>(api, "users", { limit: 10 });
 * if (error) console.error("Failed to fetch users:", error);
 * else console.log("Users:", users);
 */
export declare const ListService: <T>(api: ApiService, modelClass: string, body?: any, queryParams?: Record<string, string>) => Promise<[T | null, IErrorDict | null]>;
//# sourceMappingURL=list.d.ts.map