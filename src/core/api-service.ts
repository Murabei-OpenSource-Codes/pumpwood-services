import type { HttpMethod, IFileData, ApiServiceConfig } from "../types/http.js";

/**
 * Parses API error response body into an Error with PumpWood fields attached.
 * If the body is valid JSON, all fields are copied dynamically.
 * The 'message' field from JSON is stored as 'apiMessage' to avoid overwriting Error.message.
 */
function parseApiError(status: number, statusText: string, errorText: string): Error {
  const baseMessage = `API Error: ${status} ${statusText}`;

  try {
    const errorJson = JSON.parse(errorText);
    const error = new Error(baseMessage) as Error & Record<string, any>;

    Object.keys(errorJson).forEach(key => {
      error[key === "message" ? "apiMessage" : key] = errorJson[key];
    });

    return error;
  } catch {
    return new Error(`${baseMessage} - ${errorText}`);
  }
}

export class ApiService {
  private baseUrl: string;
  private token: string;

  /**
   * Creates an instance of ApiService.
   * @param {ApiServiceConfig} config - The configuration for the API service.
   * @param {string} config.baseUrl - The base URL of the API.
   * @param {string} config.token - The authentication token.
   */
  constructor({ baseUrl, token }: ApiServiceConfig) {
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
  async request<T = any>(
    method: HttpMethod,
    endpoint: string,
    body?: any,
    queryParams?: Record<string, string>
  ): Promise<T> {
    if (!this.baseUrl) {
      throw new Error(
        "ApiService: baseUrl is missing. Ensure it is provided when creating the ApiService instance."
      );
    }

    /**
     * This replaces the '/' with nothing
     **/
    let url = `${this.baseUrl.replace(/\/$/, "")}/${endpoint.replace(
      /^\//,
      ""
    )}`;

    if (queryParams && Object.keys(queryParams).length > 0) {
      const queryString = new URLSearchParams(queryParams).toString();
      url = `${url}?${queryString}`;
    }

    const headers: HeadersInit = {
      Authorization: `Token ${this.token}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw parseApiError(response.status, response.statusText, errorText);
    }

    return response.status === 204 ? null as T : await response.json();
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
  async uploadRequest<T = any>(
    endpoint: string,
    formData: FormData,
    queryParams?: Record<string, string>
  ): Promise<T> {
    if (!this.baseUrl) {
      throw new Error(
        "ApiService: baseUrl is missing. Ensure it is provided when creating the ApiService instance."
      );
    }

    let url = `${this.baseUrl.replace(/\/$/, "")}/${endpoint.replace(
      /^\//,
      ""
    )}`;

    if (queryParams && Object.keys(queryParams).length > 0) {
      const queryString = new URLSearchParams(queryParams).toString();
      url = `${url}?${queryString}`;
    }

    // Note: Don't set Content-Type header for FormData - browser will set it automatically with boundary
    const headers: HeadersInit = {
      Authorization: `Token ${this.token}`,
    };

    const options: RequestInit = {
      method: "POST",
      headers,
      body: formData
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw parseApiError(response.status, response.statusText, errorText);
    }

    return response.status === 204 ? null as T : await response.json();
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
  async fileRequest(
    endpoint: string,
    queryParams?: Record<string, string>
  ): Promise<IFileData> {
    if (!this.baseUrl) {
      throw new Error(
        "ApiService: baseUrl is missing. Ensure it is provided when creating the ApiService instance."
      );
    }

    let url = `${this.baseUrl.replace(/\/$/, "")}/${endpoint.replace(
      /^\//,
      ""
    )}`;

    if (queryParams && Object.keys(queryParams).length > 0) {
      const queryString = new URLSearchParams(queryParams).toString();
      url = `${url}?${queryString}`;
    }

    const headers: HeadersInit = {
      Authorization: `Token ${this.token}`,
    };

    const options: RequestInit = {
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
  async postFileRequest(
    endpoint: string,
    body?: any,
    queryParams?: Record<string, string>
  ): Promise<IFileData> {
    if (!this.baseUrl) {
      throw new Error(
        "ApiService: baseUrl is missing. Ensure it is provided when creating the ApiService instance."
      );
    }

    let url = `${this.baseUrl.replace(/\/$/, "")}/${endpoint.replace(
      /^\//,
      ""
    )}`;

    if (queryParams && Object.keys(queryParams).length > 0) {
      const queryString = new URLSearchParams(queryParams).toString();
      url = `${url}?${queryString}`;
    }

    const headers: HeadersInit = {
      Authorization: `Token ${this.token}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method: "POST",
      headers,
      ...(body !== undefined && { body: JSON.stringify(body) }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw parseApiError(response.status, response.statusText, errorText);
    }

    const blob = await response.blob();

    return {
      blob,
      contentType: blob.type,
    };
  }
}
