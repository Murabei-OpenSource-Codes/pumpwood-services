import type { IFileData, IPumpwoodClientConfig, ILoginResult, ILoginSSOResult, IGetSSOTokenResult, IRetrieveOptions, ISaveOptions, TokenProvider } from "../types/http.js";
import type { IErrorDict } from "../types/error.js";
import { ApiService } from "./api-service.js";
import { ListService } from "../services/list.js";
import { ListWithoutPagService } from "../services/list-without-pag.js";
import { RetrieveService } from "../services/retrieve.js";
import { RetrieveOptionsService } from "../services/retrieve-options.js";
import { RetrieveFileService } from "../services/retrieve-file.js";
import { SaveService } from "../services/save.js";
import { DeleteService } from "../services/delete.js";
import { UploadFileService } from "../services/upload.js";
import { ExecuteActionService } from "../services/execute-action.js";
import { ExecuteStaticActionService } from "../services/execute-static-action.js";
import { ExecuteActionFileService } from "../services/execute-action-file.js";
import { ExecuteStaticActionFileService } from "../services/execute-static-action-file.js";
import { LoginService } from "../services/login.js";
import { LoginSSOService } from "../services/login-sso.js";
import { GetSSOTokenService } from "../services/get-sso-token.js";

type BuildApi = () => Promise<ApiService>;

async function resolveToken(token: TokenProvider): Promise<string> {
  if (typeof token === "function") {
    return await token();
  }
  return token;
}

function optionsToQueryParams(
  options: Record<string, boolean | string | number | undefined>
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(options)) {
    if (value === undefined || value === null) continue;
    result[key] = String(value);
  }
  return result;
}

export class PumpwoodClient {
  readonly list: <T>(modelClass: string, body?: any, queryParams?: Record<string, string>) => Promise<[T | null, IErrorDict | null]>;
  readonly listWithoutPag: <T>(modelClass: string, body?: any, queryParams?: Record<string, string>) => Promise<[T | null, IErrorDict | null]>;
  readonly retrieve: <T>(modelClass: string, pk: number, options?: IRetrieveOptions) => Promise<[T | null, IErrorDict | null]>;
  readonly retrieveFile: (modelClass: string, pk: number, fileField?: string) => Promise<[IFileData | null, IErrorDict | null]>;
  readonly retrieveOptions: <T>(modelClass: string, body?: Record<string, any>) => Promise<[T | null, IErrorDict | null]>;
  readonly save: <T>(modelClass: string, body: Record<any, any>, options?: ISaveOptions) => Promise<[T | null, IErrorDict | null]>;
  readonly delete: <T = void>(modelClass: string, pk: number) => Promise<[T | null, IErrorDict | null]>;
  readonly uploadFile: <T>(modelClass: string, file: File, jsonData: Record<string, any>, queryParams?: Record<string, string>) => Promise<[T | null, IErrorDict | null]>;
  readonly executeAction: <T = any>(params: { modelClass: string; pk: number; actionName: string; parameters?: Record<string, any>; queryParams?: Record<string, string> }) => Promise<[T | null, IErrorDict | null]>;
  readonly executeStaticAction: <T = any>(params: { modelClass: string; actionName: string; parameters?: Record<string, any>; queryParams?: Record<string, string> }) => Promise<[T | null, IErrorDict | null]>;
  readonly executeActionFile: (params: { modelClass: string; pk: number; actionName: string; parameters?: Record<string, any>; queryParams?: Record<string, string> }) => Promise<[IFileData | null, IErrorDict | null]>;
  readonly executeStaticActionFile: (params: { modelClass: string; actionName: string; parameters?: Record<string, any>; queryParams?: Record<string, string> }) => Promise<[IFileData | null, IErrorDict | null]>;
  readonly loginWithCredentials: (credentials: { username: string; password: string }) => Promise<[ILoginResult | null, IErrorDict | null]>;
  readonly loginWithSSO: (email: string) => Promise<[ILoginSSOResult | null, IErrorDict | null]>;
  readonly getSSOToken: (url: string) => Promise<[IGetSSOTokenResult | null, IErrorDict | null]>;

  constructor({ baseUrl, token }: IPumpwoodClientConfig) {
    const buildApi: BuildApi = async () => {
      const resolvedToken = await resolveToken(token);
      return new ApiService({ baseUrl, token: resolvedToken });
    };

    this.list = async <T>(modelClass: string, body?: any, queryParams?: Record<string, string>) => {
      return ListService<T>(await buildApi(), modelClass, body, queryParams);
    };

    this.listWithoutPag = async <T>(modelClass: string, body?: any, queryParams?: Record<string, string>) => {
      return ListWithoutPagService<T>(await buildApi(), modelClass, body, queryParams);
    };

    this.retrieve = async <T>(modelClass: string, pk: number, options?: IRetrieveOptions) => {
      const queryParams = options ? optionsToQueryParams(options) : undefined;
      return RetrieveService<T>(await buildApi(), modelClass, pk, queryParams);
    };

    this.retrieveFile = async (modelClass: string, pk: number, fileField?: string) => {
      return RetrieveFileService(await buildApi(), modelClass, pk, fileField);
    };

    this.retrieveOptions = async <T>(modelClass: string, body?: Record<string, any>) => {
      return RetrieveOptionsService<T>(await buildApi(), modelClass, body);
    };

    this.save = async <T>(modelClass: string, body: Record<any, any>, options?: ISaveOptions) => {
      const queryParams = options ? optionsToQueryParams(options) : undefined;
      return SaveService<T>(await buildApi(), modelClass, body, queryParams);
    };

    this.delete = async <T = void>(modelClass: string, pk: number) => {
      return DeleteService<T>(await buildApi(), modelClass, pk);
    };

    this.uploadFile = async <T>(modelClass: string, file: File, jsonData: Record<string, any>, queryParams?: Record<string, string>) => {
      return UploadFileService<T>(await buildApi(), modelClass, file, jsonData, queryParams);
    };

    this.executeAction = async <T = any>({ modelClass, pk, actionName, parameters, queryParams }: { modelClass: string; pk: number; actionName: string; parameters?: Record<string, any>; queryParams?: Record<string, string> }) => {
      return ExecuteActionService<T>({ api: await buildApi(), modelClass, pk, actionName, ...(parameters !== undefined && { parameters }), ...(queryParams !== undefined && { queryParams }) });
    };

    this.executeStaticAction = async <T = any>({ modelClass, actionName, parameters, queryParams }: { modelClass: string; actionName: string; parameters?: Record<string, any>; queryParams?: Record<string, string> }) => {
      return ExecuteStaticActionService<T>({ api: await buildApi(), modelClass, actionName, ...(parameters !== undefined && { parameters }), ...(queryParams !== undefined && { queryParams }) });
    };

    this.executeActionFile = async ({ modelClass, actionName, parameters, queryParams }: { modelClass: string; actionName: string; parameters?: Record<string, any>; queryParams?: Record<string, string> }) => {
      return ExecuteActionFileService({ api: await buildApi(), modelClass, actionName, ...(parameters !== undefined && { parameters }), ...(queryParams !== undefined && { queryParams }) });
    };

    this.executeStaticActionFile = async ({ modelClass, actionName, parameters, queryParams }: { modelClass: string; actionName: string; parameters?: Record<string, any>; queryParams?: Record<string, string> }) => {
      return ExecuteStaticActionFileService({ api: await buildApi(), modelClass, actionName, ...(parameters !== undefined && { parameters }), ...(queryParams !== undefined && { queryParams }) });
    };

    this.loginWithCredentials = async (credentials: { username: string; password: string }) => {
      return LoginService(baseUrl, credentials);
    };

    this.loginWithSSO = async (email: string) => {
      return LoginSSOService(baseUrl, email);
    };

    this.getSSOToken = async (url: string) => {
      return GetSSOTokenService(url);
    };
  }
}
