import { DestinationTransferPeerPath, TransactionStatus } from 'fireblocks-sdk';
import { KeyLike } from 'jose';

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

export const BTC_ACCESS_ERROR_PREFIX = `FireblocksBtcAccessError:`;

export enum FireblocksBtcAccessErrorCode {
  VaultAccountNotFound,
  BTCAddressNotFound,
  InvalidSecretKey,
  WrongAccountType,
  SecretsNotConfigured,
}

export class FireblocksBtcAccessError extends Error {
  constructor(public code: FireblocksBtcAccessErrorCode) {
    super(`${BTC_ACCESS_ERROR_PREFIX}${code}`);
  }
}

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

// On Testnet Fireblocks workspaces, we require the connected vault to have one of those wallets created.
export const TESTNET_LOOKUP_ASSETS = [
  'AVAXTEST', // Avalanche Fuji
  'ETH_TEST3', // Ethereum Goerli
  'ETH_TEST4', // Ethereum Rinkeby
];

// On Mainnet Fireblocks workspaces, we require the connected vault to have one of those wallets created.
// We need such a wallet to be created, so that we can find the vault account used to connect via WalletConnect.
// Knowing the vault account allows us to find the matching BTC address.
export const MAINNET_LOOKUP_ASSETS = ['AVAX'];

export const FIREBLOCKS_REQUEST_EXPIRY = 120 * 60; // 2 hours, used only by WalletConnect connections

export interface FireblocksSecretsProvider {
  getSecrets(): Promise<{ apiKey: string; privateKey: KeyLike }>;
}
