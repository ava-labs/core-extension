import verifyChallenge from './verifyChallenge';

describe('verifyChallenge', () => {
  const realEnv = process.env;
  const realFetch = global.fetch;
  const params = {
    registrationId: 'registrationId',
    solution: 'solution',
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

    expect(verifyChallenge(params)).rejects.toThrow(
      'ID_SERVICE_URL is missing',
    );
  });

  it('throws when the challenge verification fails', async () => {
    jest.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      statusText: 'internal error',
    } as Response);

    expect(verifyChallenge(params)).rejects.toThrow(
      '[AppCheck] challenge verification error "internal error"',
    );
  });

  it('verifies the challenge solution correctly', async () => {
    chrome.runtime.getManifest = jest
      .fn()
      .mockReturnValueOnce({ version: '0.0.1' });
    jest.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ foo: 'bar' }),
    } as unknown as Response);

    expect(verifyChallenge(params)).resolves.toStrictEqual({ foo: 'bar' });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://id.com/v1/ext/verify',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Type': 'extension',
          'X-App-Version': '0.0.1',
        },
        body: JSON.stringify({
          registrationId: 'registrationId',
          solution: 'solution',
        }),
      }),
    );
  });
});
