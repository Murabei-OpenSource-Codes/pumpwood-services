import type { IErrorDict } from "../types/error.js";
import type { IGetSSOTokenResult } from "../types/http.js";
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
export declare const GetSSOTokenService: (url: string) => Promise<[IGetSSOTokenResult | null, IErrorDict | null]>;
//# sourceMappingURL=get-sso-token.d.ts.map