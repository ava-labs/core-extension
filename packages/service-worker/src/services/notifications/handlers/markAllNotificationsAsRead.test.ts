import { NotificationCenterService } from '../NotificationCenterService';
import { MarkAllNotificationsAsRead } from './markAllNotificationsAsRead';

describe('MarkAllNotificationsAsRead', () => {
  const requestMock = { params: [] };
  const notificationCenterServiceMock = {
    markAllAsRead: jest.fn(),
  };
  const handler = new MarkAllNotificationsAsRead(
    notificationCenterServiceMock as unknown as NotificationCenterService,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return true on success', async () => {
    notificationCenterServiceMock.markAllAsRead.mockResolvedValueOnce(
      undefined,
    );

    const result = await handler.handle({
      request: requestMock,
    } as any);

    expect(result).toStrictEqual({
      ...requestMock,
      result: true,
    });
    expect(notificationCenterServiceMock.markAllAsRead).toHaveBeenCalledTimes(
      1,
    );
  });

  it('should return an error when the service throws', async () => {
    const error = new Error('Failed to mark all as read');
    notificationCenterServiceMock.markAllAsRead.mockRejectedValueOnce(error);

    const result = await handler.handle({
      request: requestMock,
    } as any);

    expect(result).toStrictEqual({
      ...requestMock,
      error: error.toString(),
    });
  });
});
