import {
  AlarmsEvents,
  BalanceNotificationTypes,
  NotificationsRecurringSwapDiscoveryStorage,
  NotificationsRecurringSwapSubscriptionStorage,
  RECURRING_SWAP_NOTIFICATION_TYPE,
  SubscriptionEvents,
} from '@core/types';
import { Monitoring } from '@core/common';
import { ChainId } from '@avalabs/core-chains-sdk';
import { RecurringOrderStatus } from '@avalabs/fusion-sdk';
import type { Address } from 'viem';
import { MessagePayload } from 'firebase/messaging';
import { singleton } from 'tsyringe';
import { BalanceNotificationService } from './BalanceNotificationService';
import { FirebaseService } from '../firebase/FirebaseService';
import { LockService } from '../lock/LockService';
import { StorageService } from '../storage/StorageService';
import { AccountsService } from '../accounts/AccountsService';
import { TransferTrackingService } from '../transferTracking/TransferTrackingService';
import { OnUnlock } from '../../runtime/lifecycleCallbacks';
import {
  NOTIFICATIONS_RECURRING_SWAP_DISCOVERY_STORAGE_KEY,
  NOTIFICATIONS_RECURRING_SWAP_SUBSCRIPTION_DEFAULT_STATE,
  NOTIFICATIONS_RECURRING_SWAP_SUBSCRIPTION_STORAGE_KEY,
  RECURRING_SWAP_DISCOVERY_PERIOD_MINUTES,
  RECURRING_SWAP_DISCOVERY_WATCH_WINDOW_MS,
} from './constants';
import { sendRequest } from './utils/sendRequest';

/** A recurring swap order id is a 32-byte hash, e.g. 0x<64 hex chars>. */
const ORDER_ID_REGEX = /^0x[0-9a-fA-F]{64}$/;

// Recurring swaps are C-Chain mainnet only for now.
const RECURRING_CHAIN_ID = ChainId.AVALANCHE_MAINNET_ID;

// Orders we still want push updates for. Terminal orders (completed/cancelled)
// are dropped — Markr won't emit further events for them.
const WATCHED_STATUSES = new Set<RecurringOrderStatus>([
  RecurringOrderStatus.Active,
  RecurringOrderStatus.Paused,
]);

@singleton()
export class RecurringSwapNotificationService implements OnUnlock {
  #clientId?: string;
  #onMessageReceived?: () => void;

  constructor(
    private storageService: StorageService,
    private firebaseService: FirebaseService,
    private lockService: LockService,
    private balanceNotificationService: BalanceNotificationService,
    private accountsService: AccountsService,
    private transferTrackingService: TransferTrackingService,
  ) {}

  async init(clientId: string, onMessageReceived?: () => void) {
    this.#clientId = clientId;
    this.#onMessageReceived = onMessageReceived;
    this.firebaseService.addFcmMessageListener(
      RECURRING_SWAP_NOTIFICATION_TYPE,
      (payload) => this.#handleMessage(payload),
    );

    // Recurring swaps reuse the Balance changes toggle. When it flips we either
    // (re)subscribe or tear down, since the backend has no unsubscribe endpoint.
    this.balanceNotificationService.addListener(
      SubscriptionEvents.SUBSCRIPTIONS_CHANGED_EVENT,
      () => this.#onBalanceSubscriptionChanged(),
    );

    this.discoverAndSubscribe();
  }

  /**
   * Registers the alarm listener that drives background discovery. Must run on
   * every SW startup (alarms persist across restarts, listeners do not).
   */
  activate() {
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === AlarmsEvents.RECURRING_SWAP_SUBSCRIPTION_DISCOVERY) {
        this.discoverAndSubscribe();
      }
    });
  }

  onUnlock() {
    this.discoverAndSubscribe();
  }

  async #handleMessage(payload: MessagePayload) {
    // The backend keeps pushing after the user disables Balance changes (no
    // unsubscribe endpoint), so drop updates while the toggle is off.
    if (!(await this.#isEnabled())) {
      return;
    }

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

  async #onBalanceSubscriptionChanged() {
    if (await this.#isEnabled()) {
      this.discoverAndSubscribe();
    } else {
      await this.#clearSubscriptions();
    }
  }

  /**
   * Tears down local subscription state and stops discovery. The backend has no
   * unsubscribe endpoint, so incoming pushes are additionally filtered in
   * `#handleMessage`.
   */
  async #clearSubscriptions() {
    await this.#stopDiscovery();
    await this.storageService.saveUnencrypted<NotificationsRecurringSwapDiscoveryStorage>(
      NOTIFICATIONS_RECURRING_SWAP_DISCOVERY_STORAGE_KEY,
      { watchUntil: 0 },
    );
    await this.#saveSubscriptionStateToStorage({ orderIds: [] });
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
   * Called when a recurring order is created in the UI. The order isn't listable
   * until Markr indexes the on-chain event, so we open a watch window and let the
   * alarm poll until it appears and gets subscribed — independent of the popup.
   */
  async requestDiscovery() {
    await this.storageService.saveUnencrypted<NotificationsRecurringSwapDiscoveryStorage>(
      NOTIFICATIONS_RECURRING_SWAP_DISCOVERY_STORAGE_KEY,
      { watchUntil: Date.now() + RECURRING_SWAP_DISCOVERY_WATCH_WINDOW_MS },
    );
    await this.#ensureDiscoveryScheduled();
    await this.discoverAndSubscribe();
  }

  /**
   * Lists the active account's orders and subscribes the device to push updates
   * for any not-yet-subscribed active/paused ones. Keeps the polling alarm
   * running while there's still work to do (or we're in a post-create watch
   * window) and stops it otherwise so we don't poll Markr indefinitely.
   */
  async discoverAndSubscribe() {
    try {
      if (!this.#clientId || this.lockService.locked) {
        return;
      }

      if (!(await this.#isEnabled())) {
        await this.#stopDiscovery();
        return;
      }

      const manager = this.transferTrackingService.getManager();
      const address = (await this.accountsService.getActiveAccount())?.addressC;

      if (!manager?.recurring || !address) {
        // Transient (manager not ready / no account yet) — leave the alarm be so
        // the next tick retries.
        return;
      }

      const { orders } = await manager.recurring.listOrders({
        address: address as Address,
        chainId: RECURRING_CHAIN_ID,
      });
      const watchedOrderIds = orders
        .filter((order) => WATCHED_STATUSES.has(order.status))
        .map((order) => order.orderId);

      await this.subscribeToOrders(watchedOrderIds);

      const { orderIds: subscribed } =
        await this.#getSubscriptionStateFromStorage();
      const subscribedSet = new Set(subscribed);
      const hasUnsubscribed = watchedOrderIds.some(
        (orderId) => !subscribedSet.has(orderId),
      );
      const { watchUntil = 0 } =
        (await this.storageService.loadUnencrypted<NotificationsRecurringSwapDiscoveryStorage>(
          NOTIFICATIONS_RECURRING_SWAP_DISCOVERY_STORAGE_KEY,
        )) ?? {};

      if (hasUnsubscribed || Date.now() < watchUntil) {
        await this.#ensureDiscoveryScheduled();
      } else {
        await this.#stopDiscovery();
      }
    } catch (err) {
      // Background task — never let it reject. Keep any existing alarm so the
      // next tick retries transient failures.
      Monitoring.sentryCaptureException(
        err instanceof Error ? err : new Error(String(err)),
        Monitoring.SentryExceptionTypes.NOTIFICATIONS,
      );
    }
  }

  async #ensureDiscoveryScheduled() {
    const existing = await chrome.alarms.get(
      AlarmsEvents.RECURRING_SWAP_SUBSCRIPTION_DISCOVERY,
    );
    if (!existing) {
      chrome.alarms.create(AlarmsEvents.RECURRING_SWAP_SUBSCRIPTION_DISCOVERY, {
        periodInMinutes: RECURRING_SWAP_DISCOVERY_PERIOD_MINUTES,
      });
    }
  }

  async #stopDiscovery() {
    await chrome.alarms.clear(
      AlarmsEvents.RECURRING_SWAP_SUBSCRIPTION_DISCOVERY,
    );
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
