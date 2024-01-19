import { launchWebAuthFlow } from '@src/pages/Onboarding/utils/launchWebAuthFlow';
import { authenticateWithGoogle } from './authenticateWithGoogle';

jest.mock('../../pages/Onboarding/utils/launchWebAuthFlow', () => ({
  launchWebAuthFlow: jest.fn().mockResolvedValue('token'),
}));

describe('src/utils/seedless/authenticateWithGoogle', () => {
  it('should throw an error when the Ouath is not configured', () => {
    expect(authenticateWithGoogle()).rejects.toThrowError(
      'Oauth not configured'
    );
  });

  it('should return with an OIDC token', () => {
    const searchParamsSetterMock = jest.fn();
    const manifestMock = {
      manifest_version: 31,
      version: '0.0.0',
      oauth2: {
        client_id: 'clientId',
        scopes: ['scope1', 'scope2'],
      },
    };

    chrome.runtime.getManifest = jest
      .fn()
      .mockImplementation(() => manifestMock);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.URL = jest.fn().mockImplementationOnce(function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.searchParams = {
        set: searchParamsSetterMock,
      };
    });

    expect(authenticateWithGoogle()).resolves.toBe('token');

    expect(globalThis.URL).toHaveBeenCalledTimes(1);
    expect(globalThis.URL).toHaveBeenCalledWith(
      'https://accounts.google.com/o/oauth2/auth'
    );

    const searchParams = [
      {
        key: 'client_id',
        value: manifestMock.oauth2.client_id,
      },
      {
        key: 'response_type',
        value: 'id_token',
      },
      {
        key: 'redirect_uri',
        value: `https://${chrome.runtime.id}.chromiumapp.org`,
      },
      {
        key: 'scope',
        value: 'scope1 scope2',
      },
    ];

    for (const { key, value } of searchParams) {
      expect(searchParamsSetterMock).toHaveBeenCalledWith(key, value);
    }

    expect(launchWebAuthFlow).toHaveBeenCalledWith(
      jest.mocked(global.URL).mock.instances[0]
    );
  });
});
