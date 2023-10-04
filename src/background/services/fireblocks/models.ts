import { DestinationTransferPeerPath, TransactionStatus } from 'fireblocks-sdk';

export type KnownAddressDictionary = Map<string, DestinationTransferPeerPath>;

export const TRANSACTION_POLLING_INTERVAL_MS = 2000;

export const TX_SUBMISSION_FAILURE_STATUSES = [
  TransactionStatus.BLOCKED,
  TransactionStatus.CANCELLED,
  TransactionStatus.CANCELLING,
  TransactionStatus.TIMEOUT,
  TransactionStatus.FAILED,
  TransactionStatus.REJECTED,
];

type FireblocksApiErrorResponse = { code: number; message: string };

export class FireblocksError extends Error {
  // @see https://developers.fireblocks.com/reference/api-responses
  constructor(
    message: string,
    public originalError?: Error | FireblocksApiErrorResponse
  ) {
    super(`Fireblocks: ${message}`);
  }
}

export class NetworkError extends Error {
  constructor(public originalError: Error) {
    super(originalError.message);
  }
}
