import { DAppProviderRequest, DAppRequestHandler } from '@core/types';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';

/**
 * This is called right away by dapps to see if its already connected
 *
 * @param data the rpc request
 * @returns an array of accounts the dapp has permissions for
 */
@injectable()
export class EthAccountsHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.ETH_ACCOUNTS];

  constructor(private accountsService: AccountsService) {
    super();
  }

  handleAuthenticated = async ({ request }) => {
    const activeAccount = await this.accountsService.getActiveAccount();
    if (!activeAccount) {
      return {
        ...request,
        error: 'wallet locked, undefined or malformed',
      };
    }

    return {
      ...request,
      result: [activeAccount.addressC],
    };
  };

  handleUnauthenticated = async ({ request }) => {
    return {
      ...request,
      result: [],
    };
  };
}
