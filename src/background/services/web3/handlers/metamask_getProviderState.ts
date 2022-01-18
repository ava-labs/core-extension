import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { network$ } from '@avalabs/wallet-react-components';
import { getAccountsFromWallet } from '../../wallet/utils/getAccountsFromWallet';
import { wallet$ } from '@avalabs/wallet-react-components';

class MetamaskGetProviderState implements DappRequestHandler {
  handleUnauthenticated = async (request) => {
    const network = await firstValueFrom(network$);

    return {
      ...request,
      result: {
        isUnlocked: false,
        networkVersion: 'avax',
        accounts: [],
        chainId: network?.chainId,
      },
    };
  };

  handleAuthenticated = async (request) => {
    const network = await firstValueFrom(network$);
    const walletResult = await firstValueFrom(wallet$);

    return {
      ...request,
      result: {
        isUnlocked: true,
        chainId: network?.chainId,
        networkVersion: 'avax',
        accounts: walletResult ? getAccountsFromWallet(walletResult) : [],
      },
    };
  };
}

export const InitDappStateRequest: [DAppProviderRequest, DappRequestHandler] = [
  DAppProviderRequest.INIT_DAPP_STATE,
  new MetamaskGetProviderState(),
];
