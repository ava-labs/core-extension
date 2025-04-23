import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { AccountsEvents } from '../accounts/models';
import { ChainId } from '@avalabs/core-chains-sdk';
import { StorageService } from '../storage/StorageService';
import {
  NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION_DEFAULT_STATE,
  NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION_STORAGE_KEY,
} from './constants';
import {
  BalanceNotificationTypes,
  NotificationCategories,
  NotificationsBalanceChangesSubscriptionStorage,
  SubscriptionEvents,
} from './models';
import { FirebaseService } from '../firebase/FirebaseService';
import { MessagePayload } from 'firebase/messaging';
import { sendNotification } from './utils/sendNotification';
import { LockService } from '../lock/LockService';
import { debounce } from 'lodash';
import { sendRequest } from './utils/sendRequest';
import EventEmitter from 'events';
import { ExtensionConnectionEvent } from '@src/background/connections/models';

@singleton()
export class BalanceNotificationService {
  #clientId?: string;
  #eventEmitter = new EventEmitter();

  constructor(
    private accountService: AccountsService,
    private storageService: StorageService,
    private firebaseService: FirebaseService,
    private lockService: LockService,
  ) {}

  async init(clientId: string) {
    this.#clientId = clientId;
    this.firebaseService.addFcmMessageListener(
      NotificationCategories.BALANCE_CHANGES,
      this.#handleMessage,
    );

    this.accountService.addListener(
      AccountsEvents.ACCOUNTS_UPDATED,
      debounce(async () => {
        await this.subscribe(true);
      }, 1000),
    );

    // attempt to refresh the existing subscriptions
    await this.subscribe(true);

    this.#eventEmitter.emit(
      SubscriptionEvents.SUBSCRIPTIONS_CHANGED_EVENT,
      await this.getSubscriptions(),
    );
  }

  async getSubscriptions() {
    if (this.lockService.locked) {
      return {
        [BalanceNotificationTypes.BALANCE_CHANGES]: false,
      };
    }

    const state = await this.#getSubscriptionStateFromStorage();
    return { [BalanceNotificationTypes.BALANCE_CHANGES]: state.isSubscribed };
  }

  async #getSubscriptionStateFromStorage() {
    return (
      (await this.storageService.load<NotificationsBalanceChangesSubscriptionStorage>(
        NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION_STORAGE_KEY,
      )) ?? NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION_DEFAULT_STATE
    );
  }

  async #saveSubscriptionStateToStorage({
    isSubscribed,
    addresses,
    chainIds,
  }: NotificationsBalanceChangesSubscriptionStorage) {
    await this.storageService.save(
      NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION_STORAGE_KEY,
      { isSubscribed, addresses, chainIds },
    );

    this.#eventEmitter.emit(SubscriptionEvents.SUBSCRIPTIONS_CHANGED_EVENT, {
      [BalanceNotificationTypes.BALANCE_CHANGES]: isSubscribed,
    });
  }

  #handleMessage(payload: MessagePayload) {
    return sendNotification({
      payload,
      allowedType: NotificationCategories.BALANCE_CHANGES,
    });
  }

  async subscribe(shouldVerifyStorageState = false) {
    // device is not registered yet or wallet is locked
    if (!this.#clientId || this.lockService.locked) {
      return;
    }

    const state = await this.#getSubscriptionStateFromStorage();

    if (shouldVerifyStorageState && !state.isSubscribed) {
      return;
    }

    // fixed list of chain ids for now
    const chainIds = [
      ChainId.AVALANCHE_MAINNET_ID.toString(),
      ChainId.AVALANCHE_TESTNET_ID.toString(),
    ];

    // only evm addresses for now
    const addresses = this.accountService
      .getAccountList()
      .map((account) => account.addressC);

    // no need to compare chain ids as they are fixed
    if (
      !addresses.length ||
      JSON.stringify(state.addresses) === JSON.stringify(addresses)
    ) {
      return;
    }

    await sendRequest({
      path: 'v1/push/balance-changes/subscribe',
      clientId: this.#clientId,
      payload: {
        chainIds,
        addresses,
      },
    });

    await this.#saveSubscriptionStateToStorage({
      isSubscribed: true,
      addresses,
      chainIds,
    });
  }

  async unsubscribe() {
    const state = await this.#getSubscriptionStateFromStorage();

    if (!state.isSubscribed) {
      return;
    }

    await sendRequest({
      path: 'v1/push/balance-changes/unsubscribe',
      clientId: this.#clientId,
      payload: {},
    });

    await this.#saveSubscriptionStateToStorage({
      isSubscribed: false,
      addresses: [],
      chainIds: [],
    });
  }

  addListener(
    event: SubscriptionEvents,
    handler: (event: ExtensionConnectionEvent) => void,
  ): void {
    this.#eventEmitter.on(event, handler);
  }
}
