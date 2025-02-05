import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { injectable } from 'tsyringe';
import type { AccountsService } from '../AccountsService';
import type { Account } from '../models';
import { AccountType } from '../models';
import type { SecretsService } from '../../secrets/SecretsService';

@injectable()
export class AvalancheGetAccountsHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_GET_ACCOUNTS];

  constructor(
    private accountsService: AccountsService,
    private secretsService: SecretsService,
  ) {
    super();
  }

  handleAuthenticated = async ({ request }) => {
    const accounts = this.accountsService.getAccountList();
    const activeAccount = this.accountsService.activeAccount;
    const wallets = await this.secretsService.getPrimaryWalletsDetails();

    const getWalletData = (acc: Account) => {
      if (acc.type === AccountType.PRIMARY) {
        const walletData = wallets.find((wallet) => {
          return wallet.id === acc.walletId;
        });
        return {
          name: walletData?.name,
          type: walletData?.type,
        };
      }
      return null;
    };

    return {
      ...request,
      result: accounts.map((acc) => {
        const active = activeAccount?.id === acc.id;
        const walletData = getWalletData(acc);

        return {
          ...acc,
          walletType: walletData?.type,
          walletName: walletData?.name,
          active,
        };
      }),
    };
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };
}
