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
    constructor({ baseUrl, token }: ApiServiceConfig);
    request<T = any>(method: HttpMethod, endpoint: string, body?: any): Promise<T>;
}
export declare const ListService: <T>(api: ApiService, modelClass: string) => Promise<[T | null, Error | null]>;
//# sourceMappingURL=index.d.ts.map