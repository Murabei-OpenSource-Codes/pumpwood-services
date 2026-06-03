import type { IErrorDict } from "../types/error.js";
import type { ApiService } from "../core/api-service.js";
/**
 * Retrieves a single item for a given model from the API.
 * @template T - The expected type of the retrieve response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to retrieve from.
 * @param {number} pk - The primary key of the item to retrieve.
 * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 */
export declare const RetrieveService: <T>(api: ApiService, modelClass: string, pk: number, queryParams?: Record<string, string>) => Promise<[T | null, IErrorDict | null]>;
//# sourceMappingURL=retrieve.d.ts.map