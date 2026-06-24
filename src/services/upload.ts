import type { IErrorDict } from "../types/error.js";
import type { ApiService } from "../core/api-service.js";
import { safeAwait } from "../core/safe-await.js";

/**
 * Uploads a file with associated JSON data for a given model to the API.
 * @template T - The expected type of the upload response data.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to upload to.
 * @param {File} file - The file to be uploaded.
 * @param {Record<string, any>} jsonData - Additional JSON data to be sent with the file.
 * @param {Record<string, string>} [queryParams] - Optional query parameters to append to the URL.
 * @returns {Promise<[T | null, IErrorDict | null]>} A tuple containing the response data or an error, consistent with safeAwait.
 * 
 * @example
 * const file = document.querySelector('input[type="file"]').files[0];
 * const [result, error] = await UploadFileService(
 *   api, 
 *   "documents", 
 *   file, 
 *   { origin: "USER_UPLOAD", format_type: "MELTED" }
 * );
 * if (error) console.error("Failed to upload file:", error);
 * else console.log("File uploaded successfully:", result);
 */
export const UploadFileService = async <T>(
  api: ApiService,
  modelClass: string,
  file: File,
  jsonData: Record<string, any>,
  queryParams?: Record<string, string>
): Promise<[T | null, IErrorDict | null]> => {
  const normalizedModelClass = modelClass.toLowerCase();

  const formData = new FormData();
  formData.append("__json__", JSON.stringify(jsonData));
  formData.append("file", file);

  const [response, error] = await safeAwait(
    queryParams
      ? api.uploadRequest<T>(`/${normalizedModelClass}/save/`, formData, queryParams)
      : api.uploadRequest<T>(`/${normalizedModelClass}/save/`, formData)
  );

  if (error) {
    console.error("==> UploadFileService ERROR:", error);
    return [null, error];
  }

  return [response, null];
};
