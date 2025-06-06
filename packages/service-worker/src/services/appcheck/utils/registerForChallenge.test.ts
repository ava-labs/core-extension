import registerForChallenge from './registerForChallenge';
import { sendRequest } from './sendRequest';

jest.mock('./sendRequest');

describe('registerForChallenge', () => {
  const params = {
    token: 'token',
    requestId: 'requestId',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('throws when challenge registration fails', async () => {
    jest.mocked(sendRequest).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'internal error',
    } as Response);

    await expect(registerForChallenge(params)).rejects.toThrow(
      '[AppCheck] challenge registration error "registration failed with status 500: internal error"',
    );

    expect(sendRequest).toHaveBeenCalledWith({
      path: 'v2/ext/register',
      payload: {
        requestId: 'requestId',
      },
      timeout: 10_000,
    });
  });

  it('registers for challenge successfully', async () => {
    jest.mocked(sendRequest).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          registrationId: 'registrationId',
        }),
    } as Response);

    await expect(registerForChallenge(params)).resolves.toStrictEqual({
      registrationId: 'registrationId',
    });

    expect(sendRequest).toHaveBeenCalledWith({
      path: 'v2/ext/register',
      payload: {
        requestId: 'requestId',
      },
      timeout: 10_000,
    });
  });
});
