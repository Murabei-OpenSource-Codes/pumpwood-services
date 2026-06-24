import type { IErrorDict } from "../types/error.js";
import type { ILoginResult } from "../types/http.js";
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
export declare const LoginService: (baseUrl: string, { username, password }: {
    username: string;
    password: string;
}) => Promise<[ILoginResult | null, IErrorDict | null]>;
//# sourceMappingURL=login.d.ts.map