import { singleton } from 'tsyringe';
import { AppCheckService } from '../appcheck/AppCheckService';
import { OnStorageReady } from '@src/background/runtime/lifecycleCallbacks';
import { StorageService } from '../storage/StorageService';
import { DEFAULT_STATE, STORAGE_KEY } from './constants';
import { NotificationsState } from './models';
import { FirebaseService } from '../firebase/FirebaseService';
import { BalanceNotificationService } from './notifications/balance/BalanceNotificationService';

@singleton()
export class NotificationsService implements OnStorageReady {
  #state = DEFAULT_STATE;

  constructor(
    private storageService: StorageService,
    private firebaseService: FirebaseService,
    private appCheckService: AppCheckService,
    private balanceNotificationService: BalanceNotificationService,
  ) {}

  async onStorageReady() {
    this.#state =
      (await this.storageService.load<NotificationsState>(STORAGE_KEY)) ??
      DEFAULT_STATE;

    const clientId = await this.#registerDevice();

    if (!clientId) {
      throw new Error('registration failed');
    }

    this.#state = { clientId };
    await this.storageService.save(STORAGE_KEY, this.#state);

    await this.balanceNotificationService.init(clientId);
  }

  // TODO: improve and move logic to SDK
  async #registerDevice() {
    const fcmToken = this.firebaseService.getFcmToken();
    const { token: appcheckToken } =
      (await this.appCheckService.getAppcheckToken()) ?? {};

    if (!fcmToken) {
      throw new Error('appcheck token is missing');
    }

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
          ...(this.#state.clientId && { deviceArn: this.#state.clientId }),
        }),
      },
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const { deviceArn } = ((await response.json()) ?? {}) as {
      deviceArn?: string;
    };

    return deviceArn;
  }
}
