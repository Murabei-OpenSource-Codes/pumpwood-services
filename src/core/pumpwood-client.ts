import type { IFileData, IPumpwoodClientConfig, TokenProvider } from "../types/http.js";
import type { IErrorDict } from "../types/error.js";
import { ApiService } from "./api-service.js";
import { ListService } from "../services/list.js";
import { RetrieveService } from "../services/retrieve.js";
import { RetrieveFileService } from "../services/retrieve-file.js";
import { SaveService } from "../services/save.js";
import { DeleteService } from "../services/delete.js";
import { UploadFileService } from "../services/upload.js";
import { ExecuteActionService } from "../services/execute-action.js";
import { ExecuteStaticActionService } from "../services/execute-static-action.js";

async function resolveToken(token: TokenProvider): Promise<string> {
  if (typeof token === "function") {
    return await token();
  }
  return token;
}

export class PumpwoodClient {
  private readonly baseUrl: string;
  private readonly token: TokenProvider;

  constructor({ baseUrl, token }: IPumpwoodClientConfig) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private async buildApi(): Promise<ApiService> {
    const resolvedToken = await resolveToken(this.token);
    return new ApiService({ baseUrl: this.baseUrl, token: resolvedToken });
  }

  async list<T>(
    modelClass: string,
    body?: any,
    queryParams?: Record<string, string>
  ): Promise<[T | null, IErrorDict | null]> {
    const api = await this.buildApi();
    return ListService<T>(api, modelClass, body, queryParams);
  }

  async retrieve<T>(
    modelClass: string,
    pk: number,
    queryParams?: Record<string, string>
  ): Promise<[T | null, IErrorDict | null]> {
    const api = await this.buildApi();
    return RetrieveService<T>(api, modelClass, pk, queryParams);
  }

  async retrieveFile(
    modelClass: string,
    pk: number,
    fileField?: string
  ): Promise<[IFileData | null, IErrorDict | null]> {
    const api = await this.buildApi();
    return RetrieveFileService(api, modelClass, pk, fileField);
  }

  async save<T>(
    modelClass: string,
    body: Record<any, any>,
    queryParams?: Record<string, string>
  ): Promise<[T | null, IErrorDict | null]> {
    const api = await this.buildApi();
    return SaveService<T>(api, modelClass, body, queryParams);
  }

  async delete<T = void>(
    modelClass: string,
    pk: number
  ): Promise<[T | null, IErrorDict | null]> {
    const api = await this.buildApi();
    return DeleteService<T>(api, modelClass, pk);
  }

  async uploadFile<T>(
    modelClass: string,
    file: File,
    jsonData: Record<string, any>,
    queryParams?: Record<string, string>
  ): Promise<[T | null, IErrorDict | null]> {
    const api = await this.buildApi();
    return UploadFileService<T>(api, modelClass, file, jsonData, queryParams);
  }

  async executeAction<T = any>({
    modelClass,
    pk,
    actionName,
    parameters,
    queryParams,
  }: {
    modelClass: string;
    pk: number;
    actionName: string;
    parameters?: Record<string, any>;
    queryParams?: Record<string, string>;
  }): Promise<[T | null, IErrorDict | null]> {
    const api = await this.buildApi();
    return ExecuteActionService<T>({
      api,
      modelClass,
      pk,
      actionName,
      ...(parameters !== undefined && { parameters }),
      ...(queryParams !== undefined && { queryParams }),
    });
  }

  async executeStaticAction<T = any>({
    modelClass,
    actionName,
    parameters,
    queryParams,
  }: {
    modelClass: string;
    actionName: string;
    parameters?: Record<string, any>;
    queryParams?: Record<string, string>;
  }): Promise<[T | null, IErrorDict | null]> {
    const api = await this.buildApi();
    return ExecuteStaticActionService<T>({
      api,
      modelClass,
      actionName,
      ...(parameters !== undefined && { parameters }),
      ...(queryParams !== undefined && { queryParams }),
    });
  }
}
