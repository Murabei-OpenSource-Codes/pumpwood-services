import type { IDeleteParams, IListParams, IListWithoutPagParams, IRetrieveFileParams, IRetrieveParams, ISaveParams, IUploadFileParams } from "../types/http.js";
export interface IRequestParts {
    body: Record<string, unknown>;
    queryParams: Record<string, string>;
}
/** Build POST body and query params for the list end-point. */
export declare function buildListRequest(params: IListParams): IRequestParts;
/** Build POST body and query params for the list-without-pag end-point. */
export declare function buildListWithoutPagRequest(params: IListWithoutPagParams): IRequestParts;
/** Build POST body and query params for the save end-point. */
export declare function buildSaveRequest(params: ISaveParams): IRequestParts;
/** Build query params for the retrieve end-point. */
export declare function buildRetrieveQueryParams(params: IRetrieveParams): Record<string, string>;
/** Build query params for the file upload end-point. */
export declare function buildUploadFileQueryParams(params: IUploadFileParams): Record<string, string>;
/** Build query params for the delete end-point. */
export declare function buildDeleteQueryParams(params: IDeleteParams): Record<string, string>;
/** Build extra query params for the retrieve-file end-point. */
export declare function buildRetrieveFileQueryParams(params: IRetrieveFileParams): Record<string, string>;
//# sourceMappingURL=build-request-params.d.ts.map