export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface IFileData {
  blob: Blob;
  contentType: string;
}

export interface ApiServiceConfig {
  baseUrl: string;
  token: string;
}

export type TokenProvider = string | (() => string | Promise<string>);

export interface IPumpwoodClientConfig {
  baseUrl: string;
  token: TokenProvider;
}
