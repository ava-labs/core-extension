import { incrementalPromiseResolve, Monitoring } from '@core/common';
import { FirebaseEvents, RegisterDeviceResponse } from '@core/types';
import { singleton } from 'tsyringe';
import { FirebaseService } from '../firebase/FirebaseService';
import { StorageService } from '../storage/StorageService';
import { BalanceNotificationService } from './BalanceNotificationService';
import {
  NOTIFICATIONS_CLIENT_ID_DEFAULT_STATE,
  NOTIFICATIONS_CLIENT_ID_STORAGE_KEY,
} from './constants';
import { NewsNotificationService } from './NewsNotificationService';
import { sendRequest } from './utils/sendRequest';

@singleton()
export class NotificationsService {
  #clientId?: string;

  constructor(
    private storageService: StorageService,
    private firebaseService: FirebaseService,
    private balanceNotificationService: BalanceNotificationService,
    private newsNotificationService: NewsNotificationService,
  ) {
    this.firebaseService.addFirebaseEventListener(
      FirebaseEvents.FCM_INITIALIZED,
      async () => {
        try {
          await this.#init();
        } catch (err) {
          Monitoring.sentryCaptureException(
            err instanceof Error ? err : new Error(String(err)),
            Monitoring.SentryExceptionTypes.NOTIFICATIONS,
          );
        }
      },
    );
  }

  async #init() {
    const fcmToken = this.firebaseService.getFcmToken();

    if (!fcmToken) {
      throw new Error('Error while registering device: fcm token is missing');
    }

    this.#clientId = (
      (await this.storageService.loadUnencrypted<{ clientId?: string }>(
        NOTIFICATIONS_CLIENT_ID_STORAGE_KEY,
      )) ?? NOTIFICATIONS_CLIENT_ID_DEFAULT_STATE
    ).clientId;

    const { deviceArn } =
      (await incrementalPromiseResolve(
        () => this.#registerDevice(fcmToken),
        (res) => !res?.deviceArn, // we want to retry until we get a correct response
        0,
        5,
      )) ?? {};

    if (!deviceArn) {
      throw new Error('Error while registering device: device arn is missing');
    }

    if (this.#clientId !== deviceArn) {
      this.#clientId = deviceArn;

      await this.storageService.saveUnencrypted(
        NOTIFICATIONS_CLIENT_ID_STORAGE_KEY,
        { clientId: deviceArn },
      );
    }

    // init individual notification services when device is registered
    await this.balanceNotificationService.init(deviceArn);
    await this.newsNotificationService.init(deviceArn);
  }

  async #registerDevice(fcmToken: string) {
    return sendRequest<RegisterDeviceResponse>({
      path: 'v1/push/register',
      clientId: this.#clientId,
      payload: {
        deviceToken: fcmToken,
      },
    });
  }
}
