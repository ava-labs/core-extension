import { EthereumRpcError, ethErrors } from 'eth-rpc-errors';
import { CommonError, ErrorCode } from './errorCodes';

export type ErrorData = {
  reason: ErrorCode;
  originalError?: unknown;
  [key: string]: any;
};

export interface WrappedError extends EthereumRpcError<ErrorData> {
  data: ErrorData;
}

export const isWrappedError = (maybeErr: unknown): maybeErr is WrappedError => {
  return (
    typeof maybeErr === 'object' &&
    maybeErr !== null &&
    'code' in maybeErr &&
    'data' in maybeErr &&
    typeof maybeErr.code === 'number' &&
    typeof maybeErr.data === 'object' &&
    maybeErr.data !== null &&
    'reason' in maybeErr.data
  );
};

export function wrapError(
  fallbackError?: WrappedError | Error | string
): (err: unknown) => never {
  return (err: unknown) => {
    if (isWrappedError(err)) {
      throw err;
    }

    if (isWrappedError(fallbackError)) {
      throw fallbackError;
    }

    throw ethErrors.rpc.internal({
      data: {
        reason: CommonError.Unknown,
        originalError: fallbackError ?? err,
      },
    });
  };
}

export const isUserRejectionError = (err: any) => {
  if (!err) {
    return false;
  }

  if (typeof err === 'object') {
    return err.message?.startsWith('User rejected') || err.code === 4001;
  }

  return false;
};
