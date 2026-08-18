import type { IErrorDict } from "../types/error.js";
import type { ApiService } from "../core/api-service.js";
import type { IListByChunksParams, IListParams } from "../types/http.js";
import { buildListRequest } from "../core/build-request-params.js";
import { ListService } from "./list.js";

const DEFAULT_CHUNK_SIZE = 100;

function cloneFilterDict(
  filterDict: Record<string, unknown> | undefined,
): Record<string, unknown> {
  return structuredClone(filterDict ?? {});
}

function extractCursorId(item: Record<string, unknown>): number | null {
  const id = item.id;
  if (typeof id === "number") return id;

  const pk = item.pk;
  if (typeof pk === "number") return pk;

  return null;
}

function buildCompositePkError(): IErrorDict {
  const message =
    "listByChunks cannot derive cursor id from composite pk. " +
    "Include `id` in `fields` or use `list` manually.";
  return {
    __error__: "PumpWoodException",
    type: "ListByChunksCursorError",
    message,
    message_not_fmt: message,
    payload: {},
    parallel: false,
  };
}

/**
 * Fetches all items matching a query by paginating with repeated `list` calls.
 * Uses `filter_dict.id__gt` cursor pagination with `order_by: ["id"]`.
 * @template T - The expected type of the merged response array.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {IListByChunksParams} params - Chunked list parameters.
 * @returns {Promise<[T | null, IErrorDict | null]>} Merged results or an error.
 */
export const ListByChunksService = async <T>(
  api: ApiService,
  params: IListByChunksParams,
): Promise<[T | null, IErrorDict | null]> => {
  const {
    modelClass,
    filter_dict,
    exclude_dict,
    fields,
    default_fields,
    foreign_key_fields,
    related_fields,
    base_filter_skip,
    extraOptions,
    chunkSize = DEFAULT_CHUNK_SIZE,
    maxItems,
  } = params;

  const copyFilterDict = cloneFilterDict(filter_dict);
  const allResults: Record<string, unknown>[] = [];
  let lastCursorId: number | null = null;
  let currentChunkSize = chunkSize;

  while (true) {
    if (maxItems !== undefined) {
      const remaining = maxItems - allResults.length;
      if (remaining <= 0) break;
      currentChunkSize = Math.min(currentChunkSize, remaining);
      if (currentChunkSize <= 0) break;
    }

    if (lastCursorId !== null) {
      copyFilterDict.id__gt = lastCursorId;
    }

    const listParams: IListParams = {
      modelClass,
      filter_dict: copyFilterDict,
      order_by: ["id"],
      limit: currentChunkSize,
    };

    if (exclude_dict !== undefined) listParams.exclude_dict = exclude_dict;
    if (fields !== undefined) listParams.fields = fields;
    if (default_fields !== undefined) listParams.default_fields = default_fields;
    if (foreign_key_fields !== undefined) {
      listParams.foreign_key_fields = foreign_key_fields;
    }
    if (related_fields !== undefined) listParams.related_fields = related_fields;
    if (base_filter_skip !== undefined) {
      listParams.base_filter_skip = base_filter_skip;
    }
    if (extraOptions !== undefined) listParams.extraOptions = extraOptions;

    const { body, queryParams } = buildListRequest(listParams);
    const [chunk, error] = await ListService<Record<string, unknown>[]>(
      api,
      modelClass,
      body,
      queryParams,
    );

    if (error) {
      console.error("==> ListByChunksService ERROR:", error);
      return [null, error];
    }

    const chunkResults = chunk ?? [];
    if (chunkResults.length === 0) break;

    allResults.push(...chunkResults);

    if (maxItems !== undefined) {
      const recordsToFetch = maxItems - allResults.length;
      currentChunkSize = Math.min(recordsToFetch, chunkSize);
      if (currentChunkSize <= 0) break;
    }

    const lastItem = chunkResults[chunkResults.length - 1];
    if (lastItem === undefined) break;

    const cursorId = extractCursorId(lastItem);
    if (cursorId === null) {
      return [null, buildCompositePkError()];
    }
    lastCursorId = cursorId;

    if (chunkResults.length < currentChunkSize) break;
  }

  return [allResults as T, null];
};
