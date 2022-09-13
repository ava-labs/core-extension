import { FeatureGates } from '@avalabs/posthog-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { CaptureAnalyticsEventHandler } from './captureAnalyticsEvent';

describe('background/services/analytics/handlers/captureAnalyticsEvent', () => {
  const featureFlagServiceMock = {
    featureFlags: {
      [FeatureGates.EVENTS]: true,
    },
  } as any;

  const analyticsServicePosthogMock = {
    captureEvent: jest.fn(),
  } as any;

  const mockEvent = {
    name: 'WindowOpened',
    properties: {
      path: '/',
    },
    windowId: '00000000-0000-0000-0000-000000000000',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('captures event', async () => {
    const handler = new CaptureAnalyticsEventHandler(
      analyticsServicePosthogMock,
      featureFlagServiceMock
    );

    const request = {
      id: '123',
      method: ExtensionRequest.ANALYTICS_CAPTURE_EVENT,
      params: [mockEvent],
    } as any;

    const result = await handler.handle(request);

    expect(result).toEqual({ ...request, result: null });
    expect(analyticsServicePosthogMock.captureEvent).toHaveBeenCalledTimes(1);
    expect(analyticsServicePosthogMock.captureEvent).toHaveBeenCalledWith(
      mockEvent
    );
  });

  it('does not capture events when FeatureGates.EVENTS flag is off', async () => {
    const handler = new CaptureAnalyticsEventHandler(
      analyticsServicePosthogMock,
      {
        ...featureFlagServiceMock,
        featureFlags: {
          ...featureFlagServiceMock.featureFlags,
          [FeatureGates.EVENTS]: false,
        },
      }
    );

    const request = {
      id: '123',
      method: ExtensionRequest.ANALYTICS_CAPTURE_EVENT,
      params: [mockEvent],
    } as any;

    const result = await handler.handle(request);

    expect(result).toEqual({ ...request, result: null });
    expect(analyticsServicePosthogMock.captureEvent).not.toHaveBeenCalled();
  });

  it('returns error when tracking fails', async () => {
    const handler = new CaptureAnalyticsEventHandler(
      analyticsServicePosthogMock,
      featureFlagServiceMock
    );

    (analyticsServicePosthogMock.captureEvent as jest.Mock).mockRejectedValue(
      new Error('some error')
    );

    const request = {
      id: '123',
      method: ExtensionRequest.ANALYTICS_CAPTURE_EVENT,
      params: [mockEvent],
    } as any;

    const result = await handler.handle(request);

    expect(result).toEqual({ ...request, error: 'Error: some error' });
  });
});
