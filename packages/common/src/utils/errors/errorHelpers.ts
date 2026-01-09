import { EthereumRpcError, ethErrors } from 'eth-rpc-errors';
import { StatusCodes, TransportStatusError } from '@ledgerhq/hw-transport';
import { Status, TransportError } from '@keystonehq/hw-transport-error';
import { CommonError, ErrorCode, SwapErrorCode } from '@core/types';

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
  fallbackError?: WrappedError | Error | string,
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

const LEDGER_USER_REJECTION_STATUS_CODES = [
  StatusCodes.USER_REFUSED_ON_DEVICE,
  StatusCodes.CONDITIONS_OF_USE_NOT_SATISFIED,
  0x6986, // "Command not allowed", used by Avalanche app. Reference: https://docs.zondax.ch/ledger-apps/polkadot/APDUSPEC#return-codes
];

export const isUserRejectionError = (err: any) => {
  if (!err || typeof err !== 'object') {
    return false;
  }

  if (err instanceof TransportStatusError) {
    return LEDGER_USER_REJECTION_STATUS_CODES.includes(err.statusCode);
  }

  if (err instanceof TransportError) {
    return err.transportErrorCode === Status.PRS_PARSING_REJECTED;
  }

  if (typeof err === 'object') {
    return err.message?.startsWith('User rejected') || err.code === 4001;
  }

  return false;
};

export const isMissingBtcWalletPolicyError = (err: any) => {
  if (!err) {
    return false;
  }

  if (typeof err === 'object') {
    const message = err.data?.originalError || err.message;
    return message?.includes('Error while parsing wallet policy');
  }

  return false;
};

export const isSwapTxBuildError = (err: unknown) => {
  if (!err) {
    return false;
  }

  if (isWrappedError(err)) {
    return err.data.reason === SwapErrorCode.CannotBuildTx;
  }

  return false;
};

export const isGasEstimationError = (err: unknown) => {
  if (!err) {
    return false;
  }

  if (isWrappedError(err)) {
    return err.data.reason === CommonError.UnableToEstimateGas;
  }

  return false;
};
