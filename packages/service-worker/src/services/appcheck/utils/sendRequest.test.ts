import { getCoreApiKey } from '@core/common';

import { sendRequest } from './sendRequest';

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  getCoreApiKey: jest.fn(),
}));

describe('sendRequest', () => {
  const realEnv = process.env;
  const realFetch = global.fetch;

  const responseMock = {
    ok: true,
  };

  const baseHeaders = {
    'Content-Type': 'application/json',
    'X-App-Version': '0.0.0',
    'X-App-Type': 'extension',
    'X-App-Manifest':
      'eyJtYW5pZmVzdF92ZXJzaW9uIjozLCJ2ZXJzaW9uIjoiMC4wLjAifQ==',
  };

  beforeEach(() => {
    process.env = { ...realEnv, ID_SERVICE_URL: 'https://test.com' };
    global.fetch = jest.fn();

    jest
      .mocked(global.fetch)
      .mockResolvedValueOnce(responseMock as unknown as Response);
    jest.mocked(getCoreApiKey).mockResolvedValue(undefined);
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

  it('sends a request without an API key when none is stored', async () => {
    const response = await sendRequest({
      path: 'test',
      payload: { foo: 'bar' },
    });

    expect(response).toStrictEqual(responseMock);
    expect(getCoreApiKey).toHaveBeenCalledWith('idService');
    expect(global.fetch).toHaveBeenCalledWith('https://test.com/test', {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify({ foo: 'bar' }),
    });
  });

  it('adds the stored ID service API key', async () => {
    jest.mocked(getCoreApiKey).mockResolvedValue('testkey');

    const response = await sendRequest({
      path: 'test',
      payload: { foo: 'bar' },
    });

    expect(response).toStrictEqual(responseMock);
    expect(global.fetch).toHaveBeenCalledWith('https://test.com/test', {
      method: 'POST',
      headers: { ...baseHeaders, 'X-Api-Key': 'testkey' },
      body: JSON.stringify({ foo: 'bar' }),
    });
  });
});
