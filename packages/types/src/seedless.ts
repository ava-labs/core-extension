import { TotpChallenge } from '@cubist-labs/cubesigner-sdk';

export enum FIDOApiEndpoint {
  Register = 'register',
  Authenticate = 'authenticate',
}

export type EncodedFIDORegistrationResult = FIDORegistrationResult<true>;
export type DecodedFIDORegistrationResult = FIDORegistrationResult<false>;

export type EncodedFIDOAuthenticationResult = FIDOAuthenticationResult<true>;
export type DecodedFIDOAuthenticationResult = FIDOAuthenticationResult<false>;

export type DecodedFIDOResult =
  | DecodedFIDORegistrationResult
  | DecodedFIDOAuthenticationResult;

export type EncodedFIDOResult =
  | EncodedFIDORegistrationResult
  | EncodedFIDOAuthenticationResult;

export type FIDOApiRequest =
  | FIDORegistrationRequest
  | FIDOAuthenticationRequest;

export enum KeyType {
  Passkey = 'passkey',
  Yubikey = 'yubikey',
}

type Base64UrlString = string;

type BufferLikeValue<T> = T extends true ? Base64UrlString : Buffer;

type FIDORegistrationResult<T> = {
  id: string;
  rawId: BufferLikeValue<T>;
  type?: string;
  response: {
    clientDataJSON: BufferLikeValue<T>;
    attestationObject: BufferLikeValue<T>;
  };
};

type FIDOAuthenticationResult<T> = {
  id: string;
  rawId: BufferLikeValue<T>;
  type?: string;
  response: {
    clientDataJSON: BufferLikeValue<T>;
    authenticatorData: BufferLikeValue<T>;
    signature: BufferLikeValue<T>;
    userHandle: BufferLikeValue<T> | null;
  };
};

interface FIDORegistrationRequest {
  challenge: Buffer;
  rp: {
    id: string;
    name: string;
  };
  user: {
    id: Buffer;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    type: string;
    alg: number;
  }>;
  timeout?: number;
  excludeCredentials?: Array<{
    type: string;
    id: Buffer;
    transports?: Array<string>;
  }>;
  authenticatorSelection?: {
    authenticatorAttachment?: string;
    requireResidentKey?: boolean;
    residentKey?: string;
    userVerification?: string;
  };
  attestation?: string;
  extensions?: Record<string, unknown>;
}

interface FIDOAuthenticationRequest {
  challenge: Buffer;
  rpId: string;
  timeout?: number;
  allowCredentials?: Array<{
    type: string;
    id: Buffer;
    transports?: Array<string>;
  }>;
  userVerification?: string;
  extensions?: Record<string, unknown>;
}

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

export type RecoveryMethodTotp = {
  type: MfaRequestType.Totp;
};
export type RecoveryMethodFido = {
  id: string;
  name: string;
  type: MfaRequestType.Fido;
  aaguid?: string; // Available for passkeys only
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
  TotpConfigurationError = 'totp-configuration-error',
  NoMfaDetails = 'no-mfa-details',
  UnknownError = 'unknown-error',
  UnsupportedProvider = 'unsupported-provider',
  FailedToFetchOidcToken = 'failed-to-fetch-oidc-token',
  MismatchingEmail = 'mismatching-email',
  MissingUserId = 'missing-user-id',
  MismatchingUserId = 'mismatching-user-id',
  UnsupportedMfaMethod = 'unsupported-mfa-method',
  FidoConfigurationError = 'fido-configuration-error',
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

const ExportRecoveryPhrasePrefix = 'Seedless.ExportRecoveryPhrase';

export enum SeedlessExportAnalytics {
  MenuItemClicked = `${ExportRecoveryPhrasePrefix}.MenuItemClicked`,
  Resigned = `${ExportRecoveryPhrasePrefix}.Resigned`,

  PopupOpened = `${ExportRecoveryPhrasePrefix}.PopupOpened`,

  InitiationStarted = `${ExportRecoveryPhrasePrefix}.InitiationStarted`,
  InitiationSucceeded = `${ExportRecoveryPhrasePrefix}.InitiationSucceeded`,
  InitiationFailed = `${ExportRecoveryPhrasePrefix}.InitiationFailed`,

  CancellationStarted = `${ExportRecoveryPhrasePrefix}.CancellationStarted`,
  CancellationSucceeded = `${ExportRecoveryPhrasePrefix}.CancellationSucceeded`,
  CancellationFailed = `${ExportRecoveryPhrasePrefix}.CancellationFailed`,

  DecryptionStarted = `${ExportRecoveryPhrasePrefix}.DecryptionStarted`,
  DecryptionSucceeded = `${ExportRecoveryPhrasePrefix}.DecryptionSucceeded`,
  DecryptionFailed = `${ExportRecoveryPhrasePrefix}.DecryptionFailed`,

  PhraseCopied = `${ExportRecoveryPhrasePrefix}.PhraseCopied`,
}

export enum FIDOSteps {
  NAMING = 'naming',
  REGISTER = 'register',
  LOGIN = 'login',
  ERROR = 'error',
}

// When the user wants to login with a FIDO device, we don't get the device exact type (e.g. passkey or yubikey), only we get the tpye it is 'fido"
// so we need to handle them as a unit in the login process
export enum RecoveryMethodTypes {
  PASSKEY = 'passkey',
  TOTP = 'totp',
  YUBIKEY = 'yubikey',
  FIDO = 'fido',
  UNKNOWN = 'unknown',
}
