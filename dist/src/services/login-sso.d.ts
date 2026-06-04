import type { IErrorDict } from "../types/error.js";
import type { ILoginSSOResult } from "../types/http.js";
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
export declare const LoginSSOService: (baseUrl: string, email: string) => Promise<[ILoginSSOResult | null, IErrorDict | null]>;
//# sourceMappingURL=login-sso.d.ts.map