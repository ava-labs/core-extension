import { singleton } from 'tsyringe';
import { AppCheckService } from '../appcheck/AppCheckService';
import {
  NewsNotificationTypes,
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
import { sendNotification } from './handlers/utils/sendNotification';

@singleton()
export class NewsNotificationService {
  #clientId?: string;

  constructor(
    private appCheckService: AppCheckService,
    private storageService: StorageService,
    private firebaseService: FirebaseService,
  ) {}

  async init(clientId: string) {
    this.#clientId = clientId;

    for (const event of Object.values(NewsNotificationTypes)) {
      this.firebaseService.addFcmMessageListener(event, (payload) =>
        this.#handleMessage(payload),
      );
    }

    // when to subscribe first time?
  }

  async #getSubscriptionStateFromStorage() {
    return (
      (await this.storageService.loadUnencrypted<NotificationsNewsSubscriptionStorage>(
        NOTIFICATIONS_NEWS_SUBSCRIPTION_STORAGE_KEY,
      )) ?? NOTIFICATIONS_NEWS_SUBSCRIPTION_DEFAULT_STATE
    );
  }

  async #saveSubscriptionStateToStorage(
    subscriptions: NotificationsNewsSubscriptionStorage,
  ) {
    await this.storageService.saveUnencrypted(
      NOTIFICATIONS_NEWS_SUBSCRIPTION_STORAGE_KEY,
      subscriptions,
    );
  }

  #handleMessage(payload: MessagePayload) {
    return sendNotification({
      payload,
      allowedEvents: NOTIFICATION_CATEGORIES.NEWS,
    });
  }

  async getSubscriptions() {
    return this.#getSubscriptionStateFromStorage();
  }

  async subscribe(
    notificationType: keyof NotificationsNewsSubscriptionStorage,
  ) {
    if (!NOTIFICATION_CATEGORIES.NEWS.includes(notificationType)) {
      throw new Error(`Invalid notification type ${notificationType}`);
    }

    const state = await this.#getSubscriptionStateFromStorage();
    const existingSubscriptions = Object.entries(state)
      .map(([event, isSubscribed]) => {
        if (isSubscribed) {
          return event;
        }
      })
      .filter(Boolean) as NotificationTypes[];

    if (existingSubscriptions.includes(notificationType)) {
      return;
    }

    const newSubscriptions = [...existingSubscriptions, notificationType];

    const { token: appcheckToken } =
      (await this.appCheckService.getAppcheckToken()) ?? {};

    if (!appcheckToken) {
      throw new Error('AppCheck token is missing');
    }

    const response = await fetch(
      `${process.env.NOTIFICATION_SENDER_SERVICE_URL}/v1/push/news/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Firebase-AppCheck': appcheckToken,
        },
        body: JSON.stringify({
          deviceArn: this.#clientId,
          events: newSubscriptions,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    await this.#saveSubscriptionStateToStorage({
      ...state,
      [notificationType]: true,
    });
  }

  async unsubscribe(
    notificationType: keyof NotificationsNewsSubscriptionStorage,
  ) {
    if (!NOTIFICATION_CATEGORIES.NEWS.includes(notificationType)) {
      throw new Error(`Invalid notification type ${notificationType}`);
    }

    const state = await this.#getSubscriptionStateFromStorage();
    const { token: appcheckToken } =
      (await this.appCheckService.getAppcheckToken()) ?? {};

    if (!appcheckToken) {
      throw new Error('AppCheck token is missing');
    }

    const response = await fetch(
      `${process.env.NOTIFICATION_SENDER_SERVICE_URL}/v1/push/news/unsubscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Firebase-AppCheck': appcheckToken,
        },
        body: JSON.stringify({
          deviceArn: this.#clientId,
          events: [notificationType],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    await this.#saveSubscriptionStateToStorage({
      ...state,
      [notificationType]: false,
    });
  }
}
