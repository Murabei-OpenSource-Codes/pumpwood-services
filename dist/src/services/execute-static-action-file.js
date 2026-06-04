"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteStaticActionFileService = void 0;
const execute_action_file_js_1 = require("./execute-action-file.js");
/**
 * Executes a static action on a model class (no instance required) and returns the result as a binary file (Blob).
 *
 * Static actions are class-level methods that don't require a specific instance.
 * This is a convenience wrapper around ExecuteActionFileService with pk=0.
 *
 * ⚠️ Blob URL lifecycle: always call URL.revokeObjectURL() after the download is triggered
 * to avoid memory leaks.
 *
 * @param {object} params - The parameters object.
 * @param {ApiService} params.api - An instance of the ApiService.
 * @param {string} params.modelClass - The name of the model class to execute the action on.
 * @param {string} params.actionName - The name of the static action to execute.
 * @param {Record<string, any>} [params.parameters] - Optional parameters to pass to the action.
 * @param {Record<string, string>} [params.queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[IFileData | null, IErrorDict | null]>} A tuple containing the file data or an error.
 *
 * @example
 * const [fileData, error] = await ExecuteStaticActionFileService({
 *   api,
 *   modelClass: "Report",
 *   actionName: "export_global_stats",
 *   parameters: { year: 2024 }
 * });
 * if (error) throw new Error(error.message);
 *
 * const url = URL.createObjectURL(fileData!.blob);
 * try {
 *   const a = document.createElement("a");
 *   a.href = url;
 *   a.download = "stats.xlsx";
 *   a.click();
 * } finally {
 *   URL.revokeObjectURL(url);
 * }
 */
const ExecuteStaticActionFileService = async ({ api, modelClass, actionName, parameters, queryParams, }) => {
    const params = {
        api,
        modelClass,
        pk: 0,
        actionName,
    };
    if (parameters !== undefined) {
        params.parameters = parameters;
    }
    if (queryParams !== undefined) {
        params.queryParams = queryParams;
    }
    return (0, execute_action_file_js_1.ExecuteActionFileService)(params);
};
exports.ExecuteStaticActionFileService = ExecuteStaticActionFileService;
//# sourceMappingURL=execute-static-action-file.js.map