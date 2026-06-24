"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteStaticActionService = void 0;
const execute_action_js_1 = require("./execute-action.js");
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
const ExecuteStaticActionService = async ({ api, modelClass, actionName, parameters, queryParams, }) => {
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
    return (0, execute_action_js_1.ExecuteActionService)(params);
};
exports.ExecuteStaticActionService = ExecuteStaticActionService;
//# sourceMappingURL=execute-static-action.js.map