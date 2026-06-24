import type { IErrorDict } from "../types/error.js";
import type { ApiService } from "../core/api-service.js";
/**
 * Executes an action on a model instance.
 *
 * Actions are custom methods defined on Pumpwood models that perform specific operations.
 * This service calls the action endpoint with the provided parameters.
 *
 * @template T - The expected type of the action response data.
 * @param {object} params - The parameters object.
 * @param {ApiService} params.api - An instance of the ApiService.
 * @param {string} params.modelClass - The name of the model class to execute the action on.
 * @param {number} params.pk - The primary key of the item to execute the action on.
 * @param {string} params.actionName - The name of the action to execute.
 * @param {Record<string, any>} [params.parameters] - Optional parameters to pass to the action.
 * @param {Record<string, string>} [params.queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the response data or an error.
 *
 * @example
 * const [result, error] = await ExecuteActionService({
 *   api: api,
 *   modelClass: "MaterialApprovalActivity",
 *   pk: 123,
 *   actionName: "review",
 *   parameters: { new_status: "approved" }
 * });
 * if (error) console.error("Failed to execute action:", error);
 * else console.log("Action executed successfully:", result);
 *
 * @example
 * const [result, error] = await ExecuteActionService({
 *   api: api,
 *   modelClass: "MaterialApprovalActivity",
 *   pk: 0,
 *   actionName: "get_statistics",
 *   parameters: { year: 2024 }
 * });
 */
export declare const ExecuteActionService: <T = any>({ api, modelClass, pk, actionName, parameters, queryParams, }: {
    api: ApiService;
    modelClass: string;
    pk: number;
    actionName: string;
    parameters?: Record<string, any>;
    queryParams?: Record<string, string>;
}) => Promise<[T | null, IErrorDict | null]>;
//# sourceMappingURL=execute-action.d.ts.map