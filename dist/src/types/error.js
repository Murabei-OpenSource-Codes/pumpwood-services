"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpError = createHttpError;
exports.isUnauthorizedError = isUnauthorizedError;
exports.normalizeToErrorDict = normalizeToErrorDict;
function createHttpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}
function isUnauthorizedError(error) {
    return error?.status === 401;
}
function normalizeToErrorDict(error) {
    const unknownFallback = (message) => ({
        __error__: "UnknownError",
        type: "UnknownError",
        message,
        message_not_fmt: message,
        payload: {},
        parallel: false,
    });
    if (!(error instanceof Error)) {
        return unknownFallback(String(error));
    }
    const raw = error;
    const isPumpWood = typeof raw.__error__ === "string" && raw.__error__ === "PumpWoodException";
    if (isPumpWood) {
        return {
            __error__: raw.__error__,
            type: typeof raw.type === "string" ? raw.type : "UnknownType",
            message: typeof raw.apiMessage === "string" ? raw.apiMessage : raw.message,
            message_not_fmt: typeof raw.message_not_fmt === "string" ? raw.message_not_fmt : raw.message,
            payload: raw.payload && typeof raw.payload === "object" ? raw.payload : {},
            parallel: typeof raw.parallel === "boolean" ? raw.parallel : false,
            ...(typeof raw.status === "number" && { status: raw.status }),
        };
    }
    if (typeof raw.status === "number") {
        const isUnauthorized = raw.status === 401;
        return {
            __error__: isUnauthorized ? "UnauthorizedError" : "HttpError",
            type: isUnauthorized ? "Unauthorized" : "HttpError",
            message: raw.message,
            message_not_fmt: raw.message,
            payload: {},
            parallel: false,
            status: raw.status,
        };
    }
    return unknownFallback(raw.message);
}
//# sourceMappingURL=error.js.map