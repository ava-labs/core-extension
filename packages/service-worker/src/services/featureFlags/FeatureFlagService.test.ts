import { noop } from '@avalabs/core-utils-sdk';
import browser from 'webextension-polyfill';

import { AnalyticsEvents, FeatureFlagEvents, FeatureGates } from '@core/types';
import { LockService } from '../lock/LockService';
import { StorageService } from '../storage/StorageService';

import { FeatureFlagService } from './FeatureFlagService';
import { DEFAULT_FLAGS, isProductionBuild } from '@core/common';
import { getFeatureFlags } from './utils/getFeatureFlags';

jest.mock('./utils/getFeatureFlags');
jest.mock('@core/common');

describe('background/services/featureFlags/FeatureFlagService', () => {
  const env = process.env;
  const analyticsServiceMock = {
    getIds: jest.fn(),
    addListener: jest.fn(),
  } as any;
  const lockServiceMock = {
    lock: jest.fn(),
  } as unknown as LockService;
  const storageServiceMock = {
    loadUnencrypted: jest.fn(),
  } as unknown as StorageService;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(global, 'setInterval');
    jest.spyOn(global, 'clearInterval');
    jest.mocked(isProductionBuild).mockReturnValue(false);
    process.env = {
      ...env,
      POSTHOG_KEY: 'posthogkey',
      POSTHOG_URL: 'posthogurl',
    };

    jest
      .mocked(getFeatureFlags)
      .mockResolvedValue({ flags: DEFAULT_FLAGS, flagPayloads: {} });
  });

  afterEach(() => {
    process.env = env;
  });

  it('initializes feature flags with defaults', () => {
    const featureFlagsService = new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock,
    );
    expect(featureFlagsService.featureFlags).toStrictEqual(DEFAULT_FLAGS);
  });

  it('throws error when POSTHOG_KEY is missing', async () => {
    process.env = { ...env };
    const errorSpy = jest
      .spyOn(globalThis.console, 'error')
      .mockImplementation(noop);

    new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock,
    );
    await new Promise(process.nextTick);

    expect(getFeatureFlags).not.toHaveBeenCalled();
    expect(setInterval).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(new Error('POSTHOG_KEY missing'));
  });

  it('logs error when error happens in init after `ANALYTICS_STATE_UPDATED`', async () => {
    process.env = { ...env };
    const errorSpy = jest
      .spyOn(globalThis.console, 'error')
      .mockImplementation(noop);

    new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock,
    );
    await new Promise(process.nextTick);

    expect(getFeatureFlags).not.toHaveBeenCalled();
    expect(setInterval).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(new Error('POSTHOG_KEY missing'));

    // emulate ANALYTICS_STATE_UPDATED event
    analyticsServiceMock.addListener.mock.calls[0][1]();
    await new Promise(process.nextTick);

    expect(getFeatureFlags).not.toHaveBeenCalled();
    expect(setInterval).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledTimes(2);
    expect(errorSpy).toHaveBeenCalledWith(new Error('POSTHOG_KEY missing'));
  });

  it('defaults to production posthog instance', async () => {
    process.env = { ...env, POSTHOG_KEY: 'posthogkey' };

    new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock,
    );
    await new Promise(process.nextTick);

    expect(getFeatureFlags).toHaveBeenCalledTimes(1);
    expect(getFeatureFlags).toHaveBeenCalledWith(
      'posthogkey',
      '',
      'https://app.posthog.com',
    );
  });

  it('polls every 5 seconds in non-prod build', async () => {
    new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock,
    );
    await new Promise(process.nextTick);

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(expect.anything(), 5_000);
  });

  it('polls every 30 seconds in prod build', async () => {
    process.env = { ...env, POSTHOG_KEY: 'posthogkey', RELEASE: 'production' };
    jest.mocked(isProductionBuild).mockReturnValue(true);

    new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock,
    );
    await new Promise(process.nextTick);

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(expect.anything(), 30_000);
  });

  it('fetches feature flags when instantiated', async () => {
    new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock,
    );
    await new Promise(process.nextTick);

    expect(analyticsServiceMock.getIds).toHaveBeenCalledTimes(1);
    expect(getFeatureFlags).toHaveBeenCalledTimes(1);
    expect(getFeatureFlags).toHaveBeenCalledWith(
      'posthogkey',
      '',
      'posthogurl',
    );
  });

  it('updates userId when ANALYTICS_STATE_UPDATED', async () => {
    new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock,
    );
    await new Promise(process.nextTick);

    expect(analyticsServiceMock.getIds).toHaveBeenCalledTimes(1);
    expect(getFeatureFlags).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(clearInterval).not.toHaveBeenCalled();

    expect(analyticsServiceMock.addListener).toHaveBeenCalledTimes(1);
    expect(analyticsServiceMock.addListener).toHaveBeenCalledWith(
      AnalyticsEvents.ANALYTICS_STATE_UPDATED,
      expect.any(Function),
    );

    analyticsServiceMock.getIds.mockReturnValue({ userId: 'userId' });

    // emulate ANALYTICS_STATE_UPDATED event
    analyticsServiceMock.addListener.mock.calls[0][1]();
    await new Promise(process.nextTick);

    // make sure we unsubscribe from the flag mocks
    expect(clearInterval).toHaveBeenCalledTimes(1);

    expect(analyticsServiceMock.getIds).toHaveBeenCalledTimes(2);
    expect(getFeatureFlags).toHaveBeenCalledTimes(2);
    expect(getFeatureFlags).toHaveBeenCalledWith(
      'posthogkey',
      'userId',
      'posthogurl',
    );
    expect(setInterval).toHaveBeenCalledTimes(2);
  });

  it('updates feature flags and emits event when flags get updated', async () => {
    const eventSubscription = jest.fn();
    const newFlags = {
      ...DEFAULT_FLAGS,
      newflag: true,
    };
    jest
      .mocked(getFeatureFlags)
      .mockResolvedValue({ flags: newFlags, flagPayloads: {} });

    const featureFlagsService = new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock,
    );
    featureFlagsService.addListener(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      eventSubscription,
    );

    expect(featureFlagsService.featureFlags).toStrictEqual(DEFAULT_FLAGS);
    expect(eventSubscription).not.toHaveBeenCalled();
    await new Promise(process.nextTick);

    expect(eventSubscription).toHaveBeenCalledTimes(1);
    expect(eventSubscription).toHaveBeenCalledWith(newFlags);
    expect(featureFlagsService.featureFlags).toStrictEqual(newFlags);
  });

  it('only updates feature flags when flag values change', async () => {
    const eventSubscription = jest.fn();
    const newFlags = {
      ...DEFAULT_FLAGS,
      newflag: true,
    };
    jest
      .mocked(getFeatureFlags)
      .mockResolvedValue({ flags: newFlags, flagPayloads: {} });

    const featureFlagsService = new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock,
    );
    featureFlagsService.addListener(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      eventSubscription,
    );

    expect(featureFlagsService.featureFlags).toStrictEqual(DEFAULT_FLAGS);
    expect(eventSubscription).not.toHaveBeenCalled();

    await new Promise(process.nextTick);

    expect(eventSubscription).toHaveBeenCalledTimes(1);
    expect(featureFlagsService.featureFlags).toStrictEqual(newFlags);

    jest.mocked(setInterval).mock.calls[0]?.[0]();

    await new Promise(process.nextTick);

    expect(eventSubscription).toHaveBeenCalledTimes(1);
  });

  describe('when a feature flag arrives with a custom payload', () => {
    describe('but the payload is not a valid semver range', () => {
      let featureFlagsService: FeatureFlagService;

      beforeEach(async () => {
        jest.mocked(getFeatureFlags).mockResolvedValue({
          flags: {
            [FeatureGates.DEFI]: true,
            [FeatureGates.SEND]: true,
            [FeatureGates.SWAP]: false,
          } as any,
          flagPayloads: {
            [FeatureGates.DEFI]: JSON.stringify('a.b.c'), // Gotta stringify it, that's how it will come from Posthog
          },
        });

        featureFlagsService = new FeatureFlagService(
          analyticsServiceMock,
          lockServiceMock,
          storageServiceMock,
        );

        await new Promise(process.nextTick);
      });

      it('the version-specific feature flag is disabled', async () => {
        expect(featureFlagsService.featureFlags).toEqual(
          expect.objectContaining({
            [FeatureGates.DEFI]: false,
          }),
        );
      });

      it('the basic feature flags are left in-tact', async () => {
        expect(featureFlagsService.featureFlags).toEqual(
          expect.objectContaining({
            [FeatureGates.SEND]: true,
            [FeatureGates.SWAP]: false,
          }),
        );
      });
    });

    describe('and the payload is a valid semver range', () => {
      it.each([
        {
          coreVersion: '1.32.8',
          flagVersionRange: '^1.32',
          isEnabled: true,
        },
        {
          coreVersion: '1.34.8',
          flagVersionRange: '^1.32',
          isEnabled: true,
        },
        {
          coreVersion: '1.32.8',
          flagVersionRange: '~1.32',
          isEnabled: true,
        },
        {
          coreVersion: '1.33.0',
          flagVersionRange: '~1.32',
          isEnabled: false,
        },
        {
          coreVersion: '1.40.8',
          flagVersionRange: '>=1.33.7',
          isEnabled: true,
        },
        {
          coreVersion: '1.40.8',
          flagVersionRange: '1.33.x',
          isEnabled: false,
        },
        {
          coreVersion: '1.40.8',
          flagVersionRange: '1.40.x',
          isEnabled: true,
        },
        {
          coreVersion: '1.40.8',
          flagVersionRange: '1.33 - 1.41',
          isEnabled: true,
        },
        {
          coreVersion: '1.32.8',
          flagVersionRange: '1.33 - 1.41',
          isEnabled: false,
        },
        {
          coreVersion: '1.32.8',
          flagVersionRange: '1.32 || 1.33',
          isEnabled: true,
        },
        {
          coreVersion: '1.99.99',
          flagVersionRange: '^2',
          isEnabled: false,
        },
        {
          coreVersion: '2.0.0',
          flagVersionRange: '^2',
          isEnabled: true,
        },
      ])(
        'enables the feature flag if current Core version satisfies configured range',
        async ({ coreVersion, flagVersionRange, isEnabled }) => {
          jest
            .spyOn(browser.runtime, 'getManifest')
            .mockReturnValue({ version: coreVersion } as any);

          jest.mocked(getFeatureFlags).mockResolvedValue({
            flags: {
              [FeatureGates.BUY]: false,
              [FeatureGates.DEFI]: true,
              [FeatureGates.SEND]: true,
              [FeatureGates.SWAP]: false,
            } as any,
            flagPayloads: {
              [FeatureGates.BUY]: JSON.stringify(flagVersionRange),
              [FeatureGates.DEFI]: JSON.stringify(flagVersionRange),
            },
          });

          const featureFlagsService = new FeatureFlagService(
            analyticsServiceMock,
            lockServiceMock,
            storageServiceMock,
          );

          await new Promise(process.nextTick);

          expect(featureFlagsService.featureFlags).toEqual({
            [FeatureGates.BUY]: false, // Comes disabled, should stay disabled even though it has a version attached.
            [FeatureGates.DEFI]: isEnabled, // Comes enabled with a payload, gotta be matched against the current version
            [FeatureGates.SEND]: true, // Comes without a payload, should stay in-tact
            [FeatureGates.SWAP]: false, // Comes without a payload, should stay in-tact
          });
        },
      );
    });
  });

  describe('when feature flags overrides  are set in session storage', () => {
    let featureFlagsService: FeatureFlagService;
    const eventSubscription = jest.fn();

    const productionFlags = {
      ...DEFAULT_FLAGS,
      [FeatureGates.BUY]: false,
      [FeatureGates.BRIDGE]: true,
    };

    const flagOverrides = {
      [FeatureGates.BUY]: true,
      [FeatureGates.BRIDGE]: false,
    };

    beforeEach(async () => {
      jest
        .mocked(storageServiceMock.loadUnencrypted)
        .mockResolvedValue(flagOverrides);

      jest
        .mocked(getFeatureFlags)
        .mockResolvedValue({ flags: productionFlags, flagPayloads: {} });
      featureFlagsService = new FeatureFlagService(
        analyticsServiceMock,
        lockServiceMock,
        storageServiceMock,
      );

      featureFlagsService.addListener(
        FeatureFlagEvents.FEATURE_FLAG_UPDATED,
        eventSubscription,
      );
      await new Promise(process.nextTick);
    });

    it('applies those overrides', async () => {
      const expectedFlags = {
        ...productionFlags,
        ...flagOverrides,
      };

      expect(eventSubscription).toHaveBeenCalledWith(expectedFlags);
      expect(featureFlagsService.featureFlags).toStrictEqual(expectedFlags);
    });
  });

  describe('when "everything" flag is disabled', () => {
    it('locks the wallet', async () => {
      const eventSubscription = jest.fn();
      const newFlags = {
        ...DEFAULT_FLAGS,
        everything: false,
      };
      jest
        .mocked(getFeatureFlags)
        .mockResolvedValue({ flags: newFlags, flagPayloads: {} });

      const featureFlagsService = new FeatureFlagService(
        analyticsServiceMock,
        lockServiceMock,
        storageServiceMock,
      );
      await new Promise(process.nextTick);
      featureFlagsService.addListener(
        FeatureFlagEvents.FEATURE_FLAG_UPDATED,
        eventSubscription,
      );

      expect(lockServiceMock.lock).toHaveBeenCalled();
    });
  });

  describe('#ensureFlagEnabled', () => {
    let service: FeatureFlagService;

    beforeEach(async () => {
      const flags = {
        [FeatureGates.EVERYTHING]: true,
        [FeatureGates.SWAP]: true,
        [FeatureGates.BRIDGE]: false,
      } as any;

      jest
        .mocked(getFeatureFlags)
        .mockResolvedValue({ flags, flagPayloads: {} });
      service = new FeatureFlagService(
        analyticsServiceMock,
        lockServiceMock,
        storageServiceMock,
      );
      await new Promise(process.nextTick);
    });

    it('does not throw errors if given feature is enabled', () => {
      expect(() => service.ensureFlagEnabled(FeatureGates.SWAP)).not.toThrow();
    });

    it('throws an error if given feature is disabled', () => {
      expect(() => service.ensureFlagEnabled(FeatureGates.BRIDGE)).toThrow(
        `Feature (${FeatureGates.BRIDGE}) is currently unavailable`,
      );
    });
  });
});
