import {
  BalanceNotificationTypes,
  RECURRING_SWAP_NOTIFICATION_TYPE,
} from '@core/types';
import { RecurringOrderStatus } from '@avalabs/fusion-sdk';
import { MessagePayload } from 'firebase/messaging';
import { BalanceNotificationService } from './BalanceNotificationService';
import { FirebaseService } from '../firebase/FirebaseService';
import { LockService } from '../lock/LockService';
import { StorageService } from '../storage/StorageService';
import { AccountsService } from '../accounts/AccountsService';
import { TransferTrackingService } from '../transferTracking/TransferTrackingService';
import { RecurringSwapNotificationService } from './RecurringSwapNotificationService';
import { NOTIFICATIONS_RECURRING_SWAP_SUBSCRIPTION_STORAGE_KEY } from './constants';
import { sendRequest } from './utils/sendRequest';

jest.mock('./utils/sendRequest');

const ORDER_ID_A =
  '0x1111111111111111111111111111111111111111111111111111111111111111';
const ORDER_ID_B =
  '0x2222222222222222222222222222222222222222222222222222222222222222';

describe('RecurringSwapNotificationService', () => {
  const storageServiceMock = {
    load: jest.fn(),
    save: jest.fn(),
    loadUnencrypted: jest.fn(),
    saveUnencrypted: jest.fn(),
  };
  const firebaseServiceMock = {
    addFcmMessageListener: jest.fn(),
  };
  const balanceNotificationServiceMock = {
    getSubscriptions: jest.fn(),
    addListener: jest.fn(),
  };
  const listOrdersMock = jest.fn();
  const accountsServiceMock = {
    getActiveAccount: jest.fn(),
  };
  const transferTrackingServiceMock = {
    getManager: jest.fn(),
  };

  const createService = (locked: boolean) =>
    new RecurringSwapNotificationService(
      storageServiceMock as unknown as StorageService,
      firebaseServiceMock as unknown as FirebaseService,
      { locked } as unknown as LockService,
      balanceNotificationServiceMock as unknown as BalanceNotificationService,
      accountsServiceMock as unknown as AccountsService,
      transferTrackingServiceMock as unknown as TransferTrackingService,
    );

  beforeEach(() => {
    jest.resetAllMocks();

    // Defaults: discovery is a no-op unless a test opts in (disabled + no manager).
    balanceNotificationServiceMock.getSubscriptions.mockResolvedValue({
      [BalanceNotificationTypes.BALANCE_CHANGES]: false,
    });
    transferTrackingServiceMock.getManager.mockReturnValue(undefined);

    global.chrome = {
      notifications: {
        create: jest.fn(),
      },
      alarms: {
        get: jest.fn().mockResolvedValue(undefined),
        create: jest.fn(),
        clear: jest.fn().mockResolvedValue(true),
        onAlarm: { addListener: jest.fn() },
      },
    } as unknown as typeof chrome;
  });

  it('registers an FCM listener for recurring swaps', async () => {
    const service = createService(false);
    await service.init('deviceArn');

    expect(firebaseServiceMock.addFcmMessageListener).toHaveBeenCalledWith(
      RECURRING_SWAP_NOTIFICATION_TYPE,
      expect.any(Function),
    );
  });

  it('shows a native notification from the FCM notification payload', async () => {
    balanceNotificationServiceMock.getSubscriptions.mockResolvedValue({
      [BalanceNotificationTypes.BALANCE_CHANGES]: true,
    });
    const onMessageReceived = jest.fn();
    const service = createService(false);
    await service.init('deviceArn', onMessageReceived);

    const listener = jest.mocked(firebaseServiceMock.addFcmMessageListener).mock
      .calls[0]?.[1] as (payload: MessagePayload) => Promise<void>;

    await listener({
      notification: { title: 'Recurring swap executed', body: 'Swap 1 done' },
      data: { type: RECURRING_SWAP_NOTIFICATION_TYPE },
    } as unknown as MessagePayload);

    expect(chrome.notifications.create).toHaveBeenCalledWith({
      type: 'basic',
      title: 'Recurring swap executed',
      message: 'Swap 1 done',
      iconUrl: '../../../../images/icon-192.png',
      priority: 2,
    });
    expect(onMessageReceived).toHaveBeenCalled();
  });

  it('drops the push when Balance changes notifications are disabled', async () => {
    balanceNotificationServiceMock.getSubscriptions.mockResolvedValue({
      [BalanceNotificationTypes.BALANCE_CHANGES]: false,
    });
    const onMessageReceived = jest.fn();
    const service = createService(false);
    await service.init('deviceArn', onMessageReceived);

    const listener = jest.mocked(firebaseServiceMock.addFcmMessageListener).mock
      .calls[0]?.[1] as (payload: MessagePayload) => Promise<void>;

    await listener({
      notification: { title: 'Recurring swap executed', body: 'Swap 1 done' },
      data: { type: RECURRING_SWAP_NOTIFICATION_TYPE },
    } as unknown as MessagePayload);

    expect(chrome.notifications.create).not.toHaveBeenCalled();
    expect(onMessageReceived).not.toHaveBeenCalled();
  });

  it('clears local subscriptions and stops discovery when the toggle is turned off', async () => {
    balanceNotificationServiceMock.getSubscriptions.mockResolvedValue({
      [BalanceNotificationTypes.BALANCE_CHANGES]: false,
    });
    const service = createService(false);
    await service.init('deviceArn');

    const onSubscriptionsChanged = jest.mocked(
      balanceNotificationServiceMock.addListener,
    ).mock.calls[0]?.[1] as () => Promise<void>;

    await onSubscriptionsChanged();

    expect(chrome.alarms.clear).toHaveBeenCalledWith(
      'recurring-swap-subscription-discovery',
    );
    expect(storageServiceMock.save).toHaveBeenCalledWith(
      NOTIFICATIONS_RECURRING_SWAP_SUBSCRIPTION_STORAGE_KEY,
      { orderIds: [] },
    );
  });

  describe('subscribeToOrders', () => {
    it('does nothing when wallet is locked', async () => {
      const service = createService(true);
      await service.init('deviceArn');

      await service.subscribeToOrders([ORDER_ID_A]);

      expect(sendRequest).not.toHaveBeenCalled();
    });

    it('does nothing when balance changes notifications are disabled', async () => {
      balanceNotificationServiceMock.getSubscriptions.mockResolvedValue({
        [BalanceNotificationTypes.BALANCE_CHANGES]: false,
      });

      const service = createService(false);
      await service.init('deviceArn');

      await service.subscribeToOrders([ORDER_ID_A]);

      expect(sendRequest).not.toHaveBeenCalled();
    });

    it('subscribes only to new, valid order ids and persists them', async () => {
      balanceNotificationServiceMock.getSubscriptions.mockResolvedValue({
        [BalanceNotificationTypes.BALANCE_CHANGES]: true,
      });
      storageServiceMock.load.mockResolvedValue({ orderIds: [ORDER_ID_A] });
      jest.mocked(sendRequest).mockResolvedValue(undefined);

      const service = createService(false);
      await service.init('deviceArn');

      await service.subscribeToOrders([ORDER_ID_A, ORDER_ID_B, 'not-an-id']);

      expect(sendRequest).toHaveBeenCalledTimes(1);
      expect(sendRequest).toHaveBeenCalledWith({
        path: 'v1/push/recurring-swaps/subscribe',
        clientId: 'deviceArn',
        payload: { orderId: ORDER_ID_B },
      });
      expect(storageServiceMock.save).toHaveBeenCalledWith(
        NOTIFICATIONS_RECURRING_SWAP_SUBSCRIPTION_STORAGE_KEY,
        { orderIds: [ORDER_ID_A, ORDER_ID_B] },
      );
    });

    it('does not persist order ids whose subscription request failed', async () => {
      balanceNotificationServiceMock.getSubscriptions.mockResolvedValue({
        [BalanceNotificationTypes.BALANCE_CHANGES]: true,
      });
      storageServiceMock.load.mockResolvedValue({ orderIds: [] });
      jest.mocked(sendRequest).mockRejectedValue(new Error('boom'));

      const service = createService(false);
      await service.init('deviceArn');

      await service.subscribeToOrders([ORDER_ID_A]);

      expect(sendRequest).toHaveBeenCalledTimes(1);
      expect(storageServiceMock.save).not.toHaveBeenCalled();
    });
  });

  describe('discoverAndSubscribe', () => {
    const enableAndMockManager = () => {
      balanceNotificationServiceMock.getSubscriptions.mockResolvedValue({
        [BalanceNotificationTypes.BALANCE_CHANGES]: true,
      });
      accountsServiceMock.getActiveAccount.mockResolvedValue({
        addressC: '0xabc',
      });
      transferTrackingServiceMock.getManager.mockReturnValue({
        recurring: { listOrders: listOrdersMock },
      });
    };

    it('subscribes active/paused orders and keeps polling while work remains', async () => {
      enableAndMockManager();
      storageServiceMock.load.mockResolvedValue({ orderIds: [] });
      storageServiceMock.loadUnencrypted.mockResolvedValue({ watchUntil: 0 });
      jest.mocked(sendRequest).mockResolvedValue(undefined);
      listOrdersMock.mockResolvedValue({
        orders: [
          { orderId: ORDER_ID_A, status: RecurringOrderStatus.Active },
          { orderId: ORDER_ID_B, status: RecurringOrderStatus.Completed },
        ],
      });

      const service = createService(false);
      await service.init('deviceArn');
      await service.discoverAndSubscribe();

      // Assert discovery subscribed only the active order, not the completed one.
      expect(sendRequest).toHaveBeenCalledWith({
        path: 'v1/push/recurring-swaps/subscribe',
        clientId: 'deviceArn',
        payload: { orderId: ORDER_ID_A },
      });
      expect(sendRequest).not.toHaveBeenCalledWith(
        expect.objectContaining({ payload: { orderId: ORDER_ID_B } }),
      );
    });

    it('stops discovery when there are no active orders and no watch window', async () => {
      enableAndMockManager();
      storageServiceMock.load.mockResolvedValue({ orderIds: [] });
      storageServiceMock.loadUnencrypted.mockResolvedValue({ watchUntil: 0 });
      listOrdersMock.mockResolvedValue({ orders: [] });

      const service = createService(false);
      await service.init('deviceArn');
      await service.discoverAndSubscribe();

      expect(sendRequest).not.toHaveBeenCalled();
      expect(chrome.alarms.clear).toHaveBeenCalledWith(
        'recurring-swap-subscription-discovery',
      );
    });

    it('opens a watch window and schedules the alarm on requestDiscovery', async () => {
      enableAndMockManager();
      storageServiceMock.load.mockResolvedValue({ orderIds: [] });
      storageServiceMock.loadUnencrypted.mockResolvedValue({
        watchUntil: Date.now() + 60_000,
      });
      listOrdersMock.mockResolvedValue({ orders: [] });

      const service = createService(false);
      await service.requestDiscovery();

      expect(storageServiceMock.saveUnencrypted).toHaveBeenCalledWith(
        'NOTIFICATIONS_RECURRING_SWAP_DISCOVERY',
        expect.objectContaining({ watchUntil: expect.any(Number) }),
      );
      // No active orders yet (indexing lag), but the watch window keeps polling.
      expect(chrome.alarms.create).toHaveBeenCalledWith(
        'recurring-swap-subscription-discovery',
        expect.objectContaining({ periodInMinutes: expect.any(Number) }),
      );
    });
  });
});
