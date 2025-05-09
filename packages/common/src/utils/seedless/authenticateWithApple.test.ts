import { authenticateWithApple } from './authenticateWithApple';
import { launchWebAuthFlow } from './launchWebAuthFlow';

jest.mock('./launchWebAuthFlow', () => ({
  launchWebAuthFlow: jest.fn(),
}));

describe('src/utils/seedless/authenticateWithApple', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    (launchWebAuthFlow as jest.Mock).mockReturnValue('token');
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should throw an error when the Ouath is not configured', () => {
    expect(authenticateWithApple()).rejects.toThrow(
      'Apple OAuth not configured',
    );
  });

  it('should return with an OIDC token', () => {
    const uuid = 'uuid';
    (crypto.randomUUID as jest.Mock).mockReturnValueOnce(uuid);
    const searchParamsSetterMock = jest.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.URL = jest.fn().mockImplementationOnce(function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.searchParams = {
        set: searchParamsSetterMock,
      };
    });

    process.env = {
      ...OLD_ENV,
      APPLE_OAUTH_CLIENT_ID: 'clientId',
      APPLE_OAUTH_REDIRECT_URL: 'URL',
    };

    expect(authenticateWithApple()).resolves.toBe('token');

    expect(globalThis.URL).toHaveBeenCalledTimes(1);
    expect(globalThis.URL).toHaveBeenCalledWith(
      'https://appleid.apple.com/auth/authorize',
    );

    const searchParams = [
      {
        key: 'client_id',
        value: 'clientId',
      },
      {
        key: 'nonce',
        value: uuid,
      },
      {
        key: 'response_type',
        value: 'code id_token',
      },
      {
        key: 'state',
        value: `https://${chrome.runtime.id}.chromiumapp.org`,
      },
      {
        key: 'redirect_uri',
        value: 'URL',
      },
      {
        key: 'scope',
        value: 'email',
      },
      {
        key: 'response_mode',
        value: 'form_post',
      },
    ];

    for (const { key, value } of searchParams) {
      expect(searchParamsSetterMock).toHaveBeenCalledWith(key, value);
    }

    expect(launchWebAuthFlow).toHaveBeenCalledWith(
      jest.mocked(global.URL).mock.instances[0],
    );
  });
});
