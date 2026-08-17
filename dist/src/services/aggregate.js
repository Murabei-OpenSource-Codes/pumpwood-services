"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateService = void 0;
const safe_await_js_1 = require("../core/safe-await.js");
/**
 * Runs an aggregation query for a given model from the API.
 * @template T - The expected type of the aggregation response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to aggregate.
 * @param {Record<string, unknown>} body - Request body for the aggregate
 *   operation.
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the
 *   response data or an error, consistent with safeAwait.
 *
 * @example
 * const [rows, error] = await AggregateService<AggregateRow[]>(
 *   api,
 *   "ToLoadCalendar",
 *   {
 *     group_by: ["calendar_id"],
 *     agg: { n: { field: "id", function: "count" } },
 *   },
 * );
 * if (error) console.error("Failed to aggregate:", error);
 * else console.log("Aggregation rows:", rows);
 */
const AggregateService = async (api, modelClass, body) => {
    const normalizedModelClass = modelClass.toLowerCase();
    const [response, error] = await (0, safe_await_js_1.safeAwait)(api.request("POST", `/${normalizedModelClass}/aggregate/`, body));
    if (error) {
        console.error("==> AggregateService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.AggregateService = AggregateService;
//# sourceMappingURL=aggregate.js.map