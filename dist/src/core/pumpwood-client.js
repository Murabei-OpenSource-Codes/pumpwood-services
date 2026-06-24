"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpwoodClient = void 0;
const api_service_js_1 = require("./api-service.js");
const list_js_1 = require("../services/list.js");
const list_without_pag_js_1 = require("../services/list-without-pag.js");
const retrieve_js_1 = require("../services/retrieve.js");
const retrieve_options_js_1 = require("../services/retrieve-options.js");
const retrieve_file_js_1 = require("../services/retrieve-file.js");
const save_js_1 = require("../services/save.js");
const delete_js_1 = require("../services/delete.js");
const upload_js_1 = require("../services/upload.js");
const execute_action_js_1 = require("../services/execute-action.js");
const execute_static_action_js_1 = require("../services/execute-static-action.js");
const execute_action_file_js_1 = require("../services/execute-action-file.js");
const execute_static_action_file_js_1 = require("../services/execute-static-action-file.js");
const login_js_1 = require("../services/login.js");
const login_sso_js_1 = require("../services/login-sso.js");
const get_sso_token_js_1 = require("../services/get-sso-token.js");
async function resolveToken(token) {
    if (typeof token === "function") {
        return await token();
    }
    return token;
}
function optionsToQueryParams(options) {
    const result = {};
    for (const [key, value] of Object.entries(options)) {
        if (value === undefined || value === null)
            continue;
        result[key] = String(value);
    }
    return result;
}
class PumpwoodClient {
    list;
    listWithoutPag;
    retrieve;
    retrieveFile;
    retrieveOptions;
    save;
    delete;
    uploadFile;
    executeAction;
    executeStaticAction;
    executeActionFile;
    executeStaticActionFile;
    loginWithCredentials;
    loginWithSSO;
    getSSOToken;
    constructor({ baseUrl, token, onUnauthorized }) {
        const buildApi = async () => {
            const resolvedToken = await resolveToken(token);
            return new api_service_js_1.ApiService({
                baseUrl,
                token: resolvedToken,
                ...(onUnauthorized !== undefined && { onUnauthorized }),
            });
        };
        this.list = async (modelClass, body, queryParams) => {
            return (0, list_js_1.ListService)(await buildApi(), modelClass, body, queryParams);
        };
        this.listWithoutPag = async (modelClass, body, queryParams) => {
            return (0, list_without_pag_js_1.ListWithoutPagService)(await buildApi(), modelClass, body, queryParams);
        };
        this.retrieve = async (modelClass, pk, options) => {
            const queryParams = options ? optionsToQueryParams(options) : undefined;
            return (0, retrieve_js_1.RetrieveService)(await buildApi(), modelClass, pk, queryParams);
        };
        this.retrieveFile = async (modelClass, pk, fileField) => {
            return (0, retrieve_file_js_1.RetrieveFileService)(await buildApi(), modelClass, pk, fileField);
        };
        this.retrieveOptions = async (modelClass, body) => {
            return (0, retrieve_options_js_1.RetrieveOptionsService)(await buildApi(), modelClass, body);
        };
        this.save = async (modelClass, body, options) => {
            const queryParams = options ? optionsToQueryParams(options) : undefined;
            return (0, save_js_1.SaveService)(await buildApi(), modelClass, body, queryParams);
        };
        this.delete = async (modelClass, pk) => {
            return (0, delete_js_1.DeleteService)(await buildApi(), modelClass, pk);
        };
        this.uploadFile = async (modelClass, file, jsonData, queryParams) => {
            return (0, upload_js_1.UploadFileService)(await buildApi(), modelClass, file, jsonData, queryParams);
        };
        this.executeAction = async ({ modelClass, pk, actionName, parameters, queryParams }) => {
            return (0, execute_action_js_1.ExecuteActionService)({ api: await buildApi(), modelClass, pk, actionName, ...(parameters !== undefined && { parameters }), ...(queryParams !== undefined && { queryParams }) });
        };
        this.executeStaticAction = async ({ modelClass, actionName, parameters, queryParams }) => {
            return (0, execute_static_action_js_1.ExecuteStaticActionService)({ api: await buildApi(), modelClass, actionName, ...(parameters !== undefined && { parameters }), ...(queryParams !== undefined && { queryParams }) });
        };
        this.executeActionFile = async ({ modelClass, actionName, parameters, queryParams }) => {
            return (0, execute_action_file_js_1.ExecuteActionFileService)({ api: await buildApi(), modelClass, actionName, ...(parameters !== undefined && { parameters }), ...(queryParams !== undefined && { queryParams }) });
        };
        this.executeStaticActionFile = async ({ modelClass, actionName, parameters, queryParams }) => {
            return (0, execute_static_action_file_js_1.ExecuteStaticActionFileService)({ api: await buildApi(), modelClass, actionName, ...(parameters !== undefined && { parameters }), ...(queryParams !== undefined && { queryParams }) });
        };
        this.loginWithCredentials = async (credentials) => {
            return (0, login_js_1.LoginService)(baseUrl, credentials);
        };
        this.loginWithSSO = async (email) => {
            return (0, login_sso_js_1.LoginSSOService)(baseUrl, email);
        };
        this.getSSOToken = async (url) => {
            return (0, get_sso_token_js_1.GetSSOTokenService)(url);
        };
    }
}
exports.PumpwoodClient = PumpwoodClient;
//# sourceMappingURL=pumpwood-client.js.map