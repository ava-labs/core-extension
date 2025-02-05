import type { TotpChallenge } from '@cubist-labs/cubesigner-sdk';
import type {
  DecodedFIDOResult,
  KeyType,
} from '@src/utils/seedless/fido/types';

export const TOTP_ISSUER = 'Core' as const;

export class CoreApiError extends Error {}

export enum SeedlessEvents {
  TokenExpired = 'token-expired',
  TokenRefreshed = 'token-refreshed',
  MfaRequest = 'mfa-request',
  MfaFailure = 'mfa-failure',
  MfaClear = 'mfa-clear',
  MfaMethodsUpdated = 'mfa-methods-updated',
  MfaChoiceRequest = 'mfa-choice-request',
}

export enum MfaRequestType {
  Totp = 'totp',
  Fido = 'fido',
  FidoRegister = 'FidoRegister',
}

export enum SeedlessError {
  NoMfaMethodAvailable = 'no-mfa-method-available',
}

export type RecoveryMethodTotp = {
  type: MfaRequestType.Totp;
};
export type RecoveryMethodFido = {
  id: string;
  name: string;
  type: MfaRequestType.Fido;
};

export type GetRecoveryMethodsOptions = {
  excludeFido?: boolean;
  excludeTotp?: boolean;
};
export type RecoveryMethod = RecoveryMethodFido | RecoveryMethodTotp;

export enum RecoveryMethodType {
  Passkey = 'Passkey',
  Yubikey = 'Yubikey',
  Authenticator = 'Authenticator',
}

export type TotpResetChallenge = Pick<TotpChallenge, 'totpId' | 'totpUrl'>;

export enum AuthErrorCode {
  InvalidTotpCode = 'invalid-totp-code',
  TotpVerificationError = 'totp-verification-error',
  NoMfaDetails = 'no-mfa-details',
  UnknownError = 'unknown-error',
  UnsupportedProvider = 'unsupported-provider',
  FailedToFetchOidcToken = 'failed-to-fetch-oidc-token',
  MismatchingEmail = 'mismatching-email',
  MissingUserId = 'missing-user-id',
  MismatchingUserId = 'mismatching-user-id',
  UnsupportedMfaMethod = 'unsupported-mfa-method',
  FidoChallengeNotApproved = 'fido-challenge-not-approved',
  FidoChallengeFailed = 'fido-challenge-failed',
  NoMfaMethodsConfigured = 'no-mfa-methods-configured',
  WrongMfaResponseAttempt = 'wrong-mfa-response-attempt',
}

export enum FidoDeviceType {
  Passkey = 'Passkey',
  Yubikey = 'Yubikey',
}

export type MfaRequestData = MfaTotpRequest | MfaFidoRequest;

export type MfaChoiceRequest = {
  mfaId: string;
  availableMethods: RecoveryMethod[];
  tabId?: number;
};

export type MfaChoiceResponse = {
  mfaId: string;
  chosenMethod: RecoveryMethod;
};

export type MfaFidoRequest =
  | {
      type: MfaRequestType.Fido;
      options?: any;
      mfaId: string;
      tabId?: number;
    }
  | {
      type: MfaRequestType.FidoRegister;
      options?: any;
      keyType: KeyType;
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
export type MfaClearData = MfaFailureData;

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
