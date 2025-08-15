import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { AnalyticsConsent, BlockchainId, FeatureGates } from '@core/types';

import { HttpClient } from '@avalabs/core-utils-sdk';
import { AnalyticsServicePosthog } from './AnalyticsServicePosthog';
import { AnalyticsService } from './AnalyticsService';
import { SettingsService } from '../settings/SettingsService';
import { Monitoring } from '@core/common';
import browser from 'webextension-polyfill';
import { encryptAnalyticsData } from './utils/encryptAnalyticsData';
import { ChainId } from '@avalabs/core-chains-sdk';

jest.mock('@core/common', () => ({
  Monitoring: {
    sentryCaptureException: jest.fn(),
    SentryExceptionTypes: {
      ANALYTICS: 'analytics',
    },
  },
}));
jest.mock('@avalabs/core-utils-sdk');
jest.mock('./utils/encryptAnalyticsData');
jest.mock('webextension-polyfill', () => ({
  runtime: {
    getManifest: jest.fn().mockReturnValue({
      version: '1.0.0',
    }),
    getPlatformInfo: jest.fn(),
  },
}));

describe('src/background/services/analytics/AnalyticsServicePosthog', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Avoid cluttering test logs
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    jest.mocked(browser.runtime.getPlatformInfo).mockResolvedValue({
      os: 'mac',
      arch: 'arm',
    });

    // Mock chrome.runtime.getManifest for AnalyticsServicePosthog
    Object.defineProperty(global, 'chrome', {
      value: {
        runtime: {
          getManifest: jest.fn().mockReturnValue({
            version: '1.0.0',
          }),
        },
      },
      writable: true,
    });
  });

  const dummyEvent = {
    name: 'name',
    windowId: 'windowId',
    properties: { prop: 'value' },
  };

  const buildFlagsService = (enabled = true) =>
    ({
      featureFlags: {
        [FeatureGates.EVENTS]: enabled,
      },
    }) as FeatureFlagService;

  const buildAnalyticsService = (hasData = true) =>
    ({
      getIds: jest.fn().mockResolvedValueOnce(
        hasData
          ? {
              deviceId: 'deviceId',
              userId: 'userId',
            }
          : undefined,
      ),
      getSessionId: jest.fn().mockResolvedValueOnce('sessionId'),
    }) as unknown as AnalyticsService;

  const buildSettingsService = (hasConsent = true) =>
    ({
      getSettings: jest.fn().mockResolvedValue({
        analyticsConsent: hasConsent
          ? AnalyticsConsent.Approved
          : AnalyticsConsent.Denied,
      }),
    }) as unknown as SettingsService;

  describe('.captureEncryptedEvent()', () => {
    const encryptedData = {
      data: 'data',
      enc: 'enc',
      keyID: 'keyID',
    };

    beforeEach(() => {
      jest.mocked(encryptAnalyticsData).mockResolvedValue(encryptedData);
    });

    it('encrypts the properties before sending them to posthog', async () => {
      const service = new AnalyticsServicePosthog(
        buildFlagsService(),
        buildAnalyticsService(),
        buildSettingsService(),
      );

      await service.captureEncryptedEvent(dummyEvent);

      const call = jest.mocked(HttpClient.prototype.post).mock.calls[0];

      const requestBody = call?.[1] as Record<string, any>;

      // Expect request body to contain encrypted data
      expect(requestBody.properties).toEqual(
        expect.objectContaining(encryptedData),
      );

      // Expect request body NOT TO contain unencrypted data
      Object.keys(dummyEvent.properties).forEach((key) => {
        expect(key in requestBody.properties).toBe(false);
      });
    });
  });

  describe('.captureEvent()', () => {
    describe('when no consent is given', () => {
      let service: AnalyticsServicePosthog;

      beforeEach(() => {
        service = new AnalyticsServicePosthog(
          buildFlagsService(),
          buildAnalyticsService(),
          buildSettingsService(false),
        );
      });

      it('does not throw errors', async () => {
        expect(async () => {
          await service.captureEvent(dummyEvent);
        }).not.toThrow();
      });

      it('does not make any requests to PostHog', async () => {
        await service.captureEvent(dummyEvent);

        expect(HttpClient.prototype.get).not.toHaveBeenCalled();
        expect(HttpClient.prototype.post).not.toHaveBeenCalled();
      });
    });

    describe('when analytics is disabled via feature flag', () => {
      let service: AnalyticsServicePosthog;

      beforeEach(() => {
        service = new AnalyticsServicePosthog(
          buildFlagsService(false),
          buildAnalyticsService(),
          buildSettingsService(),
        );
      });

      it('does not throw errors', async () => {
        expect(async () => {
          await service.captureEvent(dummyEvent);
        }).not.toThrow();
      });

      it('does not make any requests to PostHog', async () => {
        await service.captureEvent(dummyEvent);

        expect(HttpClient.prototype.get).not.toHaveBeenCalled();
        expect(HttpClient.prototype.post).not.toHaveBeenCalled();
      });
    });

    describe('when tracking data is not established yet', () => {
      let service: AnalyticsServicePosthog;

      beforeEach(() => {
        service = new AnalyticsServicePosthog(
          buildFlagsService(),
          buildAnalyticsService(false),
          buildSettingsService(),
        );
      });

      it('does not throw errors', async () => {
        expect(async () => {
          await service.captureEvent(dummyEvent);
        }).not.toThrow();
      });

      it('captures the error to Sentry', async () => {
        await service.captureEvent(dummyEvent);

        expect(Monitoring.sentryCaptureException).toHaveBeenCalledWith(
          new Error('Analytics State is not available.'),
          Monitoring.SentryExceptionTypes.ANALYTICS,
        );
      });
    });

    describe('when posthog request fails', () => {
      let service: AnalyticsServicePosthog;

      beforeEach(() => {
        jest
          .mocked(HttpClient.prototype.post)
          .mockRejectedValue(new Error('Failed to fetch'));

        service = new AnalyticsServicePosthog(
          buildFlagsService(),
          buildAnalyticsService(false),
          buildSettingsService(),
        );
      });

      it('does not throw errors', async () => {
        expect(async () => {
          await service.captureEvent(dummyEvent);
        }).not.toThrow();
      });

      it('captures the error to Sentry', async () => {
        await service.captureEvent(dummyEvent);

        expect(Monitoring.sentryCaptureException).toHaveBeenCalledWith(
          new Error('Analytics State is not available.'),
          Monitoring.SentryExceptionTypes.ANALYTICS,
        );
      });
    });

    describe('chainId updates', () => {
      function getEvent(chainId) {
        return {
          name: 'name',
          windowId: 'windowId',
          properties: { chainId },
        };
      }
      let service: AnalyticsServicePosthog;
      beforeEach(() => {
        service = new AnalyticsServicePosthog(
          buildFlagsService(),
          buildAnalyticsService(),
          buildSettingsService(),
        );
      });

      it('should report expected the chainId: AVALANCHE_P', async () => {
        const testEvent = getEvent(ChainId.AVALANCHE_P);
        await service.captureEvent(testEvent);
        expect(HttpClient.prototype.post).toHaveBeenCalledWith(
          '/capture/',
          expect.objectContaining({
            properties: expect.objectContaining({
              chainId: BlockchainId.P_CHAIN,
            }),
          }),
          { headers: { 'Content-Type': 'application/json' } },
        );
      });
      it('should report expected the chainId: AVALANCHE_TEST_P', async () => {
        const testEvent = getEvent(ChainId.AVALANCHE_TEST_P);
        await service.captureEvent(testEvent);
        expect(HttpClient.prototype.post).toHaveBeenCalledWith(
          '/capture/',
          expect.objectContaining({
            properties: expect.objectContaining({
              chainId: BlockchainId.P_CHAIN_TESTNET,
            }),
          }),
          { headers: { 'Content-Type': 'application/json' } },
        );
      });
      it('should report expected the chainId: AVALANCHE_X', async () => {
        const testEvent = getEvent(ChainId.AVALANCHE_X);
        await service.captureEvent(testEvent);
        expect(HttpClient.prototype.post).toHaveBeenCalledWith(
          '/capture/',
          expect.objectContaining({
            properties: expect.objectContaining({
              chainId: BlockchainId.X_CHAIN,
            }),
          }),
          { headers: { 'Content-Type': 'application/json' } },
        );
      });
      it('should report expected the chainId: AVALANCHE_TEST_X', async () => {
        const testEvent = getEvent(ChainId.AVALANCHE_TEST_X);
        await service.captureEvent(testEvent);
        expect(HttpClient.prototype.post).toHaveBeenCalledWith(
          '/capture/',
          expect.objectContaining({
            properties: expect.objectContaining({
              chainId: BlockchainId.X_CHAIN_TESTNET,
            }),
          }),
          { headers: { 'Content-Type': 'application/json' } },
        );
      });
      it('should report expected the chainId', async () => {
        const testEvent = getEvent(ChainId.AVALANCHE_MAINNET_ID);
        await service.captureEvent(testEvent);
        expect(HttpClient.prototype.post).toHaveBeenCalledWith(
          '/capture/',
          expect.objectContaining({
            properties: expect.objectContaining({
              chainId: ChainId.AVALANCHE_MAINNET_ID,
            }),
          }),
          { headers: { 'Content-Type': 'application/json' } },
        );
      });
    });

    it('records events to posthog', async () => {
      const service = new AnalyticsServicePosthog(
        buildFlagsService(),
        buildAnalyticsService(),
        buildSettingsService(),
      );

      await service.captureEvent(dummyEvent);

      expect(HttpClient.prototype.post).toHaveBeenCalledWith(
        '/capture/',
        expect.objectContaining({
          event: dummyEvent.name,
          properties: expect.objectContaining({
            $window_id: dummyEvent.windowId,
            ...dummyEvent.properties,
          }),
        }),
        { headers: { 'Content-Type': 'application/json' } },
      );
    });
  });
});
