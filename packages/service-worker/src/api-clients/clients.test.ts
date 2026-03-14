jest.unmock('~/api-clients');
jest.mock('@avalabs/core-utils-sdk');

import * as clients from '~/api-clients';

import { wait } from '@avalabs/core-utils-sdk';
import { Request } from 'cross-fetch';
global.Request = Request;

jest.mock('tsyringe', () => ({
  ...jest.requireActual('tsyringe'),
  container: {
    ...jest.requireActual('tsyringe').container,
    resolve: jest.fn().mockReturnValue({
      getAppcheckToken: jest.fn().mockResolvedValue({
        token: 'appCheckTokenMock',
      }),
    }),
  },
}));

describe('api-clients', () => {
  it('should apply back off to the balance api client', async () => {
    const balanceApiClient = clients.balanceApiClient;
    const mockFetch = jest.fn();
    const textFn = jest.fn().mockResolvedValue('lorem');
    const getResponse = (ok: boolean) =>
      ({
        ok,
        status: ok ? 200 : 500,
        text: textFn,
        headers: new Headers(),
      }) as unknown as Response;

    mockFetch
      .mockResolvedValue(getResponse(true))
      .mockResolvedValueOnce(getResponse(false))
      .mockResolvedValueOnce(getResponse(false))
      .mockResolvedValueOnce(getResponse(false))
      .mockResolvedValueOnce(getResponse(false))
      .mockResolvedValueOnce(getResponse(false))
      .mockResolvedValueOnce(getResponse(false));

    const requests: any[] = [];
    for (let i = 0; i < 10; i++) {
      requests.push(
        await balanceApiClient.request({
          method: 'GET',
          baseUrl: 'http://it-is-mocked.test:3000',
          url: 'anyway',
          fetch: mockFetch,
          parseAs: 'text',
        }),
      );
    }

    expect(requests.length).toBe(10);
    expect(wait).toHaveBeenCalledTimes(6);
  });
});
