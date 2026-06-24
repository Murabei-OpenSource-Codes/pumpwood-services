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

export interface IRetrieveOptions {
  foreign_key_fields?: boolean;
  related_fields?: boolean;
  [key: string]: boolean | string | number | undefined;
}

export interface ISaveOptions {
  foreign_key_fields?: boolean;
  related_fields?: boolean;
  [key: string]: boolean | string | number | undefined;
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
