import { EthereumRpcError } from 'eth-rpc-errors';

export type ErrorData = {
  reason: ErrorCode;
  originalError?: unknown;
  [key: string]: any;
};

export interface WrappedError extends EthereumRpcError<ErrorData> {
  data: ErrorData;
}

export enum KeystoreError {
  InvalidPassword = 'keystore-invalid-password',
  InvalidVersion = 'keystore-invalid-version',
  NoNewWallets = 'keystore-no-new-wallets',
  Unknown = 'keystore-unknown-error',
}

export enum SwapErrorCode {
  ClientNotInitialized = 'client-not-initialized',
  MissingParams = 'missing-params',
  CannotFetchAllowance = 'cannot-fetch-allowance',
  MissingContractMethod = 'missing-contract-method',
  ApiError = 'api-error',
  UnknownSpender = 'unknown-spender',
  UnexpectedApiResponse = 'unexpected-api-response',
  CannotBuildTx = 'cannot-build-tx',
  InvalidParams = 'invalid-params',
  FeatureDisabled = 'feature-disabled',
  TransactionError = 'transaction-error',
  IncorrectTokenAddress = 'incorrect-token-address',
  WrongQuoteProvider = 'wrong-quote-provider',
  CannotFetchSpender = 'cannot-fetch-spender',
  ApprovalTxFailed = 'approval-tx-failed',
  InvalidSlippageTolerance = 'invalid-slippage-tolerance',
  InsufficientBalance = 'insufficient-balance',
}

export enum VMModuleError {
  UnsupportedChain = 'unsupported-chain',
  UnsupportedMethod = 'unsupported-method',
  UnsupportedNamespace = 'unsupported-namespace',
  ModulesNotInitialized = 'modules-not-initialized',
}

export enum SeedphraseImportError {
  ExistingSeedphrase = 'existing-seedphrase',
}

export enum UnifiedBridgeError {
  UnknownAsset = 'unknown-asset',
  AmountLessThanFee = 'amount-less-than-fee',
  InvalidFee = 'invalid-fee',
  UnsupportedNetwork = 'unsupported-network',
  InvalidTxPayload = 'invalid-tx-payload',
  NonBitcoinAccount = 'non-bitcoin-account',
  MissingChainId = 'missing-chain-id',
}

export enum SeedlessError {
  NoMfaMethodAvailable = 'no-mfa-method-available',
}

export enum FireblocksErrorCode {
  Failed = 'fireblocks-tx-failed',
  Blocked = 'fireblocks-tx-blocked',
  Cancelled = 'fireblocks-tx-cancelled',
  Rejected = 'fireblocks-tx-rejected',
  Timeout = 'fireblocks-tx-timeout',
  Unknown = 'fireblocks-tx-unknown-error',
}

export enum CommonError {
  InvalidAmount = 'invalid-amount',
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
  MismatchingProvider = 'mismatching-provider',
}

export enum LedgerError {
  TransportNotFound = 'ledger-transport-not-found',
  NoPublicKeyReturned = 'ledger-no-public-key-returned',
  NoExtendedPublicKeyReturned = 'ledger-no-extended-public-key-returned',
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
  MissingPublicKeys = 'missing-public-keys',
}

export enum AccountError {
  EVMAddressNotFound = 'evm-address-not-found',
  BTCAddressNotFound = 'btc-address-not-found',
  SVMAddressNotFound = 'svm-address-not-found',
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
