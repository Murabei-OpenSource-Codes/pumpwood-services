import type { IErrorDict } from "../types/error.js";
import type { IFileData } from "../types/http.js";
import type { ApiService } from "../core/api-service.js";
import { ExecuteActionFileService } from "./execute-action-file.js";

/**
 * Executes a static action on a model class (no instance required) and returns the result as a binary file (Blob).
 *
 * Static actions are class-level methods that don't require a specific instance.
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
export const ExecuteStaticActionFileService = async ({
  api,
  modelClass,
  actionName,
  parameters,
  queryParams,
}: {
  api: ApiService;
  modelClass: string;
  actionName: string;
  parameters?: Record<string, any>;
  queryParams?: Record<string, string>;
}): Promise<[IFileData | null, IErrorDict | null]> => {
  const params: {
    api: ApiService;
    modelClass: string;
    actionName: string;
    parameters?: Record<string, any>;
    queryParams?: Record<string, string>;
  } = {
    api,
    modelClass,
    actionName,
  };

  if (parameters !== undefined) {
    params.parameters = parameters;
  }

  if (queryParams !== undefined) {
    params.queryParams = queryParams;
  }

  return ExecuteActionFileService(params);
};
