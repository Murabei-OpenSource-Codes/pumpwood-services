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
export declare function safeAwait<T, E = Error>(promise: Promise<T>): Promise<[T, null] | [null, E]>;
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
export interface ApiServiceConfig {
    baseUrl: string;
    token: string;
}
export declare class ApiService {
    private baseUrl;
    private token;
    /**
     * Creates an instance of ApiService.
     * @param {ApiServiceConfig} config - The configuration for the API service.
     * @param {string} config.baseUrl - The base URL of the API.
     * @param {string} config.token - The authentication token.
     */
    constructor({ baseUrl, token }: ApiServiceConfig);
    /**
     * Performs an API request.
     * @template T - The expected type of the response data.
     * @param {HttpMethod} method - The HTTP method for the request.
     * @param {string} endpoint - The API endpoint to call.
     * @param {any} [body] - The request body for POST, PUT requests.
     * @returns {Promise<T>} A promise that resolves with the response data.
     * @throws {Error} Throws an error if the baseUrl is not set or if the API request fails.
     */
    request<T = any>(method: HttpMethod, endpoint: string, body?: any): Promise<T>;
}
/**
 * Fetches a list of items for a given model from the API.
 * @template T - The expected type of the list response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to list.
 * @returns {Promise<[T | null, Error | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 */
export declare const ListService: <T>(api: ApiService, modelClass: string) => Promise<[T | null, Error | null]>;
export declare const RetrieveService: <T>(api: ApiService, modelClass: string, pk: number) => Promise<[T | null, Error | null]>;
//# sourceMappingURL=index.d.ts.map