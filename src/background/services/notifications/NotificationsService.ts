import { singleton } from 'tsyringe';
import { AppCheckService } from '../appcheck/AppCheckService';
import { StorageService } from '../storage/StorageService';
import {
  NOTIFICATIONS_CLIENT_ID_STORAGE_KEY,
  NOTIFICATIONS_CLIENT_ID_DEFAULT_STATE,
} from './constants';
import { FirebaseService } from '../firebase/FirebaseService';
import { FirebaseEvents } from '../firebase/models';
import { incrementalPromiseResolve } from '@src/utils/incrementalPromiseResolve';
import { BalanceNotificationService } from './BalanceNotificationService';
import { NewsNotificationService } from './NewsNotificationService';
@singleton()
export class NotificationsService {
  #clientId?: string;

  constructor(
    private storageService: StorageService,
    private firebaseService: FirebaseService,
    private appCheckService: AppCheckService,
    private balanceNotificationService: BalanceNotificationService,
    private newsNotificationService: NewsNotificationService,
  ) {
    this.firebaseService.addFirebaseEventListener(
      FirebaseEvents.FCM_INITIALIZED,
      async () => {
        await this.#init();
      },
    );
  }

  async #init() {
    this.#clientId = (
      (await this.storageService.loadUnencrypted<{ clientId?: string }>(
        NOTIFICATIONS_CLIENT_ID_STORAGE_KEY,
      )) ?? NOTIFICATIONS_CLIENT_ID_DEFAULT_STATE
    ).clientId;

    const { deviceArn: clientId } = await incrementalPromiseResolve(
      () => this.#registerDevice(),
      (res) => !res.deviceArn, // we want to retry until we get a correct response
      0,
      5,
    );

    if (!clientId) {
      throw new Error('registration failed');
    }

    if (this.#clientId !== clientId) {
      this.#clientId = clientId;

      await this.storageService.saveUnencrypted(
        NOTIFICATIONS_CLIENT_ID_STORAGE_KEY,
        { clientId },
      );
    }

    // init individual notification services when device is registered
    await this.balanceNotificationService.init(clientId);
    await this.newsNotificationService.init(clientId);
  }

  async #registerDevice() {
    const fcmToken = this.firebaseService.getFcmToken();

    if (!fcmToken) {
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
          deviceToken: fcmToken,
          appType: 'CORE_EXTENSION',
          ...(this.#clientId && { deviceArn: this.#clientId }),
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
}
