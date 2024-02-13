import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { AnalyticsEvents } from '@src/background/services/analytics/models';
import { fireEvent, render, screen } from '@src/tests/test-utils';
import { Subject } from 'rxjs';
import {
  AnalyticsContextProvider,
  useAnalyticsContext,
} from './AnalyticsProvider';
import { useConnectionContext } from './ConnectionProvider';
import { useSettingsContext } from './SettingsProvider';
import { AnalyticsConsent } from '@src/background/services/settings/models';

const renderWithAnalytics = (ui, { ...renderOptions }) => {
  return render(
    <AnalyticsContextProvider>{ui}</AnalyticsContextProvider>,
    renderOptions
  );
};

const TestComponent = ({
  captureParams,
  initParams,
}: {
  captureParams: [string, Record<string, any>, boolean?];
  initParams: [storeInStorage: boolean];
}) => {
  const { capture, captureEncrypted, stopDataCollection, initAnalyticsIds } =
    useAnalyticsContext();

  return (
    <>
      <button
        data-testid="capture-button"
        onClick={() => {
          capture(...captureParams);
        }}
      >
        capture
      </button>
      <button
        data-testid="capture-encrypted-button"
        onClick={() => {
          captureEncrypted(...captureParams);
        }}
      >
        capture encrypted
      </button>
      <button
        data-testid="stop-button"
        onClick={() => {
          stopDataCollection();
        }}
      >
        stop
      </button>
      <button
        data-testid="init-button"
        onClick={() => {
          initAnalyticsIds(...initParams);
        }}
      >
        init
      </button>
    </>
  );
};

jest.mock('./ConnectionProvider', () => {
  const connectionFunctions = {
    request: jest.fn(),
    events: jest.fn(),
  };
  return {
    useConnectionContext: () => connectionFunctions,
  };
});

jest.mock('./SettingsProvider', () => {
  const mock = jest.fn();
  return {
    useSettingsContext: mock,
  };
});

describe('contexts/AnalyticsProvider', () => {
  const captureParams: [string, Record<string, any>] = [
    'test-event',
    { prop: 123, otherprop: 'somedata' },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
    const connectionMocks = useConnectionContext();
    (connectionMocks.request as jest.Mock).mockReturnValue(Promise.resolve());
    (connectionMocks.events as jest.Mock).mockReturnValue(new Subject());

    (useSettingsContext as jest.Mock).mockReturnValue({
      analyticsConsent: AnalyticsConsent.Approved,
    });
  });

  describe('`windowOpened` event', () => {
    const mockAnalyticsIds = {
      userId: 'userId',
      deviceId: 'deviceId',
    };

    it('reports event when IDs are available', async () => {
      const connectionMocks = useConnectionContext();
      (connectionMocks.request as jest.Mock).mockResolvedValue(
        mockAnalyticsIds
      );

      renderWithAnalytics(
        <TestComponent captureParams={captureParams} initParams={[true]} />,
        {}
      );
      await new Promise(process.nextTick);

      expect(connectionMocks.request).toHaveBeenCalledTimes(2);
      expect((connectionMocks.request as jest.Mock).mock.calls[0][0]).toEqual({
        method: ExtensionRequest.ANALYTICS_GET_IDS,
      });
      expect((connectionMocks.request as jest.Mock).mock.calls[1][0]).toEqual({
        method: ExtensionRequest.ANALYTICS_CAPTURE_EVENT,
        params: [
          {
            name: 'WindowOpened',
            properties: {
              path: '/',
            },
            windowId: '00000000-0000-0000-0000-000000000000',
          },
          false,
        ],
      });
    });

    it('reports event when IDs become available', async () => {
      const connectionMocks = useConnectionContext();
      (connectionMocks.request as jest.Mock).mockResolvedValue(null);

      const eventSubject = new Subject();
      (connectionMocks.events as jest.Mock).mockReturnValue(eventSubject);

      renderWithAnalytics(
        <TestComponent captureParams={captureParams} initParams={[true]} />,
        {}
      );
      await new Promise(process.nextTick);

      expect(connectionMocks.request).toHaveBeenCalledTimes(1);
      expect((connectionMocks.request as jest.Mock).mock.calls[0][0]).toEqual({
        method: ExtensionRequest.ANALYTICS_GET_IDS,
      });

      eventSubject.next({
        name: AnalyticsEvents.ANALYTICS_STATE_UPDATED,
        value: mockAnalyticsIds,
      });
      await new Promise(process.nextTick);

      expect(connectionMocks.request).toHaveBeenCalledTimes(2);
      expect((connectionMocks.request as jest.Mock).mock.calls[1][0]).toEqual({
        method: ExtensionRequest.ANALYTICS_CAPTURE_EVENT,
        params: [
          {
            name: 'WindowOpened',
            properties: {
              path: '/',
            },
            windowId: '00000000-0000-0000-0000-000000000000',
          },
          false,
        ],
      });
    });

    it('reports event only once', async () => {
      const connectionMocks = useConnectionContext();
      (connectionMocks.request as jest.Mock).mockResolvedValue(null);

      const eventSubject = new Subject();
      (connectionMocks.events as jest.Mock).mockReturnValue(eventSubject);

      renderWithAnalytics(
        <TestComponent captureParams={captureParams} initParams={[true]} />,
        {}
      );
      await new Promise(process.nextTick);

      eventSubject.next({
        name: AnalyticsEvents.ANALYTICS_STATE_UPDATED,
        value: mockAnalyticsIds,
      });
      await new Promise(process.nextTick);

      eventSubject.next({
        name: AnalyticsEvents.ANALYTICS_STATE_UPDATED,
        value: mockAnalyticsIds,
      });
      await new Promise(process.nextTick);

      expect(connectionMocks.request).toHaveBeenCalledTimes(2);
      expect((connectionMocks.request as jest.Mock).mock.calls[1][0]).toEqual({
        method: ExtensionRequest.ANALYTICS_CAPTURE_EVENT,
        params: [
          {
            name: 'WindowOpened',
            properties: {
              path: '/',
            },
            windowId: '00000000-0000-0000-0000-000000000000',
          },
          false,
        ],
      });
    });
  });

  describe('captureEncrypted', () => {
    it('captures events with useEncryption param set to true', () => {
      renderWithAnalytics(
        <TestComponent captureParams={captureParams} initParams={[true]} />,
        {}
      );

      const connectionMocks = useConnectionContext();
      (connectionMocks.request as jest.Mock).mockReset();

      fireEvent.click(screen.getByTestId('capture-encrypted-button'));

      expect(connectionMocks.request).toHaveBeenCalledTimes(1);
      expect(connectionMocks.request).toHaveBeenCalledWith({
        method: ExtensionRequest.ANALYTICS_CAPTURE_EVENT,
        params: [
          {
            name: captureParams[0],
            properties: captureParams[1],
            windowId: '00000000-0000-0000-0000-000000000000',
          },
          true,
        ],
      });
    });
  });

  describe('capture', () => {
    it('captures events', () => {
      renderWithAnalytics(
        <TestComponent captureParams={captureParams} initParams={[true]} />,
        {}
      );

      const connectionMocks = useConnectionContext();
      (connectionMocks.request as jest.Mock).mockReset();

      fireEvent.click(screen.getByTestId('capture-button'));

      expect(connectionMocks.request).toHaveBeenCalledTimes(1);
      expect(connectionMocks.request).toHaveBeenCalledWith({
        method: ExtensionRequest.ANALYTICS_CAPTURE_EVENT,
        params: [
          {
            name: captureParams[0],
            properties: captureParams[1],
            windowId: '00000000-0000-0000-0000-000000000000',
          },
          false,
        ],
      });
    });

    it('does not capture events when analytics consent missing', () => {
      (useSettingsContext as jest.Mock).mockReturnValue({
        analyticsConsent: AnalyticsConsent.Denied,
      });
      renderWithAnalytics(
        <TestComponent captureParams={captureParams} initParams={[true]} />,
        {}
      );

      const connectionMocks = useConnectionContext();
      (connectionMocks.request as jest.Mock).mockReset();

      fireEvent.click(screen.getByTestId('capture-button'));

      expect(connectionMocks.request).not.toHaveBeenCalled();
    });

    it('captures events if forced to', () => {
      const params: [string, Record<string, any>, boolean] = [
        'test-event',
        { prop: 123, otherprop: 'somedata' },
        true,
      ];

      (useSettingsContext as jest.Mock).mockReturnValue({
        analyticsConsent: AnalyticsConsent.Denied,
      });
      renderWithAnalytics(
        <TestComponent captureParams={params} initParams={[true]} />,
        {}
      );

      const connectionMocks = useConnectionContext();
      (connectionMocks.request as jest.Mock).mockReset();

      fireEvent.click(screen.getByTestId('capture-button'));

      expect(connectionMocks.request).toHaveBeenCalledTimes(1);
      expect(connectionMocks.request).toHaveBeenCalledWith({
        method: ExtensionRequest.ANALYTICS_CAPTURE_EVENT,
        params: [
          {
            name: params[0],
            properties: params[1],
            windowId: '00000000-0000-0000-0000-000000000000',
          },
          false,
        ],
      });
    });
  });

  describe('initAnalyticsIds', () => {
    it('intitializes analytics ids with store in storage param true', () => {
      renderWithAnalytics(
        <TestComponent captureParams={captureParams} initParams={[true]} />,
        {}
      );

      const connectionMocks = useConnectionContext();
      (connectionMocks.request as jest.Mock).mockReset();

      fireEvent.click(screen.getByTestId('init-button'));

      expect(connectionMocks.request).toHaveBeenCalledTimes(1);
      expect(connectionMocks.request).toHaveBeenCalledWith({
        method: ExtensionRequest.ANALYTICS_INIT_IDS,
        params: [true],
      });
    });

    it('intitializes analytics ids with store in storage param false', () => {
      renderWithAnalytics(
        <TestComponent captureParams={captureParams} initParams={[false]} />,
        {}
      );

      const connectionMocks = useConnectionContext();
      (connectionMocks.request as jest.Mock).mockReset();

      fireEvent.click(screen.getByTestId('init-button'));

      expect(connectionMocks.request).toHaveBeenCalledTimes(1);
      expect(connectionMocks.request).toHaveBeenCalledWith({
        method: ExtensionRequest.ANALYTICS_INIT_IDS,
        params: [false],
      });
    });
  });

  describe('stopDataCollection', () => {
    it('requests to stop data collection', () => {
      renderWithAnalytics(
        <TestComponent captureParams={captureParams} initParams={[true]} />,
        {}
      );

      const connectionMocks = useConnectionContext();
      (connectionMocks.request as jest.Mock).mockReset();

      fireEvent.click(screen.getByTestId('stop-button'));

      expect(connectionMocks.request).toHaveBeenCalledTimes(1);
      expect(connectionMocks.request).toHaveBeenCalledWith({
        method: ExtensionRequest.ANALYTICS_CLEAR_IDS,
      });
    });
  });
});
