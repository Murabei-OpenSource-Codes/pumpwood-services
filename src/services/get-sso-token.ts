import type { IErrorDict } from "../types/error.js";
import type { IGetSSOTokenResult } from "../types/http.js";
import { safeAwait } from "../core/safe-await.js";
import { createHttpError, normalizeToErrorDict } from "../types/error.js";

/**
 * Exchanges an SSO callback URL for a Pumpwood token and user info.
 * Called after the OAuth2 provider redirects back to the application.
 *
 * @param {string} url - The full SSO callback URL (including query params from the provider).
 * @returns {Promise<[IGetSSOTokenResult | null, IErrorDict | null]>} A tuple with the token + user or an error.
 *
 * @example
 * const [result, error] = await GetSSOTokenService(callbackUrl);
 * if (error) console.error("SSO token exchange failed:", error.message);
 * else {
 *   setCookie("PumpwoodAuthorization", result.token);
 *   setCookie("user", JSON.stringify(result.user));
 * }
 */
export const GetSSOTokenService = async (
  url: string
): Promise<[IGetSSOTokenResult | null, IErrorDict | null]> => {
  if (!url) {
    return [null, normalizeToErrorDict(new Error("GetSSOTokenService: url is required"))];
  }

  const [response, fetchError] = await safeAwait(fetch(url));

  if (fetchError) {
    return [null, fetchError];
  }

  if (!response.ok) {
    const errorText = await response.text();
    return [null, normalizeToErrorDict(createHttpError(response.status, `HTTP ${response.status}: ${errorText}`))];
  }

  const [jsonData, jsonError] = await safeAwait<{ token?: string; user?: { email?: string; username?: string } }>(response.json());

  if (jsonError) {
    return [null, jsonError];
  }

  if (!jsonData.token) {
    return [null, normalizeToErrorDict(new Error("GetSSOTokenService: response did not contain a token"))];
  }

  if (!jsonData.user?.email) {
    return [null, normalizeToErrorDict(new Error("GetSSOTokenService: response did not contain user.email"))];
  }

  if (!jsonData.user?.username) {
    return [null, normalizeToErrorDict(new Error("GetSSOTokenService: response did not contain user.username"))];
  }

  return [
    {
      token: jsonData.token,
      user: {
        email: jsonData.user.email,
        username: jsonData.user.username,
      },
    },
    null,
  ];
};
