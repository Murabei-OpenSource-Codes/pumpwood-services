"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListService = void 0;
const safe_await_js_1 = require("../core/safe-await.js");
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
const ListService = async (api, modelClass, body, queryParams) => {
    const requestBody = body || {};
    const normalizedModelClass = modelClass.toLowerCase();
    const [response, error] = await (0, safe_await_js_1.safeAwait)(queryParams
        ? api.request("POST", `/${normalizedModelClass}/list/`, requestBody, queryParams)
        : api.request("POST", `/${normalizedModelClass}/list/`, requestBody));
    if (error) {
        console.error("==> ListService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.ListService = ListService;
//# sourceMappingURL=list.js.map