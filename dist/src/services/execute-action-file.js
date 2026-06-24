"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteActionFileService = void 0;
const safe_await_js_1 = require("../core/safe-await.js");
/**
 * Executes an action on a model instance and returns the result as a binary file (Blob).
 * Used for actions that generate file downloads such as Excel exports, PDF reports, etc.
 *
 * ⚠️ Blob URL lifecycle: always call URL.revokeObjectURL() after the download is triggered
 * to avoid memory leaks. See example below.
 *
 * @param {ApiService} params.api - An instance of the ApiService.
 * @param {string} params.modelClass - The name of the model class.
 * @param {string} params.actionName - The name of the action to execute.
 * @param {Record<string, any>} [params.parameters] - Optional parameters to pass to the action.
 * @param {Record<string, string>} [params.queryParams] - Optional query parameters.
 * @returns {Promise<[IFileData | null, IErrorDict | null]>} A tuple containing the file data or an error.
 *
 * @example
 * const [fileData, error] = await ExecuteActionFileService({
 *   api,
 *   modelClass: "Report",
 *   actionName: "export_excel",
 * });
 * if (error) throw new Error(error.message);
 *
 * const url = URL.createObjectURL(fileData!.blob);
 * try {
 *   const a = document.createElement("a");
 *   a.href = url;
 *   a.download = "report.xlsx";
 *   a.click();
 * } finally {
 *   URL.revokeObjectURL(url); // always revoke to prevent memory leaks
 * }
 */
const ExecuteActionFileService = async ({ api, modelClass, actionName, parameters, queryParams, }) => {
    const normalizedModelClass = modelClass.toLowerCase();
    const requestBody = parameters ?? {};
    const [response, error] = await (0, safe_await_js_1.safeAwait)(queryParams
        ? api.postFileRequest(`/${normalizedModelClass}/actions/${actionName}/`, requestBody, queryParams)
        : api.postFileRequest(`/${normalizedModelClass}/actions/${actionName}/`, requestBody));
    if (error) {
        console.error("==> ExecuteActionFileService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.ExecuteActionFileService = ExecuteActionFileService;
//# sourceMappingURL=execute-action-file.js.map