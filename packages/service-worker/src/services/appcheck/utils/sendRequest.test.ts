import { sendRequest } from './sendRequest';

describe('sendRequest', () => {
  const realEnv = process.env;
  const realFetch = global.fetch;

  const responseMock = {
    ok: true,
  };

  beforeEach(() => {
    process.env = { ...realEnv };
    global.fetch = jest.fn();

    jest
      .mocked(global.fetch)
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
    process.env.NODE_ENV = 'production';
    process.env.ID_SERVICE_URL = 'https://test.com';

    const response = await sendRequest({
      path: 'test',
      payload: { foo: 'bar' },
    });

    expect(response).toStrictEqual(responseMock);
    expect(global.fetch).toHaveBeenCalledWith('https://test.com/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Version': '0.0.0',
        'X-App-Type': 'extension',
        'X-App-Manifest':
          'eyJtYW5pZmVzdF92ZXJzaW9uIjozLCJ2ZXJzaW9uIjoiMC4wLjAifQ==',
      },
      body: JSON.stringify({ foo: 'bar' }),
    });
  });

  it('sends a request to the ID service properly on development environment', async () => {
    process.env.NODE_ENV = 'development';
    process.env.ID_SERVICE_URL = 'https://test.com';
    process.env.ID_SERVICE_API_KEY = 'testkey';

    const response = await sendRequest({
      path: 'test',
      payload: { foo: 'bar' },
    });

    expect(response).toStrictEqual(responseMock);
    expect(global.fetch).toHaveBeenCalledWith('https://test.com/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Version': '0.0.0',
        'X-App-Type': 'extension',
        'X-App-Manifest':
          'eyJtYW5pZmVzdF92ZXJzaW9uIjozLCJ2ZXJzaW9uIjoiMC4wLjAifQ==',
        'X-Api-Key': 'testkey',
      },
      body: JSON.stringify({ foo: 'bar' }),
    });
  });
});
