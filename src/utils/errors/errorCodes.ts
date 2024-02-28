import { FireblocksErrorCode } from '@src/background/services/fireblocks/models';
import { UnifiedBridgeError } from '@src/background/services/unifiedBridge/models';
import { SeedphraseImportError } from '@src/background/services/wallet/handlers/models';
import { KeystoreError } from '@src/utils/keystore/models';

export enum CommonError {
  Unknown = 'unknown',
  UserRejected = 'user-rejected',
  NetworkError = 'network-error',
  NoActiveAccount = 'no-active-account',
  NoActiveNetwork = 'no-active-network',
  UnknownNetwork = 'unknown-network',
  UnknownNetworkFee = 'unknown-network-fee',
}

export type ErrorCode =
  | FireblocksErrorCode
  | CommonError
  | UnifiedBridgeError
  | SeedphraseImportError
  | KeystoreError;
