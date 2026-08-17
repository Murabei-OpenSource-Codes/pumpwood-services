import type { IFileData, IPumpwoodClientConfig, ILoginResult, ILoginSSOResult, IGetSSOTokenResult, IListParams, IListWithoutPagParams, IRetrieveParams, ISaveParams, IUploadFileParams, IDeleteParams, IRetrieveFileParams, IRetrieveOptionsParams } from "../types/http.js";
import type { IErrorDict } from "../types/error.js";
export declare class PumpwoodClient {
    readonly list: <T>(params: IListParams) => Promise<[T | null, IErrorDict | null]>;
    readonly listWithoutPag: <T>(params: IListWithoutPagParams) => Promise<[T | null, IErrorDict | null]>;
    readonly retrieve: <T>(params: IRetrieveParams) => Promise<[T | null, IErrorDict | null]>;
    readonly retrieveFile: (params: IRetrieveFileParams) => Promise<[IFileData | null, IErrorDict | null]>;
    readonly retrieveOptions: <T>(params: IRetrieveOptionsParams) => Promise<[T | null, IErrorDict | null]>;
    readonly save: <T>(params: ISaveParams) => Promise<[T | null, IErrorDict | null]>;
    readonly delete: <T = void>(params: IDeleteParams) => Promise<[T | null, IErrorDict | null]>;
    readonly uploadFile: <T>(params: IUploadFileParams) => Promise<[T | null, IErrorDict | null]>;
    readonly executeAction: <T = any>(params: {
        modelClass: string;
        pk: number;
        actionName: string;
        parameters?: Record<string, any>;
        queryParams?: Record<string, string>;
    }) => Promise<[T | null, IErrorDict | null]>;
    readonly executeStaticAction: <T = any>(params: {
        modelClass: string;
        actionName: string;
        parameters?: Record<string, any>;
        queryParams?: Record<string, string>;
    }) => Promise<[T | null, IErrorDict | null]>;
    readonly executeActionFile: (params: {
        modelClass: string;
        pk: number;
        actionName: string;
        parameters?: Record<string, any>;
        queryParams?: Record<string, string>;
    }) => Promise<[IFileData | null, IErrorDict | null]>;
    readonly executeStaticActionFile: (params: {
        modelClass: string;
        actionName: string;
        parameters?: Record<string, any>;
        queryParams?: Record<string, string>;
    }) => Promise<[IFileData | null, IErrorDict | null]>;
    readonly loginWithCredentials: (credentials: {
        username: string;
        password: string;
    }) => Promise<[ILoginResult | null, IErrorDict | null]>;
    readonly loginWithSSO: (email: string) => Promise<[ILoginSSOResult | null, IErrorDict | null]>;
    readonly getSSOToken: (url: string) => Promise<[IGetSSOTokenResult | null, IErrorDict | null]>;
    constructor({ baseUrl, token, onUnauthorized }: IPumpwoodClientConfig);
}
//# sourceMappingURL=pumpwood-client.d.ts.map