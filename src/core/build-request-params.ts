import type {
  IAggregateParams,
  IDeleteParams,
  IExtraOptions,
  IListDimensionValuesParams,
  IListDimensionsParams,
  IListParams,
  IListWithoutPagParams,
  IRetrieveFileParams,
  IRetrieveParams,
  ISaveParams,
  IUploadFileParams,
} from "../types/http.js";

const DEFAULT_LIMIT = 50;
const DEFAULT_DEFAULT_FIELDS = false;
const DEFAULT_FOREIGN_KEY_FIELDS = true;
const DEFAULT_RELATED_FIELDS = true;

export interface IRequestParts {
  body: Record<string, unknown>;
  queryParams: Record<string, string>;
}

function toQueryValue(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function appendQueryParam(
  target: Record<string, string>,
  key: string,
  value: unknown,
): void {
  const queryValue = toQueryValue(value);
  if (queryValue === undefined) return;
  target[key] = queryValue;
}

function appendExtraOptionsToQuery(
  target: Record<string, string>,
  extraOptions?: IExtraOptions,
): void {
  if (!extraOptions) return;
  for (const [key, value] of Object.entries(extraOptions)) {
    appendQueryParam(target, key, value);
  }
}

function buildListLikeRequest(
  params: IListParams,
  { includeLimit }: { includeLimit: boolean },
): IRequestParts {
  const {
    filter_dict,
    exclude_dict,
    order_by,
    fields,
    default_fields,
    limit,
    foreign_key_fields,
    related_fields,
    base_filter_skip,
    extraOptions,
  } = params;

  const body: Record<string, unknown> = {
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

  const queryParams: Record<string, string> = {};
  appendQueryParam(queryParams, "base_filter_skip", base_filter_skip);

  return { body, queryParams };
}

/** Build POST body and query params for the list end-point. */
export function buildListRequest(params: IListParams): IRequestParts {
  return buildListLikeRequest(params, { includeLimit: true });
}

/** Build POST body and query params for the list-without-pag end-point. */
export function buildListWithoutPagRequest(
  params: IListWithoutPagParams,
): IRequestParts {
  return buildListLikeRequest(params, { includeLimit: false });
}

/** Build POST body and query params for the save end-point. */
export function buildSaveRequest(params: ISaveParams): IRequestParts {
  const {
    body,
    fields,
    default_fields,
    foreign_key_fields,
    related_fields,
    base_filter_skip,
    extraOptions,
  } = params;

  const queryParams: Record<string, string> = {};
  appendQueryParam(queryParams, "fields", fields);
  appendQueryParam(
    queryParams,
    "default_fields",
    default_fields ?? DEFAULT_DEFAULT_FIELDS,
  );
  appendQueryParam(
    queryParams,
    "foreign_key_fields",
    foreign_key_fields ?? DEFAULT_FOREIGN_KEY_FIELDS,
  );
  appendQueryParam(
    queryParams,
    "related_fields",
    related_fields ?? DEFAULT_RELATED_FIELDS,
  );
  appendQueryParam(queryParams, "base_filter_skip", base_filter_skip);
  appendExtraOptionsToQuery(queryParams, extraOptions);

  return { body, queryParams };
}

/** Build query params for the retrieve end-point. */
export function buildRetrieveQueryParams(
  params: IRetrieveParams,
): Record<string, string> {
  const queryParams: Record<string, string> = {};
  appendQueryParam(queryParams, "fields", params.fields);
  appendQueryParam(
    queryParams,
    "default_fields",
    params.default_fields ?? DEFAULT_DEFAULT_FIELDS,
  );
  appendQueryParam(
    queryParams,
    "foreign_key_fields",
    params.foreign_key_fields ?? DEFAULT_FOREIGN_KEY_FIELDS,
  );
  appendQueryParam(
    queryParams,
    "related_fields",
    params.related_fields ?? DEFAULT_RELATED_FIELDS,
  );
  appendQueryParam(queryParams, "base_filter_skip", params.base_filter_skip);
  appendExtraOptionsToQuery(queryParams, params.extraOptions);
  return queryParams;
}

/** Build query params for the file upload end-point. */
export function buildUploadFileQueryParams(
  params: IUploadFileParams,
): Record<string, string> {
  const queryParams: Record<string, string> = {};
  appendQueryParam(
    queryParams,
    "foreign_key_fields",
    params.foreign_key_fields ?? DEFAULT_FOREIGN_KEY_FIELDS,
  );
  appendQueryParam(
    queryParams,
    "related_fields",
    params.related_fields ?? DEFAULT_RELATED_FIELDS,
  );
  appendExtraOptionsToQuery(queryParams, params.extraOptions);
  return queryParams;
}

/** Build query params for the delete end-point. */
export function buildDeleteQueryParams(
  params: IDeleteParams,
): Record<string, string> {
  const queryParams: Record<string, string> = {};
  appendQueryParam(queryParams, "force_delete", params.force_delete);
  appendQueryParam(queryParams, "base_filter_skip", params.base_filter_skip);
  appendExtraOptionsToQuery(queryParams, params.extraOptions);
  return queryParams;
}

/** Build extra query params for the retrieve-file end-point. */
export function buildRetrieveFileQueryParams(
  params: IRetrieveFileParams,
): Record<string, string> {
  const queryParams: Record<string, string> = {};
  appendQueryParam(queryParams, "base_filter_skip", params.base_filter_skip);
  appendExtraOptionsToQuery(queryParams, params.extraOptions);
  return queryParams;
}

/** Build POST body and query params for the list-dimensions end-point. */
export function buildListDimensionsRequest(
  params: IListDimensionsParams,
): IRequestParts {
  const { filter_dict, exclude_dict, base_filter_skip, extraOptions } = params;

  const body: Record<string, unknown> = {
    filter_dict: filter_dict ?? {},
    exclude_dict: exclude_dict ?? {},
    ...extraOptions,
  };

  const queryParams: Record<string, string> = {};
  appendQueryParam(queryParams, "base_filter_skip", base_filter_skip);

  return { body, queryParams };
}

/** Build POST body and query params for the list-dimension-values end-point. */
export function buildListDimensionValuesRequest(
  params: IListDimensionValuesParams,
): IRequestParts {
  const { filter_dict, exclude_dict, key, base_filter_skip, extraOptions } =
    params;

  const body: Record<string, unknown> = {
    filter_dict: filter_dict ?? {},
    exclude_dict: exclude_dict ?? {},
    key,
    ...extraOptions,
  };

  const queryParams: Record<string, string> = {};
  appendQueryParam(queryParams, "base_filter_skip", base_filter_skip);

  return { body, queryParams };
}

/** Build POST body for the aggregate end-point. */
export function buildAggregateRequest(
  params: IAggregateParams,
): Record<string, unknown> {
  const {
    group_by,
    agg,
    filter_dict,
    exclude_dict,
    order_by,
    limit,
    show_deleted,
    extraOptions,
  } = params;

  const normalizedGroupBy =
    typeof group_by === "string" ? [group_by] : group_by;

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
