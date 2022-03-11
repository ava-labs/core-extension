import { setNetwork } from '@avalabs/wallet-react-components';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';
import { supportedNetworksByChainID } from './../../network/models';

/**
 * @link https://eips.ethereum.org/EIPS/eip-3326
 * @param data
 */
class WalletSwitchEthereumChainHandler implements DappRequestHandler {
  handleUnauthenticated = async (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };

  handleAuthenticated = async (request) => {
    const params = request.params;

    const targetChainID = params?.[0]?.chainId;
    const targetNetwork = supportedNetworksByChainID.get(targetChainID);
    if (!targetNetwork) {
      return {
        ...request,
        error: {
          code: 0,
          message:
            'One or more chains requested are not supported by this extension',
        } as any,
      };
    }
    setNetwork(targetNetwork);
    return {
      ...request,
      result: null,
    };
  };
}

export const WalletSwitchEthereumChain: [
  DAppProviderRequest,
  DappRequestHandler
] = [
  DAppProviderRequest.WALLET_SWITCH_ETHEREUM_CHAIN,
  new WalletSwitchEthereumChainHandler(),
];
