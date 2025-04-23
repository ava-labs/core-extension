import { FireblocksErrorCode } from '@core/service-worker';
import { SeedlessError } from '@core/service-worker';
import { UnifiedBridgeError } from '@core/service-worker';
import { SeedphraseImportError } from '@core/service-worker';
import { VMModuleError } from '@core/service-worker';
import { SwapErrorCode } from '@src/contexts/SwapProvider/models';
import { KeystoreError } from '@core/utils';

export enum CommonError {
  Unknown = 'unknown',
  UserRejected = 'user-rejected',
  NetworkError = 'network-error',
  NoActiveAccount = 'no-active-account',
  NoActiveNetwork = 'no-active-network',
  UnknownNetwork = 'unknown-network',
  UnknownNetworkFee = 'unknown-network-fee',
  RequestTimeout = 'request-timeout',
  MigrationFailed = 'migration-failed',
  ModuleManagerNotSet = 'module-manager-not-set',
  UnableToSign = 'unable-to-sign',
  UnableToEstimateGas = 'unable-to-estimate-gas',
  UnsupportedTokenType = 'unsupported-token-type',
}

export enum LedgerError {
  TransportNotFound = 'ledger-transport-not-found',
  NoPublicKeyReturned = 'ledger-no-public-key-returned',
}

export enum SecretsError {
  SecretsNotFound = 'secrets-not-found',
  UnsupportedSecretType = 'unsupported-secret-type',
  MissingExtendedPublicKey = 'missing-ext-pubkey',
  WalletAlreadyExists = 'wallet-already-exists',
  PublicKeyNotFound = 'public-key-not-found',
  NoAccountIndex = 'no-account-index',
  DerivationPathMissing = 'derivation-path-missing',
  UnknownDerivationPathFormat = 'unknown-derivation-path-format',
  DerivationPathTooShort = 'derivation-path-too-short',
  UnsupportedCurve = 'unsupported-curve',
}

export enum AccountError {
  EVMAddressNotFound = 'evm-address-not-found',
  BTCAddressNotFound = 'btc-address-not-found',
  NoAddressesFound = 'no-addresses-found',
}

export enum RpcErrorCode {
  InsufficientFunds = 'INSUFFICIENT_FUNDS',
}

export type ErrorCode =
  | FireblocksErrorCode
  | SwapErrorCode
  | CommonError
  | UnifiedBridgeError
  | SeedphraseImportError
  | KeystoreError
  | SeedlessError
  | VMModuleError
  | SecretsError
  | AccountError
  | LedgerError;
