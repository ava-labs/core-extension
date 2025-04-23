import { bufferToBase64Url } from 'packages/utils/src/encoding';
import { convertRequest } from './convertRequest';
import { FIDOApiEndpoint } from './types';

describe('src/utils/seedless/fido/convertRequest', () => {
  describe('for /register endpoint', () => {
    const endpoint = FIDOApiEndpoint.Register;

    it('converts buffers to base64url before stringifying', () => {
      const request = convertRequest(endpoint, {
        user: {
          id: Buffer.from('id'),
        },
        challenge: Buffer.from('challenge'),
      } as any);

      const expectedRequest = JSON.stringify({
        user: {
          id: bufferToBase64Url(Buffer.from('id')),
        },
        challenge: bufferToBase64Url(Buffer.from('challenge')),
      });

      expect(request).toEqual(expectedRequest);
    });

    it('does not modify the value of "rpId" proeprty', () => {
      // ...as it will be properly configured by the FIDO Identity API (identity.core.app)

      expect(
        convertRequest(endpoint, {
          rpId: 'cubist.dev',
        } as any),
      ).toEqual(
        JSON.stringify({
          rpId: 'cubist.dev',
        }),
      );
    });
  });

  describe('for /authenticate endpoint', () => {
    const endpoint = FIDOApiEndpoint.Authenticate;

    it('converts buffers to base64url before stringifying', () => {
      const request = convertRequest(endpoint, {
        user: {
          id: Buffer.from('id'),
        },
        challenge: Buffer.from('challenge'),
      } as any);

      const expectedRequest = JSON.stringify({
        user: {
          id: bufferToBase64Url(Buffer.from('id')),
        },
        challenge: bufferToBase64Url(Buffer.from('challenge')),
      });

      expect(request).toEqual(expectedRequest);
    });

    it('does not modify the value of "rp" object', () => {
      // ...as it will be configured by the FIDO Identity API (identity.core.app)

      expect(
        convertRequest(endpoint, {
          rp: {
            id: 'cubist.dev',
            name: 'Cubist',
          },
        } as any),
      ).toEqual(
        JSON.stringify({
          rp: {
            id: 'cubist.dev',
            name: 'Cubist',
          },
        }),
      );
    });
  });

  it('raises an error for unknown API endpoints', () => {
    expect(() =>
      convertRequest('IDontKnow' as FIDOApiEndpoint, {} as any),
    ).toThrow('Unsupported FIDO identity endpoint');
  });
});
