import type { IFileData, IPumpwoodClientConfig, IRetrieveOptions, ISaveOptions } from "../types/http.js";
import type { IErrorDict } from "../types/error.js";
export declare class PumpwoodClient {
    readonly list: <T>(modelClass: string, body?: any, queryParams?: Record<string, string>) => Promise<[T | null, IErrorDict | null]>;
    readonly listWithoutPag: <T>(modelClass: string, body?: any, queryParams?: Record<string, string>) => Promise<[T | null, IErrorDict | null]>;
    readonly retrieve: <T>(modelClass: string, pk: number, options?: IRetrieveOptions) => Promise<[T | null, IErrorDict | null]>;
    readonly retrieveFile: (modelClass: string, pk: number, fileField?: string) => Promise<[IFileData | null, IErrorDict | null]>;
    readonly retrieveOptions: <T>(modelClass: string, body?: Record<string, any>) => Promise<[T | null, IErrorDict | null]>;
    readonly save: <T>(modelClass: string, body: Record<any, any>, options?: ISaveOptions) => Promise<[T | null, IErrorDict | null]>;
    readonly delete: <T = void>(modelClass: string, pk: number) => Promise<[T | null, IErrorDict | null]>;
    readonly uploadFile: <T>(modelClass: string, file: File, jsonData: Record<string, any>, queryParams?: Record<string, string>) => Promise<[T | null, IErrorDict | null]>;
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
    constructor({ baseUrl, token }: IPumpwoodClientConfig);
}
//# sourceMappingURL=pumpwood-client.d.ts.map