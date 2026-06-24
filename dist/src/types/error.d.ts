export interface IErrorDict {
    __error__: string;
    type: string;
    message: string;
    message_not_fmt: string;
    payload: Record<string, any>;
    parallel: boolean;
    status?: number;
}
export declare function createHttpError(status: number, message: string): Error;
export declare function isUnauthorizedError(error: IErrorDict | null | undefined): boolean;
export declare function normalizeToErrorDict(error: unknown): IErrorDict;
//# sourceMappingURL=error.d.ts.map