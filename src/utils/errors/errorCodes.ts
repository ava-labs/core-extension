import { FireblocksErrorCode } from '@src/background/services/fireblocks/models';
import { SeedlessError } from '@src/background/services/seedless/models';
import { UnifiedBridgeError } from '@src/background/services/unifiedBridge/models';
import { SeedphraseImportError } from '@src/background/services/wallet/handlers/models';
import { VMModuleError } from '@src/background/vmModules/models';
import { KeystoreError } from '@src/utils/keystore/models';

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
  | CommonError
  | UnifiedBridgeError
  | SeedphraseImportError
  | KeystoreError
  | SeedlessError
  | VMModuleError
  | SecretsError
  | AccountError
  | LedgerError;
