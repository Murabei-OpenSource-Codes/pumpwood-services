"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildListRequest = buildListRequest;
exports.buildListWithoutPagRequest = buildListWithoutPagRequest;
exports.buildSaveRequest = buildSaveRequest;
exports.buildRetrieveQueryParams = buildRetrieveQueryParams;
exports.buildUploadFileQueryParams = buildUploadFileQueryParams;
exports.buildDeleteQueryParams = buildDeleteQueryParams;
exports.buildRetrieveFileQueryParams = buildRetrieveFileQueryParams;
exports.buildAggregateRequest = buildAggregateRequest;
const DEFAULT_LIMIT = 50;
const DEFAULT_DEFAULT_FIELDS = false;
const DEFAULT_FOREIGN_KEY_FIELDS = true;
const DEFAULT_RELATED_FIELDS = true;
function toQueryValue(value) {
    if (value === undefined || value === null)
        return undefined;
    if (typeof value === "object")
        return JSON.stringify(value);
    return String(value);
}
function appendQueryParam(target, key, value) {
    const queryValue = toQueryValue(value);
    if (queryValue === undefined)
        return;
    target[key] = queryValue;
}
function appendExtraOptionsToQuery(target, extraOptions) {
    if (!extraOptions)
        return;
    for (const [key, value] of Object.entries(extraOptions)) {
        appendQueryParam(target, key, value);
    }
}
function buildListLikeRequest(params, { includeLimit }) {
    const { filter_dict, exclude_dict, order_by, fields, default_fields, limit, foreign_key_fields, related_fields, base_filter_skip, extraOptions, } = params;
    const body = {
        filter_dict: filter_dict ?? {},
        exclude_dict: exclude_dict ?? {},
        default_fields: default_fields ?? DEFAULT_DEFAULT_FIELDS,
        foreign_key_fields: foreign_key_fields ?? DEFAULT_FOREIGN_KEY_FIELDS,
        related_fields: related_fields ?? DEFAULT_RELATED_FIELDS,
        ...(order_by !== undefined && { order_by }),
        ...(fields !== undefined && { fields }),
        ...(includeLimit && { limit: limit ?? DEFAULT_LIMIT }),
        ...extraOptions,
    };
    const queryParams = {};
    appendQueryParam(queryParams, "base_filter_skip", base_filter_skip);
    return { body, queryParams };
}
/** Build POST body and query params for the list end-point. */
function buildListRequest(params) {
    return buildListLikeRequest(params, { includeLimit: true });
}
/** Build POST body and query params for the list-without-pag end-point. */
function buildListWithoutPagRequest(params) {
    return buildListLikeRequest(params, { includeLimit: false });
}
/** Build POST body and query params for the save end-point. */
function buildSaveRequest(params) {
    const { body, fields, default_fields, foreign_key_fields, related_fields, base_filter_skip, extraOptions, } = params;
    const queryParams = {};
    appendQueryParam(queryParams, "fields", fields);
    appendQueryParam(queryParams, "default_fields", default_fields ?? DEFAULT_DEFAULT_FIELDS);
    appendQueryParam(queryParams, "foreign_key_fields", foreign_key_fields ?? DEFAULT_FOREIGN_KEY_FIELDS);
    appendQueryParam(queryParams, "related_fields", related_fields ?? DEFAULT_RELATED_FIELDS);
    appendQueryParam(queryParams, "base_filter_skip", base_filter_skip);
    appendExtraOptionsToQuery(queryParams, extraOptions);
    return { body, queryParams };
}
/** Build query params for the retrieve end-point. */
function buildRetrieveQueryParams(params) {
    const queryParams = {};
    appendQueryParam(queryParams, "fields", params.fields);
    appendQueryParam(queryParams, "default_fields", params.default_fields ?? DEFAULT_DEFAULT_FIELDS);
    appendQueryParam(queryParams, "foreign_key_fields", params.foreign_key_fields ?? DEFAULT_FOREIGN_KEY_FIELDS);
    appendQueryParam(queryParams, "related_fields", params.related_fields ?? DEFAULT_RELATED_FIELDS);
    appendQueryParam(queryParams, "base_filter_skip", params.base_filter_skip);
    appendExtraOptionsToQuery(queryParams, params.extraOptions);
    return queryParams;
}
/** Build query params for the file upload end-point. */
function buildUploadFileQueryParams(params) {
    const queryParams = {};
    appendQueryParam(queryParams, "foreign_key_fields", params.foreign_key_fields ?? DEFAULT_FOREIGN_KEY_FIELDS);
    appendQueryParam(queryParams, "related_fields", params.related_fields ?? DEFAULT_RELATED_FIELDS);
    appendExtraOptionsToQuery(queryParams, params.extraOptions);
    return queryParams;
}
/** Build query params for the delete end-point. */
function buildDeleteQueryParams(params) {
    const queryParams = {};
    appendQueryParam(queryParams, "force_delete", params.force_delete);
    appendQueryParam(queryParams, "base_filter_skip", params.base_filter_skip);
    appendExtraOptionsToQuery(queryParams, params.extraOptions);
    return queryParams;
}
/** Build extra query params for the retrieve-file end-point. */
function buildRetrieveFileQueryParams(params) {
    const queryParams = {};
    appendQueryParam(queryParams, "base_filter_skip", params.base_filter_skip);
    appendExtraOptionsToQuery(queryParams, params.extraOptions);
    return queryParams;
}
/** Build POST body for the aggregate end-point. */
function buildAggregateRequest(params) {
    const { group_by, agg, filter_dict, exclude_dict, order_by, limit, show_deleted, extraOptions, } = params;
    const normalizedGroupBy = typeof group_by === "string" ? [group_by] : group_by;
    return {
        agg,
        group_by: normalizedGroupBy,
        filter_dict: filter_dict ?? {},
        exclude_dict: exclude_dict ?? {},
        order_by: order_by ?? [],
        show_deleted: show_deleted ?? false,
        ...(limit !== undefined && { limit }),
        ...extraOptions,
    };
}
//# sourceMappingURL=build-request-params.js.map