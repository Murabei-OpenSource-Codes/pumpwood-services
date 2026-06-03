"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeToErrorDict = normalizeToErrorDict;
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
    if (!isPumpWood) {
        return unknownFallback(raw.message);
    }
    return {
        __error__: raw.__error__,
        type: typeof raw.type === "string" ? raw.type : "UnknownType",
        message: typeof raw.apiMessage === "string" ? raw.apiMessage : raw.message,
        message_not_fmt: typeof raw.message_not_fmt === "string" ? raw.message_not_fmt : raw.message,
        payload: raw.payload && typeof raw.payload === "object" ? raw.payload : {},
        parallel: typeof raw.parallel === "boolean" ? raw.parallel : false,
    };
}
//# sourceMappingURL=error.js.map