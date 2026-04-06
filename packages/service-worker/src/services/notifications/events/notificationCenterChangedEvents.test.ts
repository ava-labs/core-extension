import { NotificationsEvents, Web3Event } from '@core/types';
import type { NotificationsService } from '../NotificationsService';
import { NotificationCenterChangedEvents } from './notificationCenterChangedEvents';

jest.mock('webextension-polyfill', () => ({
  runtime: { id: 'ext-id-123' },
}));

describe('notificationCenterChangedEvents', () => {
  let centerChangedCallback: () => void;
  const notificationsServiceStub = {
    addListener: jest.fn((event: NotificationsEvents, cb: () => void) => {
      if (event === NotificationsEvents.NOTIFICATION_CENTER_CHANGED_EVENT) {
        centerChangedCallback = cb;
      }
    }),
  } as unknown as NotificationsService;

  beforeEach(() => {
    jest.clearAllMocks();
    centerChangedCallback = () => {};
  });

  it('emits Web3 notificationCenterChanged for sync web domain', (done) => {
    const events = new NotificationCenterChangedEvents(
      notificationsServiceStub,
    );
    events.setConnectionInfo({ domain: 'core.app', tabId: 1 });

    events.addListener((event: any) => {
      expect(event.method).toBe(Web3Event.NOTIFICATION_CENTER_CHANGED_EVENT);
      expect(event.params).toEqual({});
      done();
    });

    centerChangedCallback();
  });

  it('emits extension port event for extension UI (runtime id as domain)', (done) => {
    const events = new NotificationCenterChangedEvents(
      notificationsServiceStub,
    );
    events.setConnectionInfo({ domain: 'ext-id-123', tabId: 1 });

    events.addListener((event: any) => {
      expect(event.name).toBe(
        NotificationsEvents.NOTIFICATION_CENTER_CHANGED_EVENT,
      );
      expect(event.value).toBeUndefined();
      done();
    });

    centerChangedCallback();
  });

  it('does not emit for non-sync dapp', () => {
    const events = new NotificationCenterChangedEvents(
      notificationsServiceStub,
    );
    events.setConnectionInfo({ domain: 'evil.com', tabId: 1 });

    const handler = jest.fn();
    events.addListener(handler);

    centerChangedCallback();

    expect(handler).not.toHaveBeenCalled();
  });
});
