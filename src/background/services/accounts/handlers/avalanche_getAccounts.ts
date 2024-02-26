import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';
import { Account, AccountType } from '../models';
import { WalletService } from '../../wallet/WalletService';

@injectable()
export class AvalancheGetAccountsHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_GET_ACCOUNTS];

  constructor(
    private accountsService: AccountsService,
    private walletService: WalletService
  ) {
    super();
  }

  handleAuthenticated = async (request) => {
    const accounts = this.accountsService.getAccountList();
    const activeAccount = this.accountsService.activeAccount;

    const getWalletType = (acc: Account) => {
      if (acc.type === AccountType.PRIMARY) {
        return this.walletService.wallets.find(
          (wallet) => wallet.id === acc.walletId
        )?.type;
      }
    };

    return {
      ...request,
      result: accounts.map((acc) => {
        const active = activeAccount?.id === acc.id;
        const walletType = getWalletType(acc);

        return {
          ...acc,
          walletType,
          active,
        };
      }),
    };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };
}
