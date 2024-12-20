import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { ethErrors } from 'eth-rpc-errors';
import { injectable } from 'tsyringe';
import { WalletService } from '../../wallet/WalletService';

// TODO: call this to get the pubkey for hvm
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
    console.log('handleAuthenticated:');
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
    return this.handleAuthenticated({ request });
  };
}
