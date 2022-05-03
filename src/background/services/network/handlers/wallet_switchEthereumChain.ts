import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

/**
 * @link https://eips.ethereum.org/EIPS/eip-3326
 * @param data
 */
@injectable()
export class WalletSwitchEthereumChainHandler implements DAppRequestHandler {
  methods = [DAppProviderRequest.WALLET_SWITCH_ETHEREUM_CHAIN];

  constructor(private networkService: NetworkService) {}

  handleUnauthenticated = async (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };

  handleAuthenticated = async (request) => {
    const params = request.params;

    const targetChainID = params?.[0]?.chainId;
    const [, error] = await resolve(
      this.networkService.setNetwork(targetChainID)
    );

    if (error) {
      return {
        ...request,
        error: {
          code: 0,
          message:
            'One or more chains requested are not supported by this extension',
        } as any,
      };
    }

    return {
      ...request,
      result: null,
    };
  };
}
