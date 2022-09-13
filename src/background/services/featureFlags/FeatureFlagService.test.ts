import { initFeatureFlags } from '@avalabs/posthog-sdk';
import { noop } from '@avalabs/utils-sdk';
import { AnalyticsEvents } from '../analytics/models';
import { FeatureFlagService } from './FeatureFlagService';
import { DEFAULT_FLAGS, FeatureFlagEvents } from './models';

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
    const featureFlagsService = new FeatureFlagService(analyticsServiceMock);
    expect(featureFlagsService.featureFlags).toBe(DEFAULT_FLAGS);
  });

  it('throws error when POSTHOG_KEY is missing', async () => {
    process.env = { ...env };
    const errorSpy = jest
      .spyOn(globalThis.console, 'error')
      .mockImplementation(noop);

    new FeatureFlagService(analyticsServiceMock);
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

    new FeatureFlagService(analyticsServiceMock);
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

    new FeatureFlagService(analyticsServiceMock);
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
    new FeatureFlagService(analyticsServiceMock);
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
    new FeatureFlagService(analyticsServiceMock);
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

    const featureFlagsService = new FeatureFlagService(analyticsServiceMock);
    await new Promise(process.nextTick);
    featureFlagsService.addListener(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      eventSubscription
    );

    expect(featureFlagsService.featureFlags).toBe(DEFAULT_FLAGS);
    expect(eventSubscription).not.toHaveBeenCalled();

    initFeatureFlagsMock.listen.add.mock.calls[0][0](newFlags);

    expect(eventSubscription).toHaveBeenCalledTimes(1);
    expect(eventSubscription).toHaveBeenCalledWith(newFlags);
    expect(featureFlagsService.featureFlags).toBe(newFlags);
  });

  it('only updates feature flags when flag values change', async () => {
    const eventSubscription = jest.fn();
    const newFlags = {
      ...DEFAULT_FLAGS,
      newflag: true,
    };

    const featureFlagsService = new FeatureFlagService(analyticsServiceMock);
    await new Promise(process.nextTick);
    featureFlagsService.addListener(
      FeatureFlagEvents.FEATURE_FLAG_UPDATED,
      eventSubscription
    );

    expect(featureFlagsService.featureFlags).toBe(DEFAULT_FLAGS);
    expect(eventSubscription).not.toHaveBeenCalled();

    initFeatureFlagsMock.listen.add.mock.calls[0][0](newFlags);

    expect(eventSubscription).toHaveBeenCalledTimes(1);
    expect(featureFlagsService.featureFlags).toBe(newFlags);

    initFeatureFlagsMock.listen.add.mock.calls[0][0]({ ...newFlags }); // new object with the same values should not trigger an update
    expect(eventSubscription).toHaveBeenCalledTimes(1);
  });
});
