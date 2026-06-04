import type { IErrorDict } from "../types/error.js";
import type { IFileData } from "../types/http.js";
import type { ApiService } from "../core/api-service.js";
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
export declare const ExecuteActionFileService: ({ api, modelClass, actionName, parameters, queryParams, }: {
    api: ApiService;
    modelClass: string;
    actionName: string;
    parameters?: Record<string, any>;
    queryParams?: Record<string, string>;
}) => Promise<[IFileData | null, IErrorDict | null]>;
//# sourceMappingURL=execute-action-file.d.ts.map