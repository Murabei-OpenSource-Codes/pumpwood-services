# Changelog

All notable changes to this project will be documented in this
file.

The format is based on
[Keep a Changelog](https://keepachangelog.com/),
and this project adheres to
[Semantic Versioning](https://semver.org/).


## [2.2.0] - 2026-10-02

### Added
- `PumpwoodPk` and flexible `retrieve` `pk` — numeric id, base64
  string, or unique-field dict (serialized for the URL path)
- `serializePumpwoodPkForPath` and `dumpPumpwoodPkDict` — parity with
  pumpwood-communication `CompositePkBase64Converter.dump_dict`
- `save` — optional `upsert` query param (insert when pk not found)


## [2.1.0] - 2026-08-18

### Added
- `PumpwoodClient.listDimensions` and `ListDimensionsService` — POST
  `/{modelClass}/list-dimensions/` with `filter_dict` and
  `exclude_dict`
- `PumpwoodClient.listDimensionValues` and `ListDimensionValuesService`
  — POST `/{modelClass}/list-dimension-values/` with `filter_dict`,
  `exclude_dict`, and `key`
- `IListDimensionsParams` and `IListDimensionValuesParams`
- `buildListDimensionsRequest` and `buildListDimensionValuesRequest`
  in `build-request-params`


## [2.0.0] - 2026-08-17

Breaking client API: CRUD methods take one flattened params
object instead of positional arguments.

### Added
- `PumpwoodClient.listByChunks` and `ListByChunksService` — repeated
  `list` calls with `id__gt` cursor pagination (`order_by: ["id"]`)
- `IListByChunksParams` with optional `chunkSize` (default `100`) and
  `maxItems` (no default cap)
- `PumpwoodClient.aggregate` and `AggregateService` — POST
  `/{modelClass}/aggregate/` with `group_by`, `agg`, filters,
  and ordering
- Aggregate types: `IAggregateParams`, `IAggregateAgg`,
  `IAggregateSpec`, `AggregateFunction`
- `buildAggregateRequest` — backend defaults for
  `filter_dict`, `exclude_dict`, `order_by`, and
  `show_deleted`
- `build-request-params` — maps flattened client params to the
  Pumpwood HTTP channel (POST body vs query string)
- Typed params: `IListParams`, `IListWithoutPagParams`,
  `IRetrieveParams`, `ISaveParams`, `IUploadFileParams`,
  `IDeleteParams`, `IRetrieveFileParams`,
  `IRetrieveOptionsParams`, `IExtraOptions`
- `delete` — `force_delete` and `base_filter_skip` as query
  params
- `retrieveFile` — forwards `base_filter_skip` and
  `extraOptions` as extra query params
- Defaults aligned with the backend: `list.limit` is `50`;
  `filter_dict` / `exclude_dict` default to `{}`;
  `foreign_key_fields` / `related_fields` default to `true`;
  `default_fields` defaults to `false`
- `extraOptions` — escape hatch for parameters not yet typed
  by the library (same channel as the other params of the
  method)

### Changed
- `PumpwoodClient` CRUD methods now take a single object with
  `modelClass` at the top. Call sites must migrate from
  positional args (`list(modelClass, body, queryParams)`) to
  `{ modelClass, ... }`
- Control fields (`fields`, `foreign_key_fields`,
  `related_fields`, `default_fields`, `base_filter_skip`) sit
  at the top of the params object, not inside `body` or a
  separate `options` bag
- `list` / `listWithoutPag` send filters in the POST body;
  `base_filter_skip` goes on the query string
- `retrieve`, `save`, `uploadFile`, `delete`, and
  `retrieveFile` send control params as query params
- `save` still nests the model payload in `body`;
  `uploadFile` still nests metadata in `jsonData`
- README documents the flattened contract, defaults, cursor
  pagination, and `extraOptions`

### Removed
- Positional signatures for `list`, `listWithoutPag`,
  `retrieve`, `retrieveOptions`, `save`, `delete`,
  `uploadFile`, and `retrieveFile`
- `list` no longer accepts `offset`; page with
  `exclude_dict.pk__in`
- `listWithoutPag` no longer accepts `limit`
- `IRetrieveOptions` and `ISaveOptions` (replaced by the
  flattened param types)

## [1.0.1] - 2026-06-24

### Changed
- npm publish workflow no longer runs the test job before
  publish

## [1.0.0] - 2026-06-24

First stable public release as
`@murabei-data-science/pumpwood-services`.

### Added
- `PumpwoodClient` with `TokenProvider` (static token or
  factory re-evaluated per request)
- CRUD and file services: `list`, `listWithoutPag`,
  `retrieve`, `retrieveOptions`, `save`, `delete`,
  `uploadFile`, `retrieveFile`
- Action services: `executeAction`, `executeStaticAction`,
  `executeActionFile`, `executeStaticActionFile`
- Auth helpers: `loginWithCredentials`, `loginWithSSO`,
  `getSSOToken`
- `onUnauthorized` callback on HTTP 401, plus
  `isUnauthorizedError` / `normalizeToErrorDict`
- Tuple responses `[data, error]` via `safeAwait`

### Changed
- Package renamed from `pumpwood-services` to
  `@murabei-data-science/pumpwood-services`
- Modular exports (`src/core`, `src/services`, `src/types`)
- npm publish triggered on published GitHub releases (OIDC)

### Fixed
- Login services preserve HTTP status on error responses
