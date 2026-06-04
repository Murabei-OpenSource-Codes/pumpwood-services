"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrieveOptionsService = void 0;
const safe_await_js_1 = require("../core/safe-await.js");
/**
 * Retrieves the options/metadata for a given model class from the API.
 * Useful for fetching field definitions, choices, and validation rules.
 * @template T - The expected type of the options response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to retrieve options for.
 * @param {Record<string, any>} [body] - Optional body parameters to send in the POST request.
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the options data or an error.
 *
 * @example
 * const [options, error] = await RetrieveOptionsService(api, "descriptiongeoarea");
 * if (error) console.error("Failed to fetch options:", error);
 * else console.log("Field options:", options);
 */
const RetrieveOptionsService = async (api, modelClass, body) => {
    const normalizedModelClass = modelClass.toLowerCase();
    const [response, error] = await (0, safe_await_js_1.safeAwait)(api.request("POST", `/${normalizedModelClass}/retrieve-options/`, body ?? {}));
    if (error) {
        console.error("==> RetrieveOptionsService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.RetrieveOptionsService = RetrieveOptionsService;
//# sourceMappingURL=retrieve-options.js.map