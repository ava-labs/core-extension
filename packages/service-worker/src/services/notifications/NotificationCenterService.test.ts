import { Monitoring, noop } from '@core/common';
import { StorageService } from '../storage/StorageService';
import { NotificationCenterService } from './NotificationCenterService';
import { sendRequest } from './utils/sendRequest';

jest.mock('./utils/sendRequest');
jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  Monitoring: {
    sentryCaptureException: jest.fn(),
    SentryExceptionTypes: {
      NOTIFICATIONS: 'notifications',
    },
  },
}));

const DEVICE_ARN = 'arn:aws:sns:us-east-1:123456789:endpoint/test-device';

const makeBalanceChangeResponse = (id: string) => ({
  notificationId: id,
  type: 'BALANCE_CHANGES',
  title: '0.5 AVAX sent',
  body: 'to 0xabc...',
  createdAt: 1700000000,
  metadata: {
    event: 'BALANCES_SPENT',
    chainId: '43114',
    chainName: 'Avalanche C-Chain',
    transactionHash: '0xdeadbeef',
    accountAddress: '0x1234',
    url: 'https://snowtrace.io/tx/0xdeadbeef',
    transfers: [
      {
        tokenSymbol: 'AVAX',
        amount: '0.5',
        partnerAddress: '0xabc',
      },
    ],
  },
});

const makePriceAlertResponse = (id: string) => ({
  notificationId: id,
  type: 'PRICE_ALERTS',
  title: 'AVAX reached $50',
  body: 'Price update',
  createdAt: 1700000001,
  metadata: {
    tokenId: 'NATIVE-avax',
    tokenName: 'Avalanche',
    tokenSymbol: 'AVAX',
    currentPrice: 50,
    priceChangePercent: 5.2,
    url: 'https://example.com',
  },
});

describe('NotificationCenterService', () => {
  let service: NotificationCenterService;
  const storageServiceMock = {
    loadUnencrypted: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'error').mockImplementation(noop);
    storageServiceMock.loadUnencrypted.mockResolvedValue({
      clientId: DEVICE_ARN,
    });
    service = new NotificationCenterService(
      storageServiceMock as unknown as StorageService,
    );
  });

  describe('getNotifications', () => {
    it('should return transformed notifications', async () => {
      jest.mocked(sendRequest).mockResolvedValue({
        notifications: [
          makeBalanceChangeResponse('n-1'),
          makePriceAlertResponse('n-2'),
        ],
      });

      const result = await service.getNotifications();

      expect(sendRequest).toHaveBeenCalledWith({
        path: 'v1/push/notification-center/list',
        clientId: DEVICE_ARN,
        payload: {},
        includeAppType: false,
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: 'n-1',
        type: 'BALANCE_CHANGES',
        title: '0.5 AVAX sent',
      });
      expect(result[1]).toMatchObject({
        id: 'n-2',
        type: 'PRICE_ALERTS',
        title: 'AVAX reached $50',
      });
    });

    it('should filter out notifications where data is undefined', async () => {
      jest.mocked(sendRequest).mockResolvedValue({
        notifications: [
          {
            notificationId: 'n-bad',
            type: 'BALANCE_CHANGES',
            title: 'Bad notification',
            body: 'Missing metadata',
            createdAt: 1700000000,
            // no metadata -> transformNotification returns data: undefined
          },
          makePriceAlertResponse('n-good'),
        ],
      });

      const result = await service.getNotifications();

      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe('n-good');
    });

    it('should return empty array when API response fails validation', async () => {
      jest.mocked(sendRequest).mockResolvedValue({
        unexpected: 'format',
      });

      const result = await service.getNotifications();

      expect(result).toEqual([]);
      expect(Monitoring.sentryCaptureException).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining(
            'Notification center response validation failed',
          ),
        }),
        Monitoring.SentryExceptionTypes.NOTIFICATIONS,
      );
    });

    it('should return empty array when sendRequest throws', async () => {
      jest.mocked(sendRequest).mockRejectedValue(new Error('Network failure'));

      const result = await service.getNotifications();

      expect(result).toEqual([]);
      expect(Monitoring.sentryCaptureException).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Network failure' }),
        Monitoring.SentryExceptionTypes.NOTIFICATIONS,
      );
    });

    it('should return empty array when device ARN is not available', async () => {
      storageServiceMock.loadUnencrypted.mockResolvedValue({
        clientId: undefined,
      });

      const result = await service.getNotifications();

      expect(result).toEqual([]);
      expect(sendRequest).not.toHaveBeenCalled();
    });
  });

  describe('markAsRead', () => {
    it('should send mark-as-read request with notification ID', async () => {
      jest.mocked(sendRequest).mockResolvedValue({ success: true });

      await service.markAsRead('n-123');

      expect(sendRequest).toHaveBeenCalledWith({
        path: 'v1/push/notification-center/mark-as-read',
        clientId: DEVICE_ARN,
        payload: { notificationId: 'n-123' },
        includeAppType: false,
      });
    });

    it('should throw when response validation fails', async () => {
      jest.mocked(sendRequest).mockResolvedValue({ success: false });

      await expect(service.markAsRead('n-123')).rejects.toThrow(
        'Unexpected response from mark-as-read',
      );
    });

    it('should throw when device ARN is not available', async () => {
      storageServiceMock.loadUnencrypted.mockResolvedValue({
        clientId: undefined,
      });

      await expect(service.markAsRead('n-123')).rejects.toThrow(
        'Device ARN not available',
      );
    });
  });

  describe('markAllAsRead', () => {
    it('should send mark-all-as-read request', async () => {
      jest.mocked(sendRequest).mockResolvedValue({ success: true });

      await service.markAllAsRead();

      expect(sendRequest).toHaveBeenCalledWith({
        path: 'v1/push/notification-center/mark-all-as-read',
        clientId: DEVICE_ARN,
        payload: {},
        includeAppType: false,
      });
    });

    it('should throw when response validation fails', async () => {
      jest.mocked(sendRequest).mockResolvedValue({ unexpected: 'response' });

      await expect(service.markAllAsRead()).rejects.toThrow(
        'Unexpected response from mark-all-as-read',
      );
    });

    it('should throw when device ARN is not available', async () => {
      storageServiceMock.loadUnencrypted.mockResolvedValue({
        clientId: undefined,
      });

      await expect(service.markAllAsRead()).rejects.toThrow(
        'Device ARN not available',
      );
    });
  });
});
