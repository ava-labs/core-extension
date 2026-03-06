import { NotificationCenterService } from '../NotificationCenterService';
import { MarkNotificationAsRead } from './markNotificationAsRead';

describe('MarkNotificationAsRead', () => {
  const notificationId = 'notification-123';
  const requestMock = { params: notificationId };
  const notificationCenterServiceMock = {
    markAsRead: jest.fn(),
  };
  const handler = new MarkNotificationAsRead(
    notificationCenterServiceMock as unknown as NotificationCenterService,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return true on success', async () => {
    notificationCenterServiceMock.markAsRead.mockResolvedValueOnce(undefined);

    const result = await handler.handle({
      request: requestMock,
    } as any);

    expect(result).toStrictEqual({
      ...requestMock,
      result: true,
    });
    expect(notificationCenterServiceMock.markAsRead).toHaveBeenCalledWith(
      notificationId,
    );
  });

  it('should return an error when the service throws', async () => {
    const error = new Error('Failed to mark as read');
    notificationCenterServiceMock.markAsRead.mockRejectedValueOnce(error);

    const result = await handler.handle({
      request: requestMock,
    } as any);

    expect(result).toStrictEqual({
      ...requestMock,
      error: error.toString(),
    });
  });
});
