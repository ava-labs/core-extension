import { singleton } from 'tsyringe';
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
import { sendRequest } from './utils/sendRequest';
import { RegisterDeviceResponse } from './models';

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

    const { deviceArn } =
      (await incrementalPromiseResolve(
        () => this.#registerDevice(),
        (res) => !res?.deviceArn, // we want to retry until we get a correct response
        0,
        5,
      )) ?? {};

    if (!deviceArn) {
      throw new Error('registration failed');
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

  async #registerDevice() {
    const fcmToken = this.firebaseService.getFcmToken();

    if (!fcmToken) {
      throw new Error('Error while registering device: fcm token is missing');
    }

    return sendRequest<RegisterDeviceResponse>({
      path: 'v1/push/register',
      clientId: this.#clientId,
      payload: {
        deviceToken: fcmToken,
      },
    });
  }
}
