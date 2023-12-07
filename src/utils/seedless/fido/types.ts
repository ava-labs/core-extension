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
    userHandle: BufferLikeValue<T>;
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
