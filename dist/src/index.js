"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListService = exports.ApiService = void 0;
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
    constructor({ baseUrl, token }) {
        this.baseUrl = baseUrl;
        this.token = token;
    }
    async request(method, endpoint, body) {
        const url = `${this.baseUrl}${endpoint}`;
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
const ListService = async (api, modelClass) => {
    const [response, error] = await safeAwait(api.request("POST", `/${modelClass}/list/`, {}));
    if (error) {
        console.error("==> ListService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.ListService = ListService;
