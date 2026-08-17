import type {
  IFileData,
  IPumpwoodClientConfig,
  ILoginResult,
  ILoginSSOResult,
  IGetSSOTokenResult,
  IListParams,
  IListWithoutPagParams,
  IRetrieveParams,
  ISaveParams,
  IUploadFileParams,
  IDeleteParams,
  IRetrieveFileParams,
  IRetrieveOptionsParams,
  IAggregateParams,
  TokenProvider,
} from "../types/http.js";
import type { IErrorDict } from "../types/error.js";
import { ApiService } from "./api-service.js";
import {
  buildAggregateRequest,
  buildDeleteQueryParams,
  buildListRequest,
  buildListWithoutPagRequest,
  buildRetrieveFileQueryParams,
  buildRetrieveQueryParams,
  buildSaveRequest,
  buildUploadFileQueryParams,
} from "./build-request-params.js";
import { ListService } from "../services/list.js";
import { ListWithoutPagService } from "../services/list-without-pag.js";
import { AggregateService } from "../services/aggregate.js";
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

export class PumpwoodClient {
  readonly list: <T>(params: IListParams) => Promise<[T | null, IErrorDict | null]>;
  readonly listWithoutPag: <T>(params: IListWithoutPagParams) => Promise<[T | null, IErrorDict | null]>;
  readonly aggregate: <T>(params: IAggregateParams) => Promise<[T | null, IErrorDict | null]>;
  readonly retrieve: <T>(params: IRetrieveParams) => Promise<[T | null, IErrorDict | null]>;
  readonly retrieveFile: (params: IRetrieveFileParams) => Promise<[IFileData | null, IErrorDict | null]>;
  readonly retrieveOptions: <T>(params: IRetrieveOptionsParams) => Promise<[T | null, IErrorDict | null]>;
  readonly save: <T>(params: ISaveParams) => Promise<[T | null, IErrorDict | null]>;
  readonly delete: <T = void>(params: IDeleteParams) => Promise<[T | null, IErrorDict | null]>;
  readonly uploadFile: <T>(params: IUploadFileParams) => Promise<[T | null, IErrorDict | null]>;
  readonly executeAction: <T = any>(params: { modelClass: string; pk: number; actionName: string; parameters?: Record<string, any>; queryParams?: Record<string, string> }) => Promise<[T | null, IErrorDict | null]>;
  readonly executeStaticAction: <T = any>(params: { modelClass: string; actionName: string; parameters?: Record<string, any>; queryParams?: Record<string, string> }) => Promise<[T | null, IErrorDict | null]>;
  readonly executeActionFile: (params: { modelClass: string; pk: number; actionName: string; parameters?: Record<string, any>; queryParams?: Record<string, string> }) => Promise<[IFileData | null, IErrorDict | null]>;
  readonly executeStaticActionFile: (params: { modelClass: string; actionName: string; parameters?: Record<string, any>; queryParams?: Record<string, string> }) => Promise<[IFileData | null, IErrorDict | null]>;
  readonly loginWithCredentials: (credentials: { username: string; password: string }) => Promise<[ILoginResult | null, IErrorDict | null]>;
  readonly loginWithSSO: (email: string) => Promise<[ILoginSSOResult | null, IErrorDict | null]>;
  readonly getSSOToken: (url: string) => Promise<[IGetSSOTokenResult | null, IErrorDict | null]>;

  constructor({ baseUrl, token, onUnauthorized }: IPumpwoodClientConfig) {
    const buildApi: BuildApi = async () => {
      const resolvedToken = await resolveToken(token);
      return new ApiService({
        baseUrl,
        token: resolvedToken,
        ...(onUnauthorized !== undefined && { onUnauthorized }),
      });
    };

    this.list = async <T>(params: IListParams) => {
      const { body, queryParams } = buildListRequest(params);
      return ListService<T>(await buildApi(), params.modelClass, body, queryParams);
    };

    this.listWithoutPag = async <T>(params: IListWithoutPagParams) => {
      const { body, queryParams } = buildListWithoutPagRequest(params);
      return ListWithoutPagService<T>(await buildApi(), params.modelClass, body, queryParams);
    };

    this.aggregate = async <T>(params: IAggregateParams) => {
      const body = buildAggregateRequest(params);
      return AggregateService<T>(await buildApi(), params.modelClass, body);
    };

    this.retrieve = async <T>(params: IRetrieveParams) => {
      const { modelClass, pk } = params;
      const queryParams = buildRetrieveQueryParams(params);
      return RetrieveService<T>(await buildApi(), modelClass, pk, queryParams);
    };

    this.retrieveFile = async (params: IRetrieveFileParams) => {
      const { modelClass, pk, fileField } = params;
      const queryParams = buildRetrieveFileQueryParams(params);
      return RetrieveFileService(await buildApi(), modelClass, pk, fileField, queryParams);
    };

    this.retrieveOptions = async <T>({ modelClass }: IRetrieveOptionsParams) => {
      return RetrieveOptionsService<T>(await buildApi(), modelClass);
    };

    this.save = async <T>(params: ISaveParams) => {
      const { body, queryParams } = buildSaveRequest(params);
      return SaveService<T>(await buildApi(), params.modelClass, body, queryParams);
    };

    this.delete = async <T = void>(params: IDeleteParams) => {
      const queryParams = buildDeleteQueryParams(params);
      return DeleteService<T>(await buildApi(), params.modelClass, params.pk, queryParams);
    };

    this.uploadFile = async <T>(params: IUploadFileParams) => {
      const { modelClass, file, jsonData } = params;
      const queryParams = buildUploadFileQueryParams(params);
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
