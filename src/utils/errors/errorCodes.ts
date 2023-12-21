import { FireblocksErrorCode } from '@src/background/services/fireblocks/models';

export enum CommonError {
  Unknown = 'unknown',
  UserRejected = 'user-rejected',
  NetworkError = 'network-error',
}

export type ErrorCode = FireblocksErrorCode | CommonError;
