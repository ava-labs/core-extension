import { DestinationTransferPeerPath, TransactionStatus } from 'fireblocks-sdk';
import {
  AddressResponse as _AddressResponse,
  PaginatedAddressesResponse as _PaginatedAddressesResponse,
} from 'fireblocks-sdk';

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

// On Testnet Fireblocks workspaces, we require the connected vault to have one of those wallets created.
export const TESTNET_LOOKUP_ASSETS = [
  'AVAXTEST', // Avalanche Fuji
  'ETH_TEST3', // Ethereum Goerli
  'ETH_TEST4', // Ethereum Rinkeby
  'ETH_TEST5', // Ethereum Sepolia
];

// On Mainnet Fireblocks workspaces, we require the connected vault to have one of those wallets created.
// We need such a wallet to be created, so that we can find the vault account used to connect via WalletConnect.
// Knowing the vault account allows us to find the matching BTC address.
export const MAINNET_LOOKUP_ASSETS = ['AVAX'];

export const FIREBLOCKS_REQUEST_EXPIRY = 120 * 60; // 2 hours, used only by WalletConnect connections

export type AddressResponse = Omit<_AddressResponse, 'type'> & {
  type?: string;
};
// this is used as a replacement for PaginatedAddressesResponse from fireblocks sdk
// due to wrong type declarations
export type PaginatedAddressesResponse = Omit<
  _PaginatedAddressesResponse,
  'addresses'
> & {
  addresses: AddressResponse[];
};
