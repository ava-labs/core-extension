import { container } from 'tsyringe';

import { Monitoring } from '@core/common';

import { getAuthHeaders } from './getAuthHeaders';

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  Monitoring: {
    ...jest.requireActual('@core/common').Monitoring,
    sentryCaptureException: jest.fn(),
  },
}));

const getAppcheckToken = jest.fn();

describe('src/services/appcheck/utils/getAuthHeaders', () => {
  const realEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();

    jest.spyOn(container, 'resolve').mockReturnValue({
      getAppcheckToken,
    });

    process.env = {
      ...realEnv,
      CORE_PROXY_API_KEY: 'core-proxy-api-key',
    };
  });

  afterAll(() => {
    process.env = realEnv;
  });

  it('returns both the AppCheck and Core API key headers when a token is available', async () => {
    getAppcheckToken.mockResolvedValue({ token: 'appcheck-token' });

    await expect(getAuthHeaders()).resolves.toEqual({
      'X-Firebase-AppCheck': 'appcheck-token',
      'X-Core-Api-Key': 'core-proxy-api-key',
    });
  });

  it('omits the AppCheck header but keeps the Core API key header when no token is available', async () => {
    getAppcheckToken.mockResolvedValue(undefined);

    await expect(getAuthHeaders()).resolves.toEqual({
      'X-Core-Api-Key': 'core-proxy-api-key',
    });
  });

  it('falls back to an empty Core API key header when CORE_PROXY_API_KEY is unset', async () => {
    delete process.env.CORE_PROXY_API_KEY;
    getAppcheckToken.mockResolvedValue({ token: 'appcheck-token' });

    await expect(getAuthHeaders()).resolves.toEqual({
      'X-Firebase-AppCheck': 'appcheck-token',
      'X-Core-Api-Key': '',
    });
  });

  it('reports to Sentry and omits the AppCheck header when fetching the token throws', async () => {
    const error = new Error('appcheck exploded');
    getAppcheckToken.mockRejectedValue(error);

    await expect(getAuthHeaders()).resolves.toEqual({
      'X-Core-Api-Key': 'core-proxy-api-key',
    });

    expect(Monitoring.sentryCaptureException).toHaveBeenCalledWith(
      error,
      Monitoring.SentryExceptionTypes.FIREBASE,
    );
  });
});
