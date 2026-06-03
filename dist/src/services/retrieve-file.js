"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrieveFileService = void 0;
const safe_await_js_1 = require("../core/safe-await.js");
/**
 * Retrieves a file for a given model from the API.
 * Returns a Blob that allows the caller to manage URL lifecycle (create/revoke).
 * ⚠️ NOT SERIALIZABLE for SSR - use only on client-side or same-side server operations.
 * @param {ApiService} api - An instance of the ApiService.
 * @param {string} modelClass - The name of the model class to retrieve from.
 * @param {number} pk - The primary key of the item to retrieve.
 * @param {string} fileField - The name of the file field to retrieve (default: "file").
 * @returns {Promise<[IFileData | null, IErrorDict | null]>} A tuple containing the file data (blob) or an error.
 *
 * @example
 * const [fileData, error] = await RetrieveFileService(api, "documents", 123, "file");
 * if (error) console.error("Failed to retrieve file:", error);
 * else {
 *   const url = URL.createObjectURL(fileData.blob);
 *   window.open(url);
 *   // Don't forget to revoke when done:
 *   URL.revokeObjectURL(url);
 * }
 */
const RetrieveFileService = async (api, modelClass, pk, fileField = "file") => {
    const normalizedModelClass = modelClass.toLowerCase();
    const queryParams = { "file-field": fileField };
    const [response, error] = await (0, safe_await_js_1.safeAwait)(api.fileRequest(`/${normalizedModelClass}/retrieve-file/${String(pk)}/`, queryParams));
    if (error) {
        console.error("==> RetrieveFileService ERROR:", error);
        return [null, error];
    }
    return [response, null];
};
exports.RetrieveFileService = RetrieveFileService;
//# sourceMappingURL=retrieve-file.js.map