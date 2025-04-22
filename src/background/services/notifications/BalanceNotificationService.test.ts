import { ChainId } from '@avalabs/core-chains-sdk';
import { AccountsService } from '../accounts/AccountsService';
import { AccountsEvents } from '../accounts/models';
import { FirebaseService } from '../firebase/FirebaseService';
import { LockService } from '../lock/LockService';
import { StorageService } from '../storage/StorageService';
import { BalanceNotificationService } from './BalanceNotificationService';
import { BalanceNotificationTypes, NotificationCategories } from './models';
import { sendRequest } from './utils/sendRequest';
import { NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION_STORAGE_KEY } from './constants';
import { sendNotification } from './utils/sendNotification';

jest.mock('./utils/sendRequest');
jest.mock('./utils/sendNotification');

describe('BalanceNotificationService', () => {
  const accountsServiceMock = {
    addListener: jest.fn(),
    getAccountList: jest.fn(),
  };
  const storageServiceMock = {
    load: jest.fn(),
    save: jest.fn(),
  };
  const firebaseServiceMock = {
    addFcmMessageListener: jest.fn(),
  };
  const createBalanceNotificationService = (locked: boolean) =>
    new BalanceNotificationService(
      accountsServiceMock as unknown as AccountsService,
      storageServiceMock as unknown as StorageService,
      firebaseServiceMock as unknown as FirebaseService,
      { locked } as unknown as LockService,
    );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should subscribe to FCM_MESSAGE and ACCOUNTS_UPDATED events', async () => {
    const balanceNotificationService = createBalanceNotificationService(true);
    await balanceNotificationService.init('deviceArn');

    expect(firebaseServiceMock.addFcmMessageListener).toHaveBeenCalledWith(
      NotificationCategories.BALANCE_CHANGES,
      expect.any(Function),
    );
    expect(accountsServiceMock.addListener).toHaveBeenCalledWith(
      AccountsEvents.ACCOUNTS_UPDATED,
      expect.any(Function),
    );
    expect(sendRequest).not.toHaveBeenCalled();
  });

  describe('subscribe', () => {
    it('should not resubscribe with the same details', async () => {
      const balanceNotificationService = createBalanceNotificationService(true);
      await balanceNotificationService.init('deviceArn');

      jest.clearAllMocks();

      storageServiceMock.load.mockResolvedValueOnce({
        isSubscribed: true,
        addresses: ['0x123'],
        chainIds: [
          ChainId.AVALANCHE_MAINNET_ID.toString(),
          ChainId.AVALANCHE_TESTNET_ID.toString(),
        ],
      });

      accountsServiceMock.getAccountList.mockReturnValueOnce([
        { addressC: '0x123' },
      ]);

      await balanceNotificationService.subscribe();
      expect(sendRequest).not.toHaveBeenCalled();
    });

    it('should subscribe correctly', async () => {
      const balanceNotificationService =
        createBalanceNotificationService(false);
      await balanceNotificationService.init('deviceArn');

      jest.clearAllMocks();

      storageServiceMock.load.mockResolvedValueOnce({
        isSubscribed: false,
        addresses: ['0x123'],
        chainIds: [
          ChainId.AVALANCHE_MAINNET_ID.toString(),
          ChainId.AVALANCHE_TESTNET_ID.toString(),
        ],
      });

      accountsServiceMock.getAccountList.mockReturnValueOnce([
        { addressC: '0x123' },
        { addressC: '0x456' },
      ]);

      await balanceNotificationService.subscribe();

      expect(sendRequest).toHaveBeenCalledWith({
        path: 'v1/push/balance-changes/subscribe',
        clientId: 'deviceArn',
        payload: {
          chainIds: [
            ChainId.AVALANCHE_MAINNET_ID.toString(),
            ChainId.AVALANCHE_TESTNET_ID.toString(),
          ],
          addresses: ['0x123', '0x456'],
        },
      });

      expect(storageServiceMock.save).toHaveBeenCalledWith(
        NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION_STORAGE_KEY,
        {
          isSubscribed: true,
          addresses: ['0x123', '0x456'],
          chainIds: [
            ChainId.AVALANCHE_MAINNET_ID.toString(),
            ChainId.AVALANCHE_TESTNET_ID.toString(),
          ],
        },
      );
    });
  });

  describe('unsubscribe', () => {
    it('should not unsubscribe if the subscription is not active', async () => {
      const balanceNotificationService = createBalanceNotificationService(true);
      await balanceNotificationService.init('deviceArn');

      jest.clearAllMocks();

      storageServiceMock.load.mockResolvedValueOnce({
        isSubscribed: false,
        addresses: [],
        chainIds: [],
      });

      await balanceNotificationService.unsubscribe();
      expect(sendRequest).not.toHaveBeenCalled();
    });

    it('should unsubscribe correctly', async () => {
      const balanceNotificationService =
        createBalanceNotificationService(false);
      await balanceNotificationService.init('deviceArn');

      jest.clearAllMocks();

      storageServiceMock.load.mockResolvedValueOnce({
        isSubscribed: true,
        addresses: ['0x123'],
        chainIds: [
          ChainId.AVALANCHE_MAINNET_ID.toString(),
          ChainId.AVALANCHE_TESTNET_ID.toString(),
        ],
      });

      await balanceNotificationService.unsubscribe();

      expect(sendRequest).toHaveBeenCalledWith({
        path: 'v1/push/balance-changes/unsubscribe',
        clientId: 'deviceArn',
        payload: {},
      });

      expect(storageServiceMock.save).toHaveBeenCalledWith(
        NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION_STORAGE_KEY,
        {
          isSubscribed: false,
          addresses: [],
          chainIds: [],
        },
      );
    });
  });

  it('should send a notification when a new message is received', async () => {
    const balanceNotificationService = createBalanceNotificationService(false);
    await balanceNotificationService.init('deviceArn');

    // simulate FCM_MESSAGE event
    jest
      .mocked(firebaseServiceMock.addFcmMessageListener)
      .mock.calls[0]?.[1]({ data: { foo: 'bar' } });

    expect(sendNotification).toHaveBeenCalledWith({
      payload: { data: { foo: 'bar' } },
      allowedType: NotificationCategories.BALANCE_CHANGES,
    });
  });

  it('should return the current subscriptions', async () => {
    const balanceNotificationService = createBalanceNotificationService(false);
    await balanceNotificationService.init('deviceArn');

    storageServiceMock.load.mockResolvedValueOnce({
      isSubscribed: true,
      addresses: ['0x123'],
      chainIds: [
        ChainId.AVALANCHE_MAINNET_ID.toString(),
        ChainId.AVALANCHE_TESTNET_ID.toString(),
      ],
    });

    const subscriptions = await balanceNotificationService.getSubscriptions();

    expect(subscriptions).toStrictEqual({
      [BalanceNotificationTypes.BALANCE_CHANGES]: true,
    });
  });
});
