import {
  DAppRequestHandler,
  DAppProviderRequest,
  JsonRpcRequestParams,
} from '@core/types';
import { injectable } from 'tsyringe';
import { AccountsService } from '../AccountsService';
import { isPrimaryAccount } from '@core/common';

type Params = [walletId?: string];

// Avalanche add account handler
// This handler is similar to the AddAccountHandler, but it is used for dapp adding accounts to primary accounts
@injectable()
export class AvalancheAddAccountHandler extends DAppRequestHandler<
  Params,
  null
> {
  methods = [DAppProviderRequest.AVALANCHE_ADD_ACCOUNT];

  constructor(private accountsService: AccountsService) {
    super();
  }

  handleAuthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, Params>,
  ) => {
    const { request } = rpcCall;

    try {
      const [walletId] = request.params || [];

      const activeAccount = await this.accountsService.getActiveAccount();

      const newAccountWalletId = walletId
        ? walletId
        : isPrimaryAccount(activeAccount)
          ? activeAccount.walletId
          : undefined;

      if (!newAccountWalletId) {
        throw new Error('There is no wallet id for the new primary account');
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
