export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface IFileData {
  blob: Blob;
  contentType: string;
}

export type UnauthorizedHandler = () => void | Promise<void>;

export interface ApiServiceConfig {
  baseUrl: string;
  token: string;
  onUnauthorized?: UnauthorizedHandler;
}

export type TokenProvider = string | (() => string | Promise<string>);

export interface IPumpwoodClientConfig {
  baseUrl: string;
  token: TokenProvider;
  onUnauthorized?: UnauthorizedHandler;
}

/**
 * Escape hatch for parameters not typed by this library. Values are sent
 * through the same channel (POST body or query string) used by the other
 * parameters of the called method.
 */
export type IExtraOptions = Record<string, unknown>;

export interface IListParams {
  modelClass: string;
  filter_dict?: Record<string, unknown>;
  exclude_dict?: Record<string, unknown>;
  order_by?: string[];
  fields?: string[];
  default_fields?: boolean;
  limit?: number;
  foreign_key_fields?: boolean;
  related_fields?: boolean;
  base_filter_skip?: string[];
  extraOptions?: IExtraOptions;
}

export type IListWithoutPagParams = Omit<IListParams, "limit">;

export interface IRetrieveParams {
  modelClass: string;
  pk: number;
  fields?: string[];
  default_fields?: boolean;
  foreign_key_fields?: boolean;
  related_fields?: boolean;
  base_filter_skip?: string[];
  extraOptions?: IExtraOptions;
}

export interface ISaveParams {
  modelClass: string;
  body: Record<string, unknown>;
  fields?: string[];
  default_fields?: boolean;
  foreign_key_fields?: boolean;
  related_fields?: boolean;
  base_filter_skip?: string[];
  extraOptions?: IExtraOptions;
}

export interface IUploadFileParams {
  modelClass: string;
  file: File;
  jsonData: Record<string, unknown>;
  foreign_key_fields?: boolean;
  related_fields?: boolean;
  extraOptions?: IExtraOptions;
}

export interface IDeleteParams {
  modelClass: string;
  pk: number;
  force_delete?: boolean;
  base_filter_skip?: string[];
  extraOptions?: IExtraOptions;
}

export interface IRetrieveFileParams {
  modelClass: string;
  pk: number;
  fileField?: string;
  base_filter_skip?: string[];
  extraOptions?: IExtraOptions;
}

export interface IRetrieveOptionsParams {
  modelClass: string;
}

export interface ILoginResult {
  token: string;
}

export interface ILoginSSOResult {
  redirect_url: string;
}

export interface IGetSSOTokenUser {
  email: string;
  username: string;
}

export interface IGetSSOTokenResult {
  token: string;
  user: IGetSSOTokenUser;
}
