import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DappRequestHandler } from '@src/background/connections/models';
import { supportedNetworks } from '../../network/models';

/**
 * @link https://eips.ethereum.org/EIPS/eip-3085
 * @param data
 */
class WalletAddEthereumChainHandler implements DappRequestHandler {
  handleUnauthenticated = async (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };

  handleAuthenticated = async (request) => {
    const params = request.params;
    const supportedChainIds = Array.from(supportedNetworks.values()).map(
      (network) => network.chainId
    );
    const chainsRequestedIsSupported = params?.every((chainRequested) =>
      supportedChainIds.includes(chainRequested.chainId)
    );
    return {
      ...request,
      ...(chainsRequestedIsSupported
        ? { result: null }
        : {
            error: {
              code: 0,
              message:
                'One or more chains requested are not supported by this extension',
            } as any,
          }),
    };
  };
}

export const WalletAddChainRequest: [DAppProviderRequest, DappRequestHandler] =
  [DAppProviderRequest.WALLET_ADD_CHAIN, new WalletAddEthereumChainHandler()];
