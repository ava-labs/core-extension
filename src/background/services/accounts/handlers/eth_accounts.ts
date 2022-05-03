import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';

/**
 * This is called right away by dapps to see if its already connected
 *
 * @param data the rpc request
 * @returns an array of accounts the dapp has permissions for
 */
@injectable()
export class EthAccountsHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.ETH_ACCOUNTS];

  constructor(private accountsService: AccountsService) {}

  handleAuthenticated = async (request) => {
    if (!this.accountsService.activeAccount) {
      return {
        ...request,
        error: 'wallet locked, undefined or malformed',
      };
    }

    return {
      ...request,
      result: [this.accountsService.activeAccount.addressC],
    };
  };

  handleUnauthenticated = async (request) => {
    return {
      ...request,
      result: [],
    };
  };
}
