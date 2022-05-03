import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { supportedNetworks } from '../models';

/**
 * @link https://eips.ethereum.org/EIPS/eip-3085
 * @param data
 */
@injectable()
export class WalletAddEthereumChainHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.WALLET_ADD_CHAIN];
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
