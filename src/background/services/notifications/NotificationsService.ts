import { singleton } from 'tsyringe';
import { AppCheckService } from '../appcheck/AppCheckService';
import { StorageService } from '../storage/StorageService';
import {
  DEFAULT_STATE,
  NOTIFICATION_CATEGORIES,
  STORAGE_KEY,
} from './constants';
import { NotificationsState, NotificationTypes } from './models';
import { FirebaseService } from '../firebase/FirebaseService';
import { FirebaseEvents } from '../firebase/models';
import { incrementalPromiseResolve } from '@src/utils/incrementalPromiseResolve';
import { BalanceNotificationService } from './BalanceNotificationService';

@singleton()
export class NotificationsService {
  #state = DEFAULT_STATE;
  #fcmToken?: string;

  constructor(
    private storageService: StorageService,
    private firebaseService: FirebaseService,
    private appCheckService: AppCheckService,
    private balanceNotificationService: BalanceNotificationService,
  ) {
    this.firebaseService.addFirebaseEventListener(
      FirebaseEvents.FCM_INITIALIZED,
      async () => {
        await this.#init();
      },
    );

    this.firebaseService.addFirebaseEventListener(
      FirebaseEvents.FCM_TERMINATED,
      () => {
        this.#fcmToken = undefined;
      },
    );
  }

  async #init() {
    this.#fcmToken = this.firebaseService.getFcmToken();
    this.#state =
      (await this.storageService.loadUnencrypted<NotificationsState>(
        STORAGE_KEY,
      )) ?? DEFAULT_STATE;

    const { deviceArn: clientId } = await incrementalPromiseResolve(
      () => this.#registerDevice(),
      (res) => !res.deviceArn, // we want to retry until we get a correct response
      0,
      5,
    );

    if (!clientId) {
      throw new Error('registration failed');
    }

    this.#state = {
      clientId,
      subscriptions: {
        ...DEFAULT_STATE.subscriptions,
        ...this.#state.subscriptions,
      },
    };

    await this.storageService.saveUnencrypted(STORAGE_KEY, this.#state);

    // init individual notification services when device is registered
    await this.balanceNotificationService.init(clientId);
  }

  async #registerDevice() {
    if (!this.#fcmToken) {
      throw new Error('fcm token is missing');
    }

    const { token: appcheckToken } =
      (await this.appCheckService.getAppcheckToken()) ?? {};

    if (!appcheckToken) {
      throw new Error('appcheck token is missing');
    }

    const response = await fetch(
      `${process.env.NOTIFICATION_SENDER_SERVICE_URL}/v1/push/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Firebase-AppCheck': appcheckToken,
        },
        body: JSON.stringify({
          deviceToken: this.#fcmToken,
          appType: 'CORE_EXTENSION',
          ...(this.#state.clientId && { deviceArn: this.#state.clientId }),
        }),
      },
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const result = ((await response.json()) ?? {}) as {
      deviceArn?: string;
    };

    return result;
  }

  #getServiceForNotificationType(notificationType: NotificationTypes) {
    const [category] =
      Object.entries(NOTIFICATION_CATEGORIES).find(([_, events]) =>
        events.find((event) => event === notificationType),
      ) ?? [];

    switch (category) {
      case NotificationTypes.BALANCE_CHANGES:
        return this.balanceNotificationService;
      // case NotificationTypes.NEWS:
      default:
        throw new Error(`Unknown notification type: ${notificationType}`);
    }
  }

  async getSubscriptions() {
    return this.#state.subscriptions;
  }

  async subscribe(notificationType: NotificationTypes) {
    if (this.#state.subscriptions[notificationType] === true) {
      return;
    }

    const service = this.#getServiceForNotificationType(notificationType);
    await service.subscribe();

    this.#state.subscriptions[notificationType] = true;
    await this.storageService.save(STORAGE_KEY, this.#state);
  }

  async unsubscribe(notificationType: NotificationTypes) {
    if (this.#state.subscriptions[notificationType] === false) {
      return;
    }

    const service = this.#getServiceForNotificationType(notificationType);
    await service.unsubscribe();

    this.#state.subscriptions[notificationType] = false;
    await this.storageService.save(STORAGE_KEY, this.#state);
  }

  /* async #refreshSubscriptions() {
    const isSubscribedToBalanceChanges =
      this.#state.subscriptions.BALANCE_CHANGES;

    if (isSubscribedToBalanceChanges) {
      await this.#subscribeToBalanceChanges();
    } else {
      await this.#unsubscribeFromBalanceChanges();
    }

    const { newsEventsUserSubscribedTo, newsEventsUserNotSubscribedTo } =
      NOTIFICATION_CATEGORIES.NEWS.reduce<{
        newsEventsUserSubscribedTo: NotificationTypes[];
        newsEventsUserNotSubscribedTo: NotificationTypes[];
      }>(
        (acc, event) => {
          if (this.#state.subscriptions[event]) {
            acc.newsEventsUserSubscribedTo.push(event);
          } else {
            acc.newsEventsUserNotSubscribedTo.push(event);
          }

          return acc;
        },
        {
          newsEventsUserSubscribedTo: [],
          newsEventsUserNotSubscribedTo: [],
        },
      );

    await this.#subscribeToNewsEvents(newsEventsUserSubscribedTo);
    await this.#unsubscribeFromNewsEvents(newsEventsUserNotSubscribedTo);
  }

  async #subscribeToBalanceChanges() {
    throw new Error('Method not implemented.');
  }

  async #unsubscribeFromBalanceChanges() {
    throw new Error('Method not implemented.');
  }

  async #subscribeToNewsEvents(
    newsEventsUserSubscribedTo: NotificationTypes[],
  ) {
    throw new Error('Method not implemented.');
  }

  async #unsubscribeFromNewsEvents(
    newsEventsUserNotSubscribedTo: NotificationTypes[],
  ) {
    throw new Error('Method not implemented.');
  } */
}
