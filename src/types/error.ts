export interface IErrorDict {
  __error__: string;
  type: string;
  message: string;
  message_not_fmt: string;
  payload: Record<string, any>;
  parallel: boolean;
  status?: number;
}

export function createHttpError(status: number, message: string): Error {
  const error = new Error(message) as Error & { status: number };
  error.status = status;
  return error;
}

export function isUnauthorizedError(error: IErrorDict | null | undefined): boolean {
  return error?.status === 401;
}

export function normalizeToErrorDict(error: unknown): IErrorDict {
  const unknownFallback = (message: string): IErrorDict => ({
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

  const raw = error as Error & Record<string, any>;
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
