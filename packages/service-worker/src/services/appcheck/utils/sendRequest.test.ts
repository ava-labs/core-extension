import { sendRequest } from './sendRequest';

describe('sendRequest', () => {
  const realEnv = process.env;
  const realFetch = global.fetch;

  const manifestResponseMock = {
    json: jest.fn(),
  };

  const responseMock = {
    ok: true,
  };

  beforeEach(() => {
    process.env = { ...realEnv };
    global.fetch = jest.fn();

    jest.mocked(manifestResponseMock.json).mockResolvedValue({
      version: '0.0.0',
    });

    jest
      .mocked(global.fetch)
      .mockResolvedValueOnce(manifestResponseMock as unknown as Response)
      .mockResolvedValueOnce(responseMock as unknown as Response);
  });

  afterEach(() => {
    process.env = realEnv;
    global.fetch = realFetch;
  });

  it('throws when ID_SERVICE_URL is missing', async () => {
    process.env.ID_SERVICE_URL = undefined;

    await expect(() =>
      sendRequest({ path: 'test', payload: {} }),
    ).rejects.toThrow('ID_SERVICE_URL is missing');
  });

  it('sends a request to the ID service properly on non-development environments', async () => {
    // @ts-expect-error - NODE_ENV is read-only
    process.env.NODE_ENV = 'production';
    process.env.ID_SERVICE_URL = 'https://test.com';

    const response = await sendRequest({
      path: 'test',
      payload: { foo: 'bar' },
    });

    expect(response).toStrictEqual(responseMock);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      chrome.runtime.getURL('manifest.json'),
    );
    expect(global.fetch).toHaveBeenNthCalledWith(2, 'https://test.com/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Version': '0.0.0',
        'X-App-Type': 'extension',
        'X-App-Manifest': 'W1sidmVyc2lvbiIsIjAuMC4wIl1d',
      },
      body: JSON.stringify({ foo: 'bar' }),
    });
  });

  it('sends a request to the ID service properly on development environment', async () => {
    // @ts-expect-error - NODE_ENV is read-only
    process.env.NODE_ENV = 'development';
    process.env.ID_SERVICE_URL = 'https://test.com';
    process.env.ID_SERVICE_API_KEY = 'testkey';

    const response = await sendRequest({
      path: 'test',
      payload: { foo: 'bar' },
    });

    expect(response).toStrictEqual(responseMock);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      chrome.runtime.getURL('manifest.json'),
    );
    expect(global.fetch).toHaveBeenNthCalledWith(2, 'https://test.com/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Version': '0.0.0',
        'X-App-Type': 'extension',
        'X-App-Manifest': 'W1sidmVyc2lvbiIsIjAuMC4wIl1d',
        'X-Api-Key': 'testkey',
      },
      body: JSON.stringify({ foo: 'bar' }),
    });
  });
});
