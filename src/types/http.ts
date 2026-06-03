export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface IFileData {
  blob: Blob;
  contentType: string;
}

export interface ApiServiceConfig {
  baseUrl: string;
  token: string;
}
