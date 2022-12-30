import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { WalletService } from '../../wallet/WalletService';
import { AccountsService } from '../AccountsService';

@injectable()
export class AvalancheGetAccountPubKeyHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_GET_ACCOUNT_PUB_KEY];

  constructor(
    private accountsService: AccountsService,
    private walletService: WalletService
  ) {
    super();
  }

  handleAuthenticated = async (request) => {
    const activeAccount = this.accountsService.activeAccount;

    if (!activeAccount) {
      return {
        ...request,
        error: ethErrors.rpc.internal('No active account.'),
      };
    }

    const publicKey = await this.walletService.getPublicKey(activeAccount);

    return {
      ...request,
      result: publicKey,
    };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };
}
