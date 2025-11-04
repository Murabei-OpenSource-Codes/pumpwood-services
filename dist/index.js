"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFileService = exports.DeleteService = exports.SaveService = exports.RetrieveFileService = exports.RetrieveService = exports.ListService = exports.ApiService = void 0;
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
     * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
     * @returns {Promise<T>} A promise that resolves with the response data.
     * @throws {Error} Throws an error if the baseUrl is not set or if the API request fails.
     */
    async request(method, endpoint, body, queryParams) {
        if (!this.baseUrl) {
            throw new Error("ApiService: baseUrl is missing. Ensure it is provided when creating the ApiService instance.");
        }
        /**
         * This replaces the '/' with nothing
         **/
        let url = `${this.baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
        // Append query parameters if provided
        if (queryParams && Object.keys(queryParams).length > 0) {
            const queryString = new URLSearchParams(queryParams).toString();
            url = `${url}?${queryString}`;
        }
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
    /**
     * Performs a file upload request using FormData.
     * @template T - The expected type of the response data.
     * @param {string} endpoint - The API endpoint to call.
     * @param {FormData} formData - The FormData containing the file and other data.
     * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
     * @returns {Promise<T>} A promise that resolves with the response data.
     * @throws {Error} Throws an error if the baseUrl is not set or if the API request fails.
     */
    async uploadRequest(endpoint, formData, queryParams) {
        if (!this.baseUrl) {
            throw new Error("ApiService: baseUrl is missing. Ensure it is provided when creating the ApiService instance.");
        }
        let url = `${this.baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
        if (queryParams && Object.keys(queryParams).length > 0) {
            const queryString = new URLSearchParams(queryParams).toString();
            url = `${url}?${queryString}`;
        }
        // Note: Don't set Content-Type header for FormData - browser will set it automatically with boundary
        const headers = {
            Authorization: `Token ${this.token}`,
        };
        const options = {
            method: "POST",
            headers,
            body: formData
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return response.status === 204 ? null : await response.json();
    }
    /**
     * Performs a file download request.
     * @param {string} endpoint - The API endpoint to call.
     * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
     * @returns {Promise<IFileData>} A promise that resolves with the file data (serializável para SSR).
     * @throws {Error} Throws an error if the baseUrl is not set or if the API request fails.
     */
    async fileRequest(endpoint, queryParams) {
        if (!this.baseUrl) {
            throw new Error("ApiService: baseUrl is missing. Ensure it is provided when creating the ApiService instance.");
        }
        let url = `${this.baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
        if (queryParams && Object.keys(queryParams).length > 0) {
            const queryString = new URLSearchParams(queryParams).toString();
            url = `${url}?${queryString}`;
        }
        const headers = {
            Authorization: `Token ${this.token}`,
        };
        const options = {
            method: "GET",
            headers
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        return {
            data: Array.from(new Uint8Array(arrayBuffer)),
            contentType: blob.type,
        };
    }
}
exports.ApiService = ApiService;
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
const ListService = async (api, modelClass, body, queryParams) => {
    const requestBody = body || {};
    const [response, error] = await safeAwait(queryParams
        ? api.request("POST", `/${modelClass}/list/`, requestBody, queryParams)
        : api.request("POST", `/${modelClass}/list/`, requestBody));
    if (error) {
        console.error("==> ListService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.ListService = ListService;
/**
 * Retrieves a single item for a given model from the API.
 * @template T - The expected type of the retrieve response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to retrieve from.
 * @param {number} pk - The primary key of the item to retrieve.
 * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[T | null, Error | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 */
const RetrieveService = async (api, modelClass, pk, queryParams) => {
    // For GET requests, we don't send a body, but we need to pass queryParams as 4th argument
    const [response, error] = await safeAwait(queryParams
        ? api.request("GET", `/${modelClass}/retrieve/${String(pk)}/`, undefined, queryParams)
        : api.request("GET", `/${modelClass}/retrieve/${String(pk)}/`));
    if (error) {
        console.error("==> RetrieveService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.RetrieveService = RetrieveService;
/**
 * Retrieves a file for a given model from the API.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to retrieve from.
 * @param {number} pk - The primary key of the item to retrieve.
 * @param {string} fileField - The name of the file field to retrieve (default: "file").
 * @returns {Promise<[IFileData | null, Error | null]>} A tuple containing the file data (serializável) or an error.
 *
 * @example
 * const [fileData, error] = await RetrieveFileService(api, "documents", 123, "file");
 * if (error) console.error("Failed to retrieve file:", error);
 * else {
 *   const blob = new Blob([new Uint8Array(fileData.data)], { type: fileData.contentType });
 *   const url = URL.createObjectURL(blob);
 *   window.open(url);
 * }
 */
const RetrieveFileService = async (api, modelClass, pk, fileField = "file") => {
    if (!fileField) {
        const error = new Error("RetrieveFileService: fileField is required");
        console.error("==> RetrieveFileService ERROR:", error);
        return [null, error];
    }
    const queryParams = { "file-field": fileField };
    const [response, error] = await safeAwait(api.fileRequest(`/${modelClass}/retrieve-file/${String(pk)}/`, queryParams));
    if (error) {
        console.error("==> RetrieveFileService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.RetrieveFileService = RetrieveFileService;
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
const SaveService = async (api, modelClass, body, queryParams) => {
    const [response, error] = await safeAwait(queryParams
        ? api.request("POST", `/${modelClass}/save/`, body, queryParams)
        : api.request("POST", `/${modelClass}/save/`, body));
    if (error) {
        console.error("==> SaveService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.SaveService = SaveService;
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
const DeleteService = async (api, modelClass, pk) => {
    const [response, error] = await safeAwait(api.request("DELETE", `/${modelClass}/delete/${String(pk)}/`));
    if (error) {
        console.error("==> DeleteService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.DeleteService = DeleteService;
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
const UploadFileService = async (api, modelClass, file, jsonData, queryParams) => {
    if (!file) {
        const error = new Error("UploadFileService: file is required");
        console.error("==> UploadFileService ERROR:", error);
        return [null, error];
    }
    const formData = new FormData();
    formData.append("__json__", JSON.stringify(jsonData));
    formData.append("file", file);
    const [response, error] = await safeAwait(queryParams
        ? api.uploadRequest(`/${modelClass}/save/`, formData, queryParams)
        : api.uploadRequest(`/${modelClass}/save/`, formData));
    if (error) {
        console.error("==> UploadFileService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.UploadFileService = UploadFileService;
//# sourceMappingURL=index.js.map