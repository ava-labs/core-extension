import { DAppRequestHandler, DAppProviderRequest } from '@core/types';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { WalletService } from '../../wallet/WalletService';
@injectable()
export class AvalancheGetAccountPubKeyHandler extends DAppRequestHandler {
  methods = [
    DAppProviderRequest.AVALANCHE_GET_ACCOUNT_PUB_KEY,
    DAppProviderRequest.WALLET_GET_PUBKEY,
  ];

  constructor(private walletService: WalletService) {
    super();
  }

  handleAuthenticated = async ({ request }) => {
    try {
      const publicKey = await this.walletService.getActiveAccountPublicKey();

      return {
        ...request,
        result: publicKey,
      };
    } catch (err: any) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: err instanceof Error ? err.message : err.toString(),
        }),
      };
    }
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };
}
