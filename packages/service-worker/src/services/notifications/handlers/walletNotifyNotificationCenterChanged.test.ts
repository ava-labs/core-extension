import { NotificationsService } from '../NotificationsService';
import { WalletNotifyNotificationCenterChangedHandler } from './walletNotifyNotificationCenterChanged';

describe('WalletNotifyNotificationCenterChangedHandler', () => {
  const requestMock = { params: [] };
  const notificationsServiceMock = {
    notifyNotificationCenterChanged: jest.fn(),
  };
  const handler = new WalletNotifyNotificationCenterChangedHandler(
    notificationsServiceMock as unknown as NotificationsService,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('handleAuthenticated', () => {
    it('should call notifyNotificationCenterChanged and return null', async () => {
      const result = await handler.handleAuthenticated({
        request: requestMock,
      } as any);

      expect(
        notificationsServiceMock.notifyNotificationCenterChanged,
      ).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({
        ...requestMock,
        result: null,
      });
    });
  });

  describe('handleUnauthenticated', () => {
    it('should return an error', () => {
      const result = handler.handleUnauthenticated({
        request: requestMock,
      } as any);

      expect(result).toStrictEqual({
        ...requestMock,
        error: 'account not connected',
      });
    });
  });
});
