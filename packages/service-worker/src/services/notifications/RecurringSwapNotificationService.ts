import {
  BalanceNotificationTypes,
  NotificationsRecurringSwapSubscriptionStorage,
  RECURRING_SWAP_NOTIFICATION_TYPE,
} from '@core/types';
import { MessagePayload } from 'firebase/messaging';
import { singleton } from 'tsyringe';
import { BalanceNotificationService } from './BalanceNotificationService';
import { FirebaseService } from '../firebase/FirebaseService';
import { LockService } from '../lock/LockService';
import { StorageService } from '../storage/StorageService';
import {
  NOTIFICATIONS_RECURRING_SWAP_SUBSCRIPTION_DEFAULT_STATE,
  NOTIFICATIONS_RECURRING_SWAP_SUBSCRIPTION_STORAGE_KEY,
} from './constants';
import { sendRequest } from './utils/sendRequest';

/** A recurring swap order id is a 32-byte hash, e.g. 0x<64 hex chars>. */
const ORDER_ID_REGEX = /^0x[0-9a-fA-F]{64}$/;

@singleton()
export class RecurringSwapNotificationService {
  #clientId?: string;
  #onMessageReceived?: () => void;

  constructor(
    private storageService: StorageService,
    private firebaseService: FirebaseService,
    private lockService: LockService,
    private balanceNotificationService: BalanceNotificationService,
  ) {}

  async init(clientId: string, onMessageReceived?: () => void) {
    this.#clientId = clientId;
    this.#onMessageReceived = onMessageReceived;
    this.firebaseService.addFcmMessageListener(
      RECURRING_SWAP_NOTIFICATION_TYPE,
      (payload) => this.#handleMessage(payload),
    );
  }

  #handleMessage(payload: MessagePayload) {
    const title = payload.notification?.title ?? payload.data?.title;
    const body = payload.notification?.body ?? payload.data?.body;

    if (title && body) {
      chrome.notifications.create({
        type: 'basic',
        title,
        message: body,
        iconUrl: '../../../../images/icon-192.png',
        priority: 2,
      });
    }

    this.#onMessageReceived?.();
  }

  async #getSubscriptionStateFromStorage() {
    return (
      (await this.storageService.load<NotificationsRecurringSwapSubscriptionStorage>(
        NOTIFICATIONS_RECURRING_SWAP_SUBSCRIPTION_STORAGE_KEY,
      )) ?? NOTIFICATIONS_RECURRING_SWAP_SUBSCRIPTION_DEFAULT_STATE
    );
  }

  async #saveSubscriptionStateToStorage(
    state: NotificationsRecurringSwapSubscriptionStorage,
  ) {
    await this.storageService.save(
      NOTIFICATIONS_RECURRING_SWAP_SUBSCRIPTION_STORAGE_KEY,
      state,
    );
  }

  async #isEnabled() {
    const { [BalanceNotificationTypes.BALANCE_CHANGES]: isBalanceEnabled } =
      await this.balanceNotificationService.getSubscriptions();

    return isBalanceEnabled;
  }

  /**
   * Subscribes the device to push updates for the given order ids. Gated by the
   * Balance changes preference, so recurring swaps reuse that single toggle.
   *
   * The backend upsert is idempotent and there is no unsubscribe endpoint
   * (teardown is owned by the backend webhook on terminal updates), so we only
   * send a request for order ids we haven't already subscribed this device to.
   */
  async subscribeToOrders(orderIds: string[]) {
    if (!this.#clientId || this.lockService.locked) {
      return;
    }

    if (!(await this.#isEnabled())) {
      return;
    }

    const state = await this.#getSubscriptionStateFromStorage();
    const subscribed = new Set(state.orderIds);
    const pending = orderIds.filter(
      (orderId) => ORDER_ID_REGEX.test(orderId) && !subscribed.has(orderId),
    );

    if (!pending.length) {
      return;
    }

    const results = await Promise.allSettled(
      pending.map((orderId) =>
        sendRequest({
          path: 'v1/push/recurring-swaps/subscribe',
          clientId: this.#clientId,
          payload: { orderId },
        }),
      ),
    );

    const newlySubscribed = pending.filter(
      (_, index) => results[index]?.status === 'fulfilled',
    );

    if (!newlySubscribed.length) {
      return;
    }

    await this.#saveSubscriptionStateToStorage({
      orderIds: [...subscribed, ...newlySubscribed],
    });
  }
}
