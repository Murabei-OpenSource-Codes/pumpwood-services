import type { IErrorDict } from "../types/error.js";
import type { ILoginResult } from "../types/http.js";
import { safeAwait } from "../core/safe-await.js";
import { createHttpError, normalizeToErrorDict } from "../types/error.js";

/**
 * Authenticates with username and password against the Pumpwood login endpoint.
 *
 * @param {string} baseUrl - The base URL of the API (e.g. "https://api.example.com").
 * @param {object} credentials - The login credentials.
 * @param {string} credentials.username - The username.
 * @param {string} credentials.password - The password.
 * @returns {Promise<[ILoginResult | null, IErrorDict | null]>} A tuple with the login result or an error.
 *
 * @example
 * const [result, error] = await LoginService("https://api.example.com", { username: "john", password: "secret" });
 * if (error) console.error("Login failed:", error.message);
 * else setCookie("PumpwoodAuthorization", result.token);
 */
export const LoginService = async (
  baseUrl: string,
  { username, password }: { username: string; password: string }
): Promise<[ILoginResult | null, IErrorDict | null]> => {
  if (!baseUrl) {
    return [null, normalizeToErrorDict(new Error("LoginService: baseUrl is required"))];
  }
  if (!username) {
    return [null, normalizeToErrorDict(new Error("LoginService: username is required"))];
  }
  if (!password) {
    return [null, normalizeToErrorDict(new Error("LoginService: password is required"))];
  }

  const url = `${baseUrl.replace(/\/$/, "")}/registration/login/`;

  const [response, fetchError] = await safeAwait(
    fetch(url, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
  );

  if (fetchError) {
    return [null, fetchError];
  }

  if (!response.ok) {
    const errorText = await response.text();
    return [null, normalizeToErrorDict(createHttpError(response.status, `HTTP ${response.status}: ${errorText}`))];
  }

  const [jsonData, jsonError] = await safeAwait<{ token: string }>(response.json());

  if (jsonError) {
    return [null, jsonError];
  }

  if (!jsonData.token) {
    return [null, normalizeToErrorDict(new Error("LoginService: response did not contain a token"))];
  }

  return [{ token: jsonData.token }, null];
};
