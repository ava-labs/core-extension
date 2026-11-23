import { container } from 'tsyringe';

import { getCoreApiKey, Monitoring } from '@core/common';

import { AppCheckService } from '../AppCheckService';
import { getAuthHeaders } from './getAuthHeaders';

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  getCoreApiKey: jest.fn(),
  Monitoring: {
    ...jest.requireActual('@core/common').Monitoring,
    sentryCaptureException: jest.fn(),
  },
}));

const getAppcheckToken = jest.fn();

describe('src/services/appcheck/utils/getAuthHeaders', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    jest
      .spyOn(container, 'resolve')
      .mockReturnValue({ getAppcheckToken } as unknown as AppCheckService);

    jest.mocked(getCoreApiKey).mockResolvedValue('core-proxy-api-key');
  });

  it('reads the Core API key from the runtime proxy key', async () => {
    getAppcheckToken.mockResolvedValue({ token: 'appcheck-token' });

    await getAuthHeaders();

    expect(getCoreApiKey).toHaveBeenCalledWith('proxy');
  });

  it('returns both the AppCheck and Core API key headers when a token is available', async () => {
    getAppcheckToken.mockResolvedValue({ token: 'appcheck-token' });

    await expect(getAuthHeaders()).resolves.toEqual({
      'X-Firebase-AppCheck': 'appcheck-token',
      'X-Core-Api-Key': 'core-proxy-api-key',
    });
  });

  it('omits the Core API key header when no proxy key is stored', async () => {
    jest.mocked(getCoreApiKey).mockResolvedValue(undefined);
    getAppcheckToken.mockResolvedValue({ token: 'appcheck-token' });

    await expect(getAuthHeaders()).resolves.toEqual({
      'X-Firebase-AppCheck': 'appcheck-token',
    });
  });

  it('returns only the Core API key header when no token is available', async () => {
    getAppcheckToken.mockResolvedValue(undefined);

    await expect(getAuthHeaders()).resolves.toEqual({
      'X-Core-Api-Key': 'core-proxy-api-key',
    });
  });

  it('returns no headers when there is neither a token nor a Core API key', async () => {
    jest.mocked(getCoreApiKey).mockResolvedValue(undefined);
    getAppcheckToken.mockResolvedValue(undefined);

    await expect(getAuthHeaders()).resolves.toEqual({});
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
