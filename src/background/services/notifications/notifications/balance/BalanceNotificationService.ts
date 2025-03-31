import { singleton } from 'tsyringe';
import { AccountsService } from '../../../accounts/AccountsService';
import { AccountsEvents } from '../../../accounts/models';
import { AppCheckService } from '../../../appcheck/AppCheckService';
import { ChainId } from '@avalabs/core-chains-sdk';

@singleton()
export class BalanceNotificationService {
  #clientId?: string;

  constructor(
    private appCheckService: AppCheckService,
    private accountService: AccountsService,
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

  async subscribe() {
    const evmAddresses = this.accountService
      .getAccountList()
      .map((account) => account.addressC);

    if (!evmAddresses) {
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
          chainIds: [
            ChainId.AVALANCHE_MAINNET_ID.toString(),
            ChainId.AVALANCHE_TESTNET_ID.toString(),
          ],
          addresses: evmAddresses,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }

  async unsubscribe() {
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
  }
}
