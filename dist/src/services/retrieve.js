"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrieveService = void 0;
const safe_await_js_1 = require("../core/safe-await.js");
/**
 * Retrieves a single item for a given model from the API.
 * @template T - The expected type of the retrieve response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to retrieve from.
 * @param {number} pk - The primary key of the item to retrieve.
 * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 */
const RetrieveService = async (api, modelClass, pk, queryParams) => {
    const normalizedModelClass = modelClass.toLowerCase();
    const [response, error] = await (0, safe_await_js_1.safeAwait)(queryParams
        ? api.request("GET", `/${normalizedModelClass}/retrieve/${String(pk)}/`, undefined, queryParams)
        : api.request("GET", `/${normalizedModelClass}/retrieve/${String(pk)}/`));
    if (error) {
        console.error("==> RetrieveService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.RetrieveService = RetrieveService;
//# sourceMappingURL=retrieve.js.map