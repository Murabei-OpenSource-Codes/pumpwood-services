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
export async function safeAwait<T, E = Error>(
  promise: Promise<T>,
): Promise<[T, null] | [null, E]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error as E];
  }
}


export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ApiServiceConfig {
  baseUrl: string;
  token: string;
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
   * @returns {Promise<T>} A promise that resolves with the response data.
   * @throws {Error} Throws an error if the baseUrl is not set or if the API request fails.
   */
  async request<T = any>(
    method: HttpMethod,
    endpoint: string,
    body?: any
  ): Promise<T> {
    if (!this.baseUrl) {
      throw new Error(
        "ApiService: baseUrl is missing. Ensure it is provided when creating the ApiService instance."
      );
    }

    /**
     * This replaces the '/' with nothing
     **/
    const url = `${this.baseUrl.replace(/\/$/, "")}/${endpoint.replace(
      /^\//,
      ""
    )}`;
    console.log("==> url: " + url);
    const headers: HeadersInit = {
      Authorization: `Token ${this.token}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.status === 204 ? null as T : await response.json();
  }
}


/**
 * Fetches a list of items for a given model from the API.
 * @template T - The expected type of the list response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to list.
 * @param {Record<any, any>} [body] - Optional request body containing filters, pagination, or other query parameters.
 * @returns {Promise<[T | null, Error | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 * 
 * @example
 * const [users, error] = await ListService<User[]>(api, "users", { limit: 10 });
 * if (error) console.error("Failed to fetch users:", error);
 * else console.log("Users:", users);
 */
export const ListService = async <T>(
  api: ApiService,
  modelClass: string,
  body?: Record<any, any>
): Promise<[T | null, Error | null]> => {

  console.log("==> body", body)

  const [response, error] = await safeAwait(
    api.request<T>("POST", `/${modelClass}/list/`, body)
  );

  if (error) {
    console.error("==> ListService ERROR:", error);
    return [null, error];
  }

  return [response, null];
};


/**
 * Retrieves a single item by its primary key from the API.
 * @template T - The expected type of the retrieved item.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to retrieve from.
 * @param {number} pk - The primary key of the item to retrieve.
 * @returns {Promise<[T | null, Error | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 * 
 * @example
 * const [user, error] = await RetrieveService<User>(api, "users", 123);
 * if (error) console.error("Failed to retrieve user:", error);
 * else console.log("User:", user);
 */
export const RetrieveService = async <T>(
  api: ApiService,
  modelClass: string,
  pk: number
): Promise<[T | null, Error | null]> => {
  const [response, error] = await safeAwait(
    api.request<T>("GET", `/${modelClass}/retrieve/${String(pk)}/`)
  );

  if (error) {
    console.error("==> RetrieveService ERROR:", error);
    return [null, error];
  }

  return [response, null];
};


/**
 * Saves (creates or updates) an item for a given model to the API.
 * @template T - The expected type of the save response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to save to.
 * @param {Record<any, any>} body - The data to be saved (typically includes all item fields).
 * @returns {Promise<[T | null, Error | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 * 
 * @example
 * const [savedUser, error] = await SaveService<User>(api, "users", { name: "John", email: "john@example.com" });
 * if (error) console.error("Failed to save user:", error);
 * else console.log("Saved user:", savedUser);
 */
export const SaveService = async <T>(
  api: ApiService,
  modelClass: string,
  body: Record<any, any>
): Promise<[T | null, Error | null]> => {
  const [response, error] = await safeAwait(
    api.request<T>("POST", `/${modelClass}/save/`, body)
  );

  if (error) {
    console.error("==> SaveService ERROR:", error);
    return [null, error];
  }

  return [response, null];
};


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
export const DeleteService = async <T = void>(
  api: ApiService,
  modelClass: string,
  pk: number
): Promise<[T | null, Error | null]> => {
  const [response, error] = await safeAwait(
    api.request<T>("DELETE", `/${modelClass}/delete/${String(pk)}/`)
  );

  if (error) {
    console.error("==> DeleteService ERROR:", error);
    return [null, error];
  }

  return [response, null];
};
