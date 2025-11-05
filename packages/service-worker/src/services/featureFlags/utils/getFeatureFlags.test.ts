import { FeatureGates } from '@core/types';
import { getFeatureFlags } from './getFeatureFlags';
import { DISABLED_FLAG_VALUES } from '@core/common';
describe('src/background/services/featureFlags/utils/getFeatureFlags', () => {
  const realEnv = process.env;
  let realFetch;

  beforeAll(() => {
    process.env = {
      ...realEnv,
      PROXY_URL: 'https://proxy.api',
    };
  });

  afterAll(() => {
    process.env = realEnv;
  });

  beforeEach(() => {
    jest.resetAllMocks();
    realFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        featureFlags: { [FeatureGates.BRIDGE]: false },
        featureFlagPayloads: { [FeatureGates.DEFI]: '>=1.60.0' },
      }),
    });
  });

  afterEach(() => {
    global.fetch = realFetch;
  });

  const testResponseData = () => {
    it('does not omit disabled flags', async () => {
      const { flags } = await getFeatureFlags(
        'token',
        'userID',
        'https://example.com',
      );

      expect(flags).toEqual({
        ...DISABLED_FLAG_VALUES,
        [FeatureGates.BRIDGE]: false,
      });
    });

    it('returns the feature flag payloads', async () => {
      const { flagPayloads } = await getFeatureFlags(
        'token',
        'userID',
        'https://example.com',
      );

      expect(flagPayloads).toEqual(
        expect.objectContaining({
          [FeatureGates.DEFI]: '>=1.60.0',
        }),
      );
    });
  };

  it('throws if no token is provided', async () => {
    await expect(getFeatureFlags()).rejects.toThrow(new Error('Invalid token'));
    await expect(getFeatureFlags('')).rejects.toThrow(
      new Error('Invalid token'),
    );
  });

  describe('cached value from proxy api', () => {
    it('properly calls proxy api', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(1234);

      await getFeatureFlags('token', 'userID', 'https://example.com');

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.PROXY_URL}/proxy/posthog/decide?ip=0&_=1234&v=3&ver=1.20.0`,
        {
          body: 'data=eyJ0b2tlbiI6InRva2VuIiwiZGlzdGluY3RfaWQiOiJ1c2VySUQiLCJncm91cHMiOnt9fQ%3D%3D',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          method: 'POST',
        },
      );
    });

    testResponseData();
  });

  describe('directly from posthog api', () => {
    beforeEach(() => {
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: jest.fn().mockResolvedValue({ error: 'Internal Server Error' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({
            featureFlags: { [FeatureGates.BRIDGE]: false },
            featureFlagPayloads: { [FeatureGates.DEFI]: '>=1.60.0' },
          }),
        });
    });

    it('throws if no posthogURL is provided', async () => {
      await expect(getFeatureFlags('token', undefined)).rejects.toThrow(
        new Error('Invalid Posthog URL'),
      );
    });

    it('throws if provided posthogURL is empty', async () => {
      await expect(getFeatureFlags('token', undefined, '')).rejects.toThrow(
        new Error('Invalid Posthog URL'),
      );
    });

    it('properly calls posthog api with userID', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(1234);

      await getFeatureFlags('token', 'userID', 'https://example.com');

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(
        1,
        `${process.env.PROXY_URL}/proxy/posthog/decide?ip=0&_=1234&v=3&ver=1.20.0`,
        {
          body: 'data=eyJ0b2tlbiI6InRva2VuIiwiZGlzdGluY3RfaWQiOiJ1c2VySUQiLCJncm91cHMiOnt9fQ%3D%3D',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          method: 'POST',
        },
      );
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        `https://example.com/decide?ip=0&_=1234&v=3&ver=1.20.0`,
        {
          body: 'data=eyJ0b2tlbiI6InRva2VuIiwiZGlzdGluY3RfaWQiOiJ1c2VySUQiLCJncm91cHMiOnt9fQ%3D%3D',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          method: 'POST',
        },
      );
    });

    it('properly calls posthog api with no userID', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(1234);

      await getFeatureFlags('token', '', 'https://example.com');

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(
        1,
        `${process.env.PROXY_URL}/proxy/posthog/decide?ip=0&_=1234&v=3&ver=1.20.0`,
        {
          body: 'data=eyJ0b2tlbiI6InRva2VuIiwiZGlzdGluY3RfaWQiOiJjb3JlLWV4dGVuc2lvbiIsImdyb3VwcyI6e319',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          method: 'POST',
        },
      );
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        `https://example.com/decide?ip=0&_=1234&v=3&ver=1.20.0`,
        {
          body: 'data=eyJ0b2tlbiI6InRva2VuIiwiZGlzdGluY3RfaWQiOiJjb3JlLWV4dGVuc2lvbiIsImdyb3VwcyI6e319',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          method: 'POST',
        },
      );
    });

    testResponseData();
  });

  describe('error handling', () => {
    it('throws error when HTTP response is not ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({
          error: 'Internal Server Error',
        }),
      });

      await expect(
        getFeatureFlags('token', 'userID', 'https://example.com'),
      ).rejects.toThrow('Request failed with status 500');
    });

    it('throws error when response does not match schema - missing featureFlags', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          // Missing featureFlags field
          featureFlagPayloads: { [FeatureGates.DEFI]: '>=1.60.0' },
        }),
      });

      await expect(
        getFeatureFlags('token', 'userID', 'https://example.com'),
      ).rejects.toThrow();
    });

    it('throws error when response does not match schema - invalid featureFlag type', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          featureFlags: { [FeatureGates.BRIDGE]: 'invalid' }, // Should be boolean, not string
          featureFlagPayloads: { [FeatureGates.DEFI]: '>=1.60.0' },
        }),
      });

      await expect(
        getFeatureFlags('token', 'userID', 'https://example.com'),
      ).rejects.toThrow();
    });

    it('throws error when response does not match schema - invalid featureFlagPayloads type', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          featureFlags: { [FeatureGates.BRIDGE]: false },
          featureFlagPayloads: { [FeatureGates.DEFI]: 123 }, // Should be string, not number
        }),
      });

      await expect(
        getFeatureFlags('token', 'userID', 'https://example.com'),
      ).rejects.toThrow();
    });

    it('handles 404 error when proxy fails', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: jest.fn().mockResolvedValue({ error: 'Not Found' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({
            featureFlags: { [FeatureGates.BRIDGE]: false },
            featureFlagPayloads: { [FeatureGates.DEFI]: '>=1.60.0' },
          }),
        });

      const result = await getFeatureFlags(
        'token',
        'userID',
        'https://example.com',
      );

      expect(result.flags).toEqual({
        ...DISABLED_FLAG_VALUES,
        [FeatureGates.BRIDGE]: false,
      });
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('throws error when both proxy and posthog fail with non-ok status', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: jest.fn().mockResolvedValue({ error: 'Internal Server Error' }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 503,
          json: jest.fn().mockResolvedValue({ error: 'Service Unavailable' }),
        });

      await expect(
        getFeatureFlags('token', 'userID', 'https://example.com'),
      ).rejects.toThrow('Request failed with status 503');
    });
  });
});
