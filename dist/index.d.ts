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
     * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
     * @returns {Promise<T>} A promise that resolves with the response data.
     * @throws {Error} Throws an error if the baseUrl is not set or if the API request fails.
     */
    request<T = any>(method: HttpMethod, endpoint: string, body?: any, queryParams?: Record<string, string>): Promise<T>;
    /**
     * Performs a file upload request using FormData.
     * @template T - The expected type of the response data.
     * @param {string} endpoint - The API endpoint to call.
     * @param {FormData} formData - The FormData containing the file and other data.
     * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
     * @returns {Promise<T>} A promise that resolves with the response data.
     * @throws {Error} Throws an error if the baseUrl is not set or if the API request fails.
     */
    uploadRequest<T = any>(endpoint: string, formData: FormData, queryParams?: Record<string, string>): Promise<T>;
}
/**
 * Fetches a list of items for a given model from the API.
 * @template T - The expected type of the list response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to list.
 * @param {any} [body] - Optional request body for the list operation.
 * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[T | null, Error | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 *
 * @example
 * const [users, error] = await ListService<User[]>(api, "users", { limit: 10 });
 * if (error) console.error("Failed to fetch users:", error);
 * else console.log("Users:", users);
 */
export declare const ListService: <T>(api: ApiService, modelClass: string, body?: any, queryParams?: Record<string, string>) => Promise<[T | null, Error | null]>;
/**
 * Retrieves a single item for a given model from the API.
 * @template T - The expected type of the retrieve response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to retrieve from.
 * @param {number} pk - The primary key of the item to retrieve.
 * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[T | null, Error | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 */
export declare const RetrieveService: <T>(api: ApiService, modelClass: string, pk: number, queryParams?: Record<string, string>) => Promise<[T | null, Error | null]>;
/**
 * Saves (creates or updates) an item for a given model to the API.
 * @template T - The expected type of the save response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to save to.
 * @param {Record<any, any>} body - The data to be saved (typically includes all item fields).
 * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[T | null, Error | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 *
 * @example
 * const [savedUser, error] = await SaveService<User>(api, "users", { name: "John", email: "john@example.com" });
 * if (error) console.error("Failed to save user:", error);
 * else console.log("Saved user:", savedUser);
 */
export declare const SaveService: <T>(api: ApiService, modelClass: string, body: Record<any, any>, queryParams?: Record<string, string>) => Promise<[T | null, Error | null]>;
/**
 * Deletes an item for a given model from the API.
 * @template T - The expected type of the delete response data (defaults to void).
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to delete from.
 * @param {number} pk - The primary key of the item to delete.
 * @returns {Promise<[T | null, Error | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 *
 * @example
 * const [result, error] = await DeleteService(api, "users", 123);
 * if (error) console.error("Failed to delete user:", error);
 * else console.log("User deleted successfully");
 */
export declare const DeleteService: <T = void>(api: ApiService, modelClass: string, pk: number) => Promise<[T | null, Error | null]>;
/**
 * Uploads a file with associated JSON data for a given model to the API.
 * @template T - The expected type of the upload response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to upload to.
 * @param {File} file - The file to be uploaded.
 * @param {Record<string, any>} jsonData - Additional JSON data to be sent with the file.
 * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[T | null, Error | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 *
 * @example
 * const file = document.querySelector('input[type="file"]').files[0];
 * const [result, error] = await UploadFileService(
 *   api,
 *   "documents",
 *   file,
 *   { origin: "USER_UPLOAD", format_type: "MELTED" }
 * );
 * if (error) console.error("Failed to upload file:", error);
 * else console.log("File uploaded successfully:", result);
 */
export declare const UploadFileService: <T>(api: ApiService, modelClass: string, file: File, jsonData: Record<string, any>, queryParams?: Record<string, string>) => Promise<[T | null, Error | null]>;
//# sourceMappingURL=index.d.ts.map