import { NotificationCenterService } from '../NotificationCenterService';
import { GetNotificationCenterList } from './getNotificationCenterList';

describe('GetNotificationCenterList', () => {
  const requestMock = { params: [] };
  const notificationCenterServiceMock = {
    getNotifications: jest.fn(),
  };
  const handler = new GetNotificationCenterList(
    notificationCenterServiceMock as unknown as NotificationCenterService,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return notifications list on success', async () => {
    const mockNotifications = [
      {
        id: 'n-1',
        type: 'BALANCE_CHANGES',
        category: 'TRANSACTION',
        title: '0.5 AVAX sent',
        body: 'to 0xabc...',
        timestamp: 1700000000,
      },
      {
        id: 'n-2',
        type: 'PRICE_ALERTS',
        category: 'PRICE_UPDATE',
        title: 'AVAX reached $50',
        body: 'Price update',
        timestamp: 1700000001,
      },
    ];

    notificationCenterServiceMock.getNotifications.mockResolvedValueOnce(
      mockNotifications,
    );

    const result = await handler.handle({
      request: requestMock,
    } as any);

    expect(result).toStrictEqual({
      ...requestMock,
      result: mockNotifications,
    });
    expect(
      notificationCenterServiceMock.getNotifications,
    ).toHaveBeenCalledTimes(1);
  });

  it('should return an error when the service throws', async () => {
    const error = new Error('Failed to fetch notifications');
    notificationCenterServiceMock.getNotifications.mockRejectedValueOnce(error);

    const result = await handler.handle({
      request: requestMock,
    } as any);

    expect(result).toStrictEqual({
      ...requestMock,
      error: error.toString(),
    });
  });

  it('should return empty array when no notifications', async () => {
    notificationCenterServiceMock.getNotifications.mockResolvedValueOnce([]);

    const result = await handler.handle({
      request: requestMock,
    } as any);

    expect(result).toStrictEqual({
      ...requestMock,
      result: [],
    });
  });
});
