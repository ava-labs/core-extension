import { base64UrlToBuffer } from '@src/utils/encoding';
import { convertResult } from './convertResult';
import type {
  EncodedFIDOAuthenticationResult,
  EncodedFIDORegistrationResult,
} from './types';

describe('src/utils/seedless/fido/convertResult', () => {
  const encodedAuthenticationResult: EncodedFIDOAuthenticationResult = {
    id: 'id',
    rawId: 'cmF3SWQ=',
    response: {
      authenticatorData: 'YXV0aGVudGljYXRvckRhdGE=',
      clientDataJSON: 'Y2xpZW50RGF0YUpTT04=',
      signature: 'c2lnbmF0dXJl',
      userHandle: null,
    },
  };

  const encodedRegistrationResult: EncodedFIDORegistrationResult = {
    id: 'id',
    rawId: 'cmF3SWQ=',
    response: {
      clientDataJSON: 'Y2xpZW50RGF0YUpTT04=',
      attestationObject: 'YXR0ZXN0YXRpb25PYmplY3Q=',
    },
  };

  it('converts known Base64Url-encoded properties in auth responses to Buffers', () => {
    expect(convertResult(encodedAuthenticationResult)).toEqual({
      id: 'id',
      rawId: base64UrlToBuffer(encodedAuthenticationResult.rawId),
      response: {
        authenticatorData: base64UrlToBuffer(
          encodedAuthenticationResult.response.authenticatorData,
        ),
        clientDataJSON: base64UrlToBuffer(
          encodedAuthenticationResult.response.clientDataJSON,
        ),
        signature: base64UrlToBuffer(
          encodedAuthenticationResult.response.signature,
        ),
        userHandle: null,
      },
    });
  });

  it('converts known Base64Url-encoded properties in registration responses to Buffers', () => {
    expect(convertResult(encodedRegistrationResult)).toEqual({
      id: 'id',
      rawId: base64UrlToBuffer(encodedRegistrationResult.rawId),
      response: {
        attestationObject: base64UrlToBuffer(
          encodedRegistrationResult.response.attestationObject,
        ),
        clientDataJSON: base64UrlToBuffer(
          encodedRegistrationResult.response.clientDataJSON,
        ),
      },
    });
  });

  it('does not modify null or not-defined properties', () => {
    const result = convertResult(encodedAuthenticationResult) as any;

    expect(result.response.userHandle as any).toBeNull();
  });
});
