"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrieveService = exports.ListService = exports.ApiService = void 0;
exports.safeAwait = safeAwait;
/**
 * Safely awaits a promise, returning a tuple with either the resolved data or an error.
 * This avoids try/catch blocks and provides type-safe error handling.
 *
 * @template T - The type of the resolved promise value.
 * @template E - The type of the error (defaults to `Error`).
 *
 * @param {Promise<T>} promise - The promise to be awaited.
 *
 * @returns {Promise<[T, null] | [null, E]>} A tuple where:
 *   - First element (`T`) is the resolved data and second is `null` (success),
 *   - OR first element is `null` and second (`E`) is the caught error (failure).
 *
 * @example
 * // Successful resolution:
 * const [data, error] = await safeAwait(fetchData());
 * if (error) console.error("Failed:", error);
 * else console.log("Data:", data);
 *
 * @example
 * // Custom error type:
 * type ApiError = { status: number };
 * const [user, apiError] = await safeAwait<User, ApiError>(getUser());
 */
async function safeAwait(promise) {
    try {
        const data = await promise;
        return [data, null];
    }
    catch (error) {
        return [null, error];
    }
}
class ApiService {
    baseUrl;
    token;
    /**
     * Creates an instance of ApiService.
     * @param {ApiServiceConfig} config - The configuration for the API service.
     * @param {string} config.baseUrl - The base URL of the API.
     * @param {string} config.token - The authentication token.
     */
    constructor({ baseUrl, token }) {
        this.baseUrl = baseUrl;
        this.token = token;
    }
    /**
     * Performs an API request.
     * @template T - The expected type of the response data.
     * @param {HttpMethod} method - The HTTP method for the request.
     * @param {string} endpoint - The API endpoint to call.
     * @param {any} [body] - The request body for POST, PUT requests.
     * @returns {Promise<T>} A promise that resolves with the response data.
     * @throws {Error} Throws an error if the baseUrl is not set or if the API request fails.
     */
    async request(method, endpoint, body) {
        if (!this.baseUrl) {
            throw new Error("ApiService: baseUrl is missing. Ensure it is provided when creating the ApiService instance.");
        }
        /**
         * This removes the '/' with nothing
         **/
        const url = `${this.baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
        console.log("==> url: " + url);
        const headers = {
            Authorization: `Token ${this.token}`,
            "Content-Type": "application/json",
        };
        const options = { method, headers };
        if (body)
            options.body = JSON.stringify(body);
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.status === 204 ? null : await response.json();
    }
}
exports.ApiService = ApiService;
/**
 * Fetches a list of items for a given model from the API.
 * @template T - The expected type of the list response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to list.
 * @returns {Promise<[T | null, Error | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 */
const ListService = async (api, modelClass) => {
    const [response, error] = await safeAwait(api.request("POST", `/${modelClass}/list/`, {}));
    if (error) {
        console.error("==> ListService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.ListService = ListService;
const RetrieveService = async (api, modelClass, pk) => {
    const [response, error] = await safeAwait(api.request("GET", `/${modelClass}/retrieve/${String(pk)}/`));
    if (error) {
        console.error("==> RetrieveService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.RetrieveService = RetrieveService;
//# sourceMappingURL=index.js.map