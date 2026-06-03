export interface IErrorDict {
    __error__: string;
    type: string;
    message: string;
    message_not_fmt: string;
    payload: Record<string, any>;
    parallel: boolean;
}
export declare function normalizeToErrorDict(error: unknown): IErrorDict;
//# sourceMappingURL=error.d.ts.map