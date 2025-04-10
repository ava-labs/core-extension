import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { AccountsEvents } from '../accounts/models';
import { AppCheckService } from '../appcheck/AppCheckService';
import { ChainId } from '@avalabs/core-chains-sdk';
import { StorageService } from '../storage/StorageService';
import {
  NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION_DEFAULT_STATE,
  NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION_STORAGE_KEY,
} from './constants';
import {
  BalanceNotificationTypes,
  NotificationsBalanceChangesSubscriptionStorage,
} from './models';

@singleton()
export class BalanceNotificationService {
  #clientId?: string;

  constructor(
    private appCheckService: AppCheckService,
    private accountService: AccountsService,
    private storageService: StorageService,
  ) {}

  async init(clientId: string) {
    this.#clientId = clientId;

    await this.subscribe();

    this.accountService.addListener(
      AccountsEvents.ACCOUNTS_UPDATED,
      async () => {
        await this.subscribe();
      },
    );
  }

  async getSubscription() {
    const state = await this.#getSubscriptionStateFromStorage();
    return { [BalanceNotificationTypes.BALANCE_CHANGES]: state.isSubscribed };
  }

  async #getSubscriptionStateFromStorage() {
    return (
      (await this.storageService.loadUnencrypted<NotificationsBalanceChangesSubscriptionStorage>(
        NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION_STORAGE_KEY,
      )) ?? NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION_DEFAULT_STATE
    );
  }

  async #saveSubscriptionStateToStorage({
    isSubscribed,
    addresses,
    chainIds,
  }: NotificationsBalanceChangesSubscriptionStorage) {
    await this.storageService.saveUnencrypted(
      NOTIFICATIONS_BALANCE_CHANGES_SUBSCRIPTION_STORAGE_KEY,
      { isSubscribed, addresses, chainIds },
    );
  }

  async subscribe() {
    const state = await this.#getSubscriptionStateFromStorage();

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

    const { token: appcheckToken } =
      (await this.appCheckService.getAppcheckToken()) ?? {};

    if (!appcheckToken) {
      throw new Error('appcheck token is missing');
    }

    const response = await fetch(
      `${process.env.NOTIFICATION_SENDER_SERVICE_URL}/v1/push/balance-changes/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Firebase-AppCheck': appcheckToken,
        },
        body: JSON.stringify({
          deviceArn: this.#clientId,
          chainIds,
          addresses,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

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

    const { token: appcheckToken } =
      (await this.appCheckService.getAppcheckToken()) ?? {};

    if (!appcheckToken) {
      throw new Error('appcheck token is missing');
    }

    const response = await fetch(
      `${process.env.NOTIFICATION_SENDER_SERVICE_URL}/v1/push/balance-changes/unsubscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Firebase-AppCheck': appcheckToken,
        },
        body: JSON.stringify({
          deviceArn: this.#clientId,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    await this.#saveSubscriptionStateToStorage({
      isSubscribed: false,
      addresses: [],
      chainIds: [],
    });
  }
}
