import { FireblocksErrorCode } from '@src/background/services/fireblocks/models';
import { SeedlessError } from '@src/background/services/seedless/models';
import { UnifiedBridgeError } from '@src/background/services/unifiedBridge/models';
import { SeedphraseImportError } from '@src/background/services/wallet/handlers/models';
import { VMModuleError } from '@src/background/vmModules/models';
import { SwapErrorCode } from '@src/contexts/SwapProvider/models';
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
  UnableToSign = 'unable-to-sign',
  UnableToEstimateGas = 'unable-to-estimate-gas',
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
  | VMModuleError;
