import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

/**
 * @link https://eips.ethereum.org/EIPS/eip-3085
 * @param data
 */
@injectable()
export class WalletAddEthereumChainHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.WALLET_ADD_CHAIN];
  constructor(private networkService: NetworkService) {}
  handleUnauthenticated = async (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };

  handleAuthenticated = async (request) => {
    const params = request.params;
    const chains = await this.networkService.activeNetworks.promisify();
    const supportedChainIds = Object.keys(chains);
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
