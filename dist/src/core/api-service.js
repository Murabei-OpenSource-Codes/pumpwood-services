"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
/**
 * Parses API error response body into an Error with PumpWood fields attached.
 * If the body is valid JSON, all fields are copied dynamically.
 * The 'message' field from JSON is stored as 'apiMessage' to avoid overwriting Error.message.
 */
function parseApiError(status, statusText, errorText) {
    const baseMessage = `API Error: ${status} ${statusText}`;
    try {
        const errorJson = JSON.parse(errorText);
        const error = new Error(baseMessage);
        Object.keys(errorJson).forEach(key => {
            error[key === "message" ? "apiMessage" : key] = errorJson[key];
        });
        return error;
    }
    catch {
        return new Error(`${baseMessage} - ${errorText}`);
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
            throw parseApiError(response.status, response.statusText, errorText);
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
            throw parseApiError(response.status, response.statusText, errorText);
        }
        return response.status === 204 ? null : await response.json();
    }
    /**
     * Performs a file download request.
     * Returns a Blob that allows the caller to manage URL lifecycle (create/revoke).
     * ⚠️ NOT SERIALIZABLE for SSR - blob must be used on the same side (client or server).
     * @param {string} endpoint - The API endpoint to call.
     * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
     * @returns {Promise<IFileData>} A promise that resolves with the file data (blob).
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
            throw parseApiError(response.status, response.statusText, errorText);
        }
        const blob = await response.blob();
        return {
            blob: blob,
            contentType: blob.type,
        };
    }
}
exports.ApiService = ApiService;
//# sourceMappingURL=api-service.js.map