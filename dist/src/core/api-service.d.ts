import type { HttpMethod, IFileData, ApiServiceConfig } from "../types/http.js";
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
    /**
     * Performs a file download request.
     * Returns a Blob that allows the caller to manage URL lifecycle (create/revoke).
     * ⚠️ NOT SERIALIZABLE for SSR - blob must be used on the same side (client or server).
     * @param {string} endpoint - The API endpoint to call.
     * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
     * @returns {Promise<IFileData>} A promise that resolves with the file data (blob).
     * @throws {Error} Throws an error if the baseUrl is not set or if the API request fails.
     */
    fileRequest(endpoint: string, queryParams?: Record<string, string>): Promise<IFileData>;
    /**
     * Performs a POST request with a JSON body and returns the binary response as a file.
     * Used for actions that generate file downloads (e.g., Excel, PDF exports).
     * ⚠️ NOT SERIALIZABLE for SSR - blob must be used on the same side (client or server).
     * @param {string} endpoint - The API endpoint to call.
     * @param {any} [body] - Optional JSON body for the POST request.
     * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
     * @returns {Promise<IFileData>} A promise that resolves with the file data (blob).
     * @throws {Error} Throws an error if the baseUrl is not set or if the API request fails.
     */
    postFileRequest(endpoint: string, body?: any, queryParams?: Record<string, string>): Promise<IFileData>;
}
//# sourceMappingURL=api-service.d.ts.map