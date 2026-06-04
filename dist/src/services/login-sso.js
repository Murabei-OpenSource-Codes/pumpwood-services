"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSSOService = void 0;
const safe_await_js_1 = require("../core/safe-await.js");
const error_js_1 = require("../types/error.js");
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
const LoginSSOService = async (baseUrl, email) => {
    if (!baseUrl) {
        return [null, (0, error_js_1.normalizeToErrorDict)(new Error("LoginSSOService: baseUrl is required"))];
    }
    if (!email) {
        return [null, (0, error_js_1.normalizeToErrorDict)(new Error("LoginSSOService: email is required"))];
    }
    const url = `${baseUrl.replace(/\/$/, "")}/registration/oauth2-login/`;
    const [response, fetchError] = await (0, safe_await_js_1.safeAwait)(fetch(url, {
        method: "POST",
        credentials: "omit",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    }));
    if (fetchError) {
        return [null, fetchError];
    }
    if (!response.ok) {
        const errorText = await response.text();
        return [null, (0, error_js_1.normalizeToErrorDict)(new Error(`HTTP ${response.status}: ${errorText}`))];
    }
    const [jsonData, jsonError] = await (0, safe_await_js_1.safeAwait)(response.json());
    if (jsonError) {
        return [null, jsonError];
    }
    const redirectUrl = jsonData.mfa_method_result?.authorization_url;
    if (!redirectUrl) {
        return [null, (0, error_js_1.normalizeToErrorDict)(new Error("LoginSSOService: response did not contain authorization_url"))];
    }
    return [{ redirect_url: redirectUrl }, null];
};
exports.LoginSSOService = LoginSSOService;
//# sourceMappingURL=login-sso.js.map