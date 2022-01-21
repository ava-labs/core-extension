import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { getAccountsFromWallet } from '../../wallet/utils/getAccountsFromWallet';
import { wallet$ } from '@avalabs/wallet-react-components';

/**
 * This is called right away by dapps to see if its already connected
 *
 * @param data the rpc request
 * @returns an array of accounts the dapp has permissions for
 */
class EthAccountsHandler implements DappRequestHandler {
  handleAuthenticated = async (request) => {
    const walletResult = await firstValueFrom(wallet$);

    if (!walletResult) {
      return {
        ...request,
        error: 'wallet locked, undefined or malformed',
      };
    }

    return {
      ...request,
      result: getAccountsFromWallet(walletResult),
    };
  };

  handleUnauthenticated = async (request) => {
    return {
      ...request,
      result: [],
    };
  };
}

export const EthAccountsRequest: [DAppProviderRequest, DappRequestHandler] = [
  DAppProviderRequest.ETH_ACCOUNTS,
  new EthAccountsHandler(),
];
