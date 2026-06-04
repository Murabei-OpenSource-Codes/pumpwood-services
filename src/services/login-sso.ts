import type { IErrorDict } from "../types/error.js";
import type { ILoginSSOResult } from "../types/http.js";
import { safeAwait } from "../core/safe-await.js";
import { normalizeToErrorDict } from "../types/error.js";

/**
 * Initiates an SSO login flow, returning the OAuth2 redirect URL.
 *
 * @param {string} baseUrl - The base URL of the API (e.g. "https://api.example.com").
 * @param {string} email - The user's email address to identify the SSO provider.
 * @returns {Promise<[ILoginSSOResult | null, IErrorDict | null]>} A tuple with the redirect URL or an error.
 *
 * @example
 * const [result, error] = await LoginSSOService("https://api.example.com", "user@example.com");
 * if (error) console.error("SSO init failed:", error.message);
 * else window.location.href = result.redirect_url;
 */
export const LoginSSOService = async (
  baseUrl: string,
  email: string
): Promise<[ILoginSSOResult | null, IErrorDict | null]> => {
  if (!baseUrl) {
    return [null, normalizeToErrorDict(new Error("LoginSSOService: baseUrl is required"))];
  }
  if (!email) {
    return [null, normalizeToErrorDict(new Error("LoginSSOService: email is required"))];
  }

  const url = `${baseUrl.replace(/\/$/, "")}/registration/oauth2-login/`;

  const [response, fetchError] = await safeAwait(
    fetch(url, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
  );

  if (fetchError) {
    return [null, fetchError];
  }

  if (!response.ok) {
    const errorText = await response.text();
    return [null, normalizeToErrorDict(new Error(`HTTP ${response.status}: ${errorText}`))];
  }

  const [jsonData, jsonError] = await safeAwait<{ mfa_method_result?: { authorization_url?: string } }>(response.json());

  if (jsonError) {
    return [null, jsonError];
  }

  const redirectUrl = jsonData.mfa_method_result?.authorization_url;

  if (!redirectUrl) {
    return [null, normalizeToErrorDict(new Error("LoginSSOService: response did not contain authorization_url"))];
  }

  return [{ redirect_url: redirectUrl }, null];
};
