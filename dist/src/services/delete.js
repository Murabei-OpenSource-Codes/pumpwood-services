"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteService = void 0;
const safe_await_js_1 = require("../core/safe-await.js");
/**
 * Deletes an item for a given model from the API.
 * @template T - The expected type of the delete response data (defaults to void).
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to delete from.
 * @param {number} pk - The primary key of the item to delete.
 * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 *
 * @example
 * const [result, error] = await DeleteService(api, "users", 123);
 * if (error) console.error("Failed to delete user:", error);
 * else console.log("User deleted successfully");
 */
const DeleteService = async (api, modelClass, pk, queryParams) => {
    const normalizedModelClass = modelClass.toLowerCase();
    const [response, error] = await (0, safe_await_js_1.safeAwait)(api.request("DELETE", `/${normalizedModelClass}/delete/${String(pk)}/`, undefined, queryParams));
    if (error) {
        console.error("==> DeleteService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.DeleteService = DeleteService;
//# sourceMappingURL=delete.js.map