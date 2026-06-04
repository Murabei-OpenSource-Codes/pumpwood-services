"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSSOTokenService = void 0;
const safe_await_js_1 = require("../core/safe-await.js");
const error_js_1 = require("../types/error.js");
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
const GetSSOTokenService = async (url) => {
    if (!url) {
        return [null, (0, error_js_1.normalizeToErrorDict)(new Error("GetSSOTokenService: url is required"))];
    }
    const [response, fetchError] = await (0, safe_await_js_1.safeAwait)(fetch(url));
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
    if (!jsonData.token) {
        return [null, (0, error_js_1.normalizeToErrorDict)(new Error("GetSSOTokenService: response did not contain a token"))];
    }
    if (!jsonData.user?.email) {
        return [null, (0, error_js_1.normalizeToErrorDict)(new Error("GetSSOTokenService: response did not contain user.email"))];
    }
    if (!jsonData.user?.username) {
        return [null, (0, error_js_1.normalizeToErrorDict)(new Error("GetSSOTokenService: response did not contain user.username"))];
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
exports.GetSSOTokenService = GetSSOTokenService;
//# sourceMappingURL=get-sso-token.js.map