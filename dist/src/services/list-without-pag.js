"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListWithoutPagService = void 0;
const safe_await_js_1 = require("../core/safe-await.js");
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
const ListWithoutPagService = async (api, modelClass, body, queryParams) => {
    const requestBody = body ?? {};
    const normalizedModelClass = modelClass.toLowerCase();
    const [response, error] = await (0, safe_await_js_1.safeAwait)(queryParams
        ? api.request("POST", `/${normalizedModelClass}/list-without-pag/`, requestBody, queryParams)
        : api.request("POST", `/${normalizedModelClass}/list-without-pag/`, requestBody));
    if (error) {
        console.error("==> ListWithoutPagService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.ListWithoutPagService = ListWithoutPagService;
//# sourceMappingURL=list-without-pag.js.map