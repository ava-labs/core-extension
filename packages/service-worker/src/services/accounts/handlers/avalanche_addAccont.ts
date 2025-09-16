import { DAppRequestHandler, DAppProviderRequest } from '@core/types';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';
import { isPrimaryAccount } from '@core/common';

@injectable()
export class AvalancheAddAccountHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_ADD_ACCOUNT];

  constructor(private accountsService: AccountsService) {
    super();
  }

  handleAuthenticated = async ({ request }) => {
    const activeAccount = await this.accountsService.getActiveAccount();

    if (!activeAccount) {
      throw new Error('No active account');
    }

    try {
      const newAccountWalletId = isPrimaryAccount(activeAccount)
        ? activeAccount.walletId
        : undefined;

      if (!newAccountWalletId) {
        throw new Error('The current account is not a primary account');
      }
      const id = await this.accountsService.addPrimaryAccount({
        walletId: newAccountWalletId,
      });
      return {
        ...request,
        result: id,
      };
    } catch (e: any) {
      return {
        ...request,
        error: e.toString(),
      };
    }
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };
}
