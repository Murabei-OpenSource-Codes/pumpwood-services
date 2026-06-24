import type { IErrorDict } from "../types/error.js";
import type { ApiService } from "../core/api-service.js";
import { ExecuteActionService } from "./execute-action.js";

/**
 * Executes a static action on a model class (no instance required).
 *
 * Static actions are class-level methods that don't require a specific instance.
 * This is a convenience wrapper around ExecuteActionService with pk=0.
 *
 * @template T - The expected type of the action response data.
 * @param {object} params - The parameters object.
 * @param {ApiService} params.api - An instance of the ApiService.
 * @param {string} params.modelClass - The name of the model class to execute the action on.
 * @param {string} params.actionName - The name of the static action to execute.
 * @param {Record<string, any>} [params.parameters] - Optional parameters to pass to the action.
 * @param {Record<string, string>} [params.queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the response data or an error.
 *
 * @example
 * const [stats, error] = await ExecuteStaticActionService({
 *   api: api,
 *   modelClass: "MaterialApprovalActivity",
 *   actionName: "get_statistics",
 *   parameters: { year: 2024 }
 * });
 */
export const ExecuteStaticActionService = async <T = any>({
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
}): Promise<[T | null, IErrorDict | null]> => {
  const params: {
    api: ApiService;
    modelClass: string;
    pk: number;
    actionName: string;
    parameters?: Record<string, any>;
    queryParams?: Record<string, string>;
  } = {
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

  return ExecuteActionService<T>(params);
};
