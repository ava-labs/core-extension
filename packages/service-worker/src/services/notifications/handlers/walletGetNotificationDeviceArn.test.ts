import { NotificationsClientIdStorage } from '@core/types';
import { StorageService } from '../../storage/StorageService';
import { NOTIFICATIONS_CLIENT_ID_STORAGE_KEY } from '../constants';
import { WalletGetNotificationDeviceArnHandler } from './walletGetNotificationDeviceArn';

describe('WalletGetNotificationDeviceArnHandler', () => {
  const requestMock = { params: [] };
  const storageServiceMock = {
    loadUnencrypted: jest.fn(),
  };
  const handler = new WalletGetNotificationDeviceArnHandler(
    storageServiceMock as unknown as StorageService,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('handleAuthenticated', () => {
    it('should return deviceArn when clientId is stored', async () => {
      storageServiceMock.loadUnencrypted.mockResolvedValueOnce({
        clientId: 'arn:aws:sns:us-east-1:123456789:endpoint/GCM/app/abc123',
      } satisfies NotificationsClientIdStorage);

      const result = await handler.handleAuthenticated({
        request: requestMock,
      } as any);

      expect(result).toStrictEqual({
        ...requestMock,
        result: {
          deviceArn: 'arn:aws:sns:us-east-1:123456789:endpoint/GCM/app/abc123',
        },
      });
      expect(storageServiceMock.loadUnencrypted).toHaveBeenCalledWith(
        NOTIFICATIONS_CLIENT_ID_STORAGE_KEY,
      );
    });

    it('should return undefined deviceArn when nothing is stored', async () => {
      storageServiceMock.loadUnencrypted.mockResolvedValueOnce(undefined);

      const result = await handler.handleAuthenticated({
        request: requestMock,
      } as any);

      expect(result).toStrictEqual({
        ...requestMock,
        result: { deviceArn: undefined },
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
