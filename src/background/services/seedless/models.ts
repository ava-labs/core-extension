import { DecodedFIDOResult } from '@src/utils/seedless/fido/types';

export class CoreApiError extends Error {}

export enum SeedlessEvents {
  TokenExpired = 'token-expired',
  TokenRefreshed = 'token-refreshed',
  MfaRequest = 'mfa-request',
  MfaFailure = 'mfa-failure',
}

export enum MfaRequestType {
  Totp = 'Totp',
  Fido = 'Fido',
}

export type MfaRequestData = MfaTotpRequest | MfaFidoRequest;

export type MfaFidoRequest = {
  type: MfaRequestType.Fido;
  options?: any;
  mfaId: string;
  tabId?: number;
};
export type MfaTotpRequest = {
  type: MfaRequestType.Totp;
  mfaId: string;
  options?: never;
  tabId?: number;
};

export type MfaFailureData = {
  mfaId: string;
  tabId?: number;
};

export type MfaResponseData =
  | {
      mfaId: string;
      code: string;
      answer?: DecodedFIDOResult;
    }
  | {
      mfaId: string;
      code?: never;
      answer: any;
    };
