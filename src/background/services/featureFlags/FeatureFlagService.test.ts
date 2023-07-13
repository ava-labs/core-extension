import { FeatureGates, initFeatureFlags } from '@avalabs/posthog-sdk';
import { noop } from '@avalabs/utils-sdk';
import { AnalyticsEvents } from '../analytics/models';
import { LockService } from '../lock/LockService';
import { FeatureFlagService } from './FeatureFlagService';
import { DEFAULT_FLAGS, FeatureFlagEvents } from './models';
import { StorageService } from '../storage/StorageService';

jest.mock('@avalabs/posthog-sdk', () => {
  const originalModule = jest.requireActual('@avalabs/posthog-sdk');
  return {
    ...originalModule,
    initFeatureFlags: jest.fn(),
  };
});

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

  const initFeatureFlagsMock = {
    listen: {
      add: jest.fn(),
    },
    unsubscribe: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = {
      ...env,
      POSTHOG_KEY: 'posthogkey',
      POSTHOG_URL: 'posthogurl',
    };

    (initFeatureFlags as jest.Mock).mockReturnValue(initFeatureFlagsMock);
  });

  afterEach(() => {
    process.env = env;
  });

  it('initializes feature flags with defaults', () => {
    const featureFlagsService = new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock
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
      storageServiceMock
    );
    await new Promise(process.nextTick);

    expect(initFeatureFlags).not.toHaveBeenCalled();
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
      storageServiceMock
    );
    await new Promise(process.nextTick);

    expect(initFeatureFlags).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(new Error('POSTHOG_KEY missing'));

    // emulate ANALYTICS_STATE_UPDATED event
    analyticsServiceMock.addListener.mock.calls[0][1]();
    await new Promise(process.nextTick);

    expect(initFeatureFlags).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledTimes(2);
    expect(errorSpy).toHaveBeenCalledWith(new Error('POSTHOG_KEY missing'));
  });

  it('defaults to production posthog instance', async () => {
    process.env = { ...env, POSTHOG_KEY: 'posthogkey' };

    new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock
    );
    await new Promise(process.nextTick);

    expect(initFeatureFlags).toHaveBeenCalledTimes(1);
    expect(initFeatureFlags).toHaveBeenCalledWith(
      'posthogkey',
      '',
      'https://data-posthog.avax.network',
      5000
    );
  });

  it('fetches feature flags when instantiated', async () => {
    new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock
    );
    await new Promise(process.nextTick);

    expect(analyticsServiceMock.getIds).toHaveBeenCalledTimes(1);
    expect(initFeatureFlags).toHaveBeenCalledTimes(1);
    expect(initFeatureFlags).toHaveBeenCalledWith(
      'posthogkey',
      '',
      'posthogurl',
      5000
    );

    expect(initFeatureFlagsMock.listen.add).toHaveBeenCalledTimes(1);
  });

  it('updates userId when ANALYTICS_STATE_UPDATED', async () => {
    new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock
    );
    await new Promise(process.nextTick);

    expect(analyticsServiceMock.getIds).toHaveBeenCalledTimes(1);
    expect(initFeatureFlags).toHaveBeenCalledTimes(1);
    expect(initFeatureFlagsMock.listen.add).toHaveBeenCalledTimes(1);
    expect(initFeatureFlagsMock.unsubscribe).not.toHaveBeenCalled();

    expect(analyticsServiceMock.addListener).toHaveBeenCalledTimes(1);
    expect(analyticsServiceMock.addListener).toHaveBeenCalledWith(
      AnalyticsEvents.ANALYTICS_STATE_UPDATED,
      expect.any(Function)
    );

    analyticsServiceMock.getIds.mockReturnValue({ userId: 'userId' });

    // emulate ANALYTICS_STATE_UPDATED event
    analyticsServiceMock.addListener.mock.calls[0][1]();
    await new Promise(process.nextTick);

    // make sure we unsubscribe from the flag mocks
    expect(initFeatureFlagsMock.unsubscribe).toHaveBeenCalledTimes(1);

    expect(analyticsServiceMock.getIds).toHaveBeenCalledTimes(2);
    expect(initFeatureFlags).toHaveBeenCalledTimes(2);
    expect(initFeatureFlags).toHaveBeenCalledWith(
      'posthogkey',
      'userId',
      'posthogurl',
      5000
    );
    expect(initFeatureFlagsMock.listen.add).toHaveBeenCalledTimes(2);
  });

  it('updates feature flags and emits event when flags get updated', async () => {
    const eventSubscription = jest.fn();
    const newFlags = {
      ...DEFAULT_FLAGS,
      newflag: true,
    };

    const featureFlagsService = new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock
    );
    await new Promise(process.nextTick);
    featureFlagsService.addListener(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      eventSubscription
    );

    expect(featureFlagsService.featureFlags).toStrictEqual(DEFAULT_FLAGS);
    expect(eventSubscription).not.toHaveBeenCalled();

    await initFeatureFlagsMock.listen.add.mock.calls[0][0](newFlags);

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

    const featureFlagsService = new FeatureFlagService(
      analyticsServiceMock,
      lockServiceMock,
      storageServiceMock
    );
    await new Promise(process.nextTick);
    featureFlagsService.addListener(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      eventSubscription
    );

    expect(featureFlagsService.featureFlags).toStrictEqual(DEFAULT_FLAGS);
    expect(eventSubscription).not.toHaveBeenCalled();

    await initFeatureFlagsMock.listen.add.mock.calls[0][0](newFlags);

    expect(eventSubscription).toHaveBeenCalledTimes(1);
    expect(featureFlagsService.featureFlags).toStrictEqual(newFlags);

    await initFeatureFlagsMock.listen.add.mock.calls[0][0]({ ...newFlags }); // new object with the same values should not trigger an update
    expect(eventSubscription).toHaveBeenCalledTimes(1);
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

      featureFlagsService = new FeatureFlagService(
        analyticsServiceMock,
        lockServiceMock,
        storageServiceMock
      );

      await new Promise(process.nextTick);

      featureFlagsService.addListener(
        FeatureFlagEvents.FEATURE_FLAG_UPDATED,
        eventSubscription
      );
    });

    it('applies those overrides', async () => {
      await initFeatureFlagsMock.listen.add.mock.calls[0][0](productionFlags);

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

      const featureFlagsService = new FeatureFlagService(
        analyticsServiceMock,
        lockServiceMock,
        storageServiceMock
      );
      await new Promise(process.nextTick);
      featureFlagsService.addListener(
        FeatureFlagEvents.FEATURE_FLAG_UPDATED,
        eventSubscription
      );

      await initFeatureFlagsMock.listen.add.mock.calls[0][0](newFlags);
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
      };

      service = new FeatureFlagService(
        analyticsServiceMock,
        lockServiceMock,
        storageServiceMock
      );
      await new Promise(process.nextTick);

      await initFeatureFlagsMock.listen.add.mock.calls[0][0](flags);
    });

    it('does not throw errors if given feature is enabled', () => {
      expect(() => service.ensureFlagEnabled(FeatureGates.SWAP)).not.toThrow();
    });

    it('throws an error if given feature is disabled', () => {
      expect(() => service.ensureFlagEnabled(FeatureGates.BRIDGE)).toThrow(
        `Feature (${FeatureGates.BRIDGE}) is currently unavailable`
      );
    });
  });
});
