import type { IErrorDict } from "../types/error.js";
import type { ApiService } from "../core/api-service.js";
/**
 * Deletes an item for a given model from the API.
 * @template T - The expected type of the delete response data (defaults to void).
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to delete from.
 * @param {number} pk - The primary key of the item to delete.
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 *
 * @example
 * const [result, error] = await DeleteService(api, "users", 123);
 * if (error) console.error("Failed to delete user:", error);
 * else console.log("User deleted successfully");
 */
export declare const DeleteService: <T = void>(api: ApiService, modelClass: string, pk: number) => Promise<[T | null, IErrorDict | null]>;
//# sourceMappingURL=delete.d.ts.map