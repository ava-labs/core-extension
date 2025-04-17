import { MessagePayload } from 'firebase/messaging/sw';
import { sendNotification } from './sendNotification';
import { BalanceNotificationTypes, NotificationCategories } from '../models';

describe('sendNotification', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    global.chrome = {
      notifications: {
        create: jest.fn(),
      },
    } as unknown as typeof chrome;
  });

  it('should throw error for incorrect notifications', () => {
    expect(() =>
      sendNotification({
        payload: { foo: 'bar' } as unknown as MessagePayload,
        allowedType: NotificationCategories.BALANCE_CHANGES,
      }),
    ).toThrow('Invalid payload: "data" is required');
  });

  it('should do nothing when the notification type is not allowed', () => {
    expect(
      sendNotification({
        payload: {
          data: {
            title: 'Test',
            body: 'Test',
            type: 'test',
            event: 'test',
          },
          collapseKey: 'collapseKey',
          from: 'from',
          messageId: 'messageId',
        },
        allowedType: NotificationCategories.BALANCE_CHANGES,
      }),
    ).toBeUndefined();

    expect(chrome.notifications.create).not.toHaveBeenCalled();
  });

  it('should do nothing when the notification event is not allowed', () => {
    expect(
      sendNotification({
        payload: {
          data: {
            title: 'Test',
            body: 'Test',
            type: NotificationCategories.BALANCE_CHANGES,
            event: 'test',
          },
          collapseKey: 'collapseKey',
          from: 'from',
          messageId: 'messageId',
        },
        allowedType: NotificationCategories.BALANCE_CHANGES,
        allowedEvents: [BalanceNotificationTypes.BALANCE_CHANGES],
      }),
    ).toBeUndefined();

    expect(chrome.notifications.create).not.toHaveBeenCalled();
  });

  it('should create a notification when the notification type and event are allowed', () => {
    expect(
      sendNotification({
        payload: {
          data: {
            title: 'Test title',
            body: 'Test body',
            type: NotificationCategories.BALANCE_CHANGES,
            event: BalanceNotificationTypes.BALANCE_CHANGES,
          },
          collapseKey: 'collapseKey',
          from: 'from',
          messageId: 'messageId',
        },
        allowedType: NotificationCategories.BALANCE_CHANGES,
        allowedEvents: [BalanceNotificationTypes.BALANCE_CHANGES],
      }),
    ).toBeUndefined();

    expect(chrome.notifications.create).toHaveBeenCalledWith({
      type: 'basic',
      title: 'Test title',
      message: 'Test body',
      iconUrl: '../../../../images/icon-192.png',
      priority: 2,
    });
  });
});
