import {
  BalanceNotificationTypes,
  RECURRING_SWAP_NOTIFICATION_TYPE,
} from '@core/types';
import { MessagePayload } from 'firebase/messaging';
import { BalanceNotificationService } from './BalanceNotificationService';
import { FirebaseService } from '../firebase/FirebaseService';
import { LockService } from '../lock/LockService';
import { StorageService } from '../storage/StorageService';
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
  };
  const firebaseServiceMock = {
    addFcmMessageListener: jest.fn(),
  };
  const balanceNotificationServiceMock = {
    getSubscriptions: jest.fn(),
  };

  const createService = (locked: boolean) =>
    new RecurringSwapNotificationService(
      storageServiceMock as unknown as StorageService,
      firebaseServiceMock as unknown as FirebaseService,
      { locked } as unknown as LockService,
      balanceNotificationServiceMock as unknown as BalanceNotificationService,
    );

  beforeEach(() => {
    jest.resetAllMocks();

    global.chrome = {
      notifications: {
        create: jest.fn(),
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
    const onMessageReceived = jest.fn();
    const service = createService(false);
    await service.init('deviceArn', onMessageReceived);

    const listener = jest.mocked(firebaseServiceMock.addFcmMessageListener).mock
      .calls[0]?.[1] as (payload: MessagePayload) => void;

    listener({
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
});
