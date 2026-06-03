"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveService = void 0;
const safe_await_js_1 = require("../core/safe-await.js");
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
const SaveService = async (api, modelClass, body, queryParams) => {
    const normalizedModelClass = modelClass.toLowerCase();
    const [response, error] = await (0, safe_await_js_1.safeAwait)(queryParams
        ? api.request("POST", `/${normalizedModelClass}/save/`, body, queryParams)
        : api.request("POST", `/${normalizedModelClass}/save/`, body));
    if (error) {
        console.error("==> SaveService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.SaveService = SaveService;
//# sourceMappingURL=save.js.map