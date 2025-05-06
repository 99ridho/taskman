export type ErrorType =
  | 'BAD_REQUEST'
  | 'SERVER_ERROR'
  | 'UNAUTHORIZED'
  | 'UNPROCESSED_ENTITY'
  | 'FORBIDDEN'
  | 'NOT_FOUND';

export interface GeneralError extends Error {
  details?: {
    path: (string | number)[];
    message: string;
  }[];
  payload?: any;
  errorType: ErrorType;
}

export interface HTTPError extends Error {
  statusCode?: number;
}

export function toJson(err: GeneralError): {
  type: string;
  details?: {
    path: (string | number)[];
    message: string;
  }[];
  message: string;
  statusCode: number;
} {
  const mappingErrorTypeStatusCode = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    UNAUTHORIZED: 401,
    UNPROCESSED_ENTITY: 422,
    FORBIDDEN: 403,
  };

  return {
    type: err.errorType,
    details: err.details,
    message: err.message,
    statusCode: mappingErrorTypeStatusCode[err.errorType],
  };
}
