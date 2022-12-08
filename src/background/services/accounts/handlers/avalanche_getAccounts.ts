import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';

@injectable()
export class AvalancheGetAccountsHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_GET_ACCOUNTS];

  constructor(private accountsService: AccountsService) {
    super();
  }

  handleAuthenticated = async (request) => {
    const accounts = this.accountsService.getAccountList();
    const activeAccount = this.accountsService.activeAccount;

    return {
      ...request,
      result: accounts.map((acc) => {
        const active = activeAccount?.id === acc.id;

        return {
          ...acc,
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
