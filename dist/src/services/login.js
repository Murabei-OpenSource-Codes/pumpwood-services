"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const safe_await_js_1 = require("../core/safe-await.js");
const error_js_1 = require("../types/error.js");
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
const LoginService = async (baseUrl, { username, password }) => {
    if (!baseUrl) {
        return [null, (0, error_js_1.normalizeToErrorDict)(new Error("LoginService: baseUrl is required"))];
    }
    if (!username) {
        return [null, (0, error_js_1.normalizeToErrorDict)(new Error("LoginService: username is required"))];
    }
    if (!password) {
        return [null, (0, error_js_1.normalizeToErrorDict)(new Error("LoginService: password is required"))];
    }
    const url = `${baseUrl.replace(/\/$/, "")}/registration/login/`;
    const [response, fetchError] = await (0, safe_await_js_1.safeAwait)(fetch(url, {
        method: "POST",
        credentials: "omit",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    }));
    if (fetchError) {
        return [null, fetchError];
    }
    if (!response.ok) {
        const errorText = await response.text();
        return [null, (0, error_js_1.normalizeToErrorDict)((0, error_js_1.createHttpError)(response.status, `HTTP ${response.status}: ${errorText}`))];
    }
    const [jsonData, jsonError] = await (0, safe_await_js_1.safeAwait)(response.json());
    if (jsonError) {
        return [null, jsonError];
    }
    if (!jsonData.token) {
        return [null, (0, error_js_1.normalizeToErrorDict)(new Error("LoginService: response did not contain a token"))];
    }
    return [{ token: jsonData.token }, null];
};
exports.LoginService = LoginService;
//# sourceMappingURL=login.js.map