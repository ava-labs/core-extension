import { singleton } from 'tsyringe';
import {
  NotificationCategories,
  NotificationsNewsSubscriptionStorage,
  NotificationTypes,
} from './models';
import { StorageService } from '../storage/StorageService';
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATIONS_NEWS_SUBSCRIPTION_DEFAULT_STATE,
  NOTIFICATIONS_NEWS_SUBSCRIPTION_STORAGE_KEY,
} from './constants';
import { FirebaseService } from '../firebase/FirebaseService';
import { MessagePayload } from 'firebase/messaging';
import { sendNotification } from './utils/sendNotification';
import { OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import { LockService } from '../lock/LockService';
import { sendRequest } from './utils/sendRequest';

@singleton()
export class NewsNotificationService implements OnUnlock {
  #clientId?: string;

  constructor(
    private storageService: StorageService,
    private firebaseService: FirebaseService,
    private lockService: LockService,
  ) {}

  async init(clientId: string) {
    this.#clientId = clientId;
    this.firebaseService.addFcmMessageListener(
      NotificationCategories.NEWS,
      this.#handleMessage,
    );

    // attempt to refresh the existing subscriptions
    await this.subscribe([]);
  }

  async onUnlock() {
    // attempt to refresh the existing subscriptions
    await this.subscribe([]);
  }

  async #getSubscriptionStateFromStorage() {
    return (
      (await this.storageService.load<NotificationsNewsSubscriptionStorage>(
        NOTIFICATIONS_NEWS_SUBSCRIPTION_STORAGE_KEY,
      )) ?? NOTIFICATIONS_NEWS_SUBSCRIPTION_DEFAULT_STATE
    );
  }

  async #saveSubscriptionStateToStorage(
    subscriptions: NotificationsNewsSubscriptionStorage,
  ) {
    await this.storageService.save(
      NOTIFICATIONS_NEWS_SUBSCRIPTION_STORAGE_KEY,
      subscriptions,
    );
  }

  #handleMessage(payload: MessagePayload) {
    return sendNotification({
      payload,
      allowedType: NotificationCategories.NEWS,
      allowedEvents: NOTIFICATION_CATEGORIES.NEWS,
    });
  }

  async getSubscriptions() {
    return this.#getSubscriptionStateFromStorage();
  }

  // adds the notification types to the existing subscriptions
  async subscribe(
    notificationTypes: (keyof NotificationsNewsSubscriptionStorage)[],
  ) {
    // device is not registered yet or wallet is locked
    if (!this.#clientId || this.lockService.locked) {
      return;
    }

    if (
      notificationTypes.some(
        (notificationType) =>
          !NOTIFICATION_CATEGORIES.NEWS.includes(notificationType),
      )
    ) {
      throw new Error(`Invalid notification type provided`);
    }

    const state = await this.#getSubscriptionStateFromStorage();
    const existingSubscriptions = Object.entries(state)
      .map(([event, isSubscribed]) => {
        if (isSubscribed) {
          return event;
        }
      })
      .filter(Boolean) as NotificationTypes[];

    const newSubscriptions = [
      ...new Set([...existingSubscriptions, ...notificationTypes]),
    ];

    await sendRequest({
      path: 'v1/push/news/subscribe',
      clientId: this.#clientId,
      payload: {
        events: newSubscriptions,
      },
    });

    await this.#saveSubscriptionStateToStorage({
      ...state,
      ...notificationTypes.reduce(
        (acc, type) => ({ ...acc, [type]: true }),
        {},
      ),
    });
  }

  async unsubscribe(
    notificationType: keyof NotificationsNewsSubscriptionStorage,
  ) {
    if (!NOTIFICATION_CATEGORIES.NEWS.includes(notificationType)) {
      throw new Error(`Invalid notification type ${notificationType}`);
    }

    const state = await this.#getSubscriptionStateFromStorage();

    await sendRequest({
      path: 'v1/push/news/unsubscribe',
      clientId: this.#clientId,
      payload: {
        events: [notificationType],
      },
    });

    await this.#saveSubscriptionStateToStorage({
      ...state,
      [notificationType]: false,
    });
  }
}
