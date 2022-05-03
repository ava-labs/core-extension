import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';

@injectable()
export class AvalancheGetAccountsHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_GET_ACCOUNTS];

  constructor(private accountsService: AccountsService) {}

  handleAuthenticated = async (request) => {
    const accounts = this.accountsService.getAccounts();

    return {
      ...request,
      result: accounts,
    };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };
}
