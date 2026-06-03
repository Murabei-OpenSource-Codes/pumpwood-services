import type { IErrorDict } from "../types/error.js";
import type { ApiService } from "../core/api-service.js";
/**
 * Saves (creates or updates) an item for a given model to the API.
 * @template T - The expected type of the save response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to save to.
 * @param {Record<any, any>} body - The data to be saved (typically includes all item fields).
 * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 *
 * @example
 * const [savedUser, error] = await SaveService<User>(api, "users", { name: "John", email: "john@example.com" });
 * if (error) console.error("Failed to save user:", error);
 * else console.log("Saved user:", savedUser);
 */
export declare const SaveService: <T>(api: ApiService, modelClass: string, body: Record<any, any>, queryParams?: Record<string, string>) => Promise<[T | null, IErrorDict | null]>;
//# sourceMappingURL=save.d.ts.map