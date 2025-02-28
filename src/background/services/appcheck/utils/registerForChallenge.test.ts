import registerForChallenge from './registerForChallenge';

describe('registerForChallenge', () => {
  const realEnv = process.env;
  const realFetch = global.fetch;
  const params = {
    token: 'token',
    requestId: 'requestId',
  };

  beforeEach(() => {
    jest.resetAllMocks();

    global.fetch = jest.fn();
    process.env = {
      ...realEnv,
      ID_SERVICE_URL: 'https://id.com',
    };
  });

  afterAll(() => {
    global.fetch = realFetch;
    process.env = realEnv;
  });

  it('throws when ID_SERVICE_URL is missing', async () => {
    delete process.env.ID_SERVICE_URL;

    expect(registerForChallenge(params)).rejects.toThrow(
      'ID_SERVICE_URL is missing',
    );
  });

  it('throws when the challenge registration fails', async () => {
    jest.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      statusText: 'internal error',
    } as Response);

    expect(registerForChallenge(params)).rejects.toThrow(
      '[AppCheck] challenge registration error "internal error"',
    );
  });

  it('registers for challenge successfully', async () => {
    chrome.runtime.getManifest = jest
      .fn()
      .mockReturnValueOnce({ version: '0.0.1' });
    jest.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
    } as Response);

    expect(registerForChallenge(params)).resolves.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://id.com/v1/ext/register',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Type': 'extension',
          'X-App-Version': '0.0.1',
        },
        body: JSON.stringify({
          token: 'token',
          requestId: 'requestId',
        }),
      }),
    );
  });
});
