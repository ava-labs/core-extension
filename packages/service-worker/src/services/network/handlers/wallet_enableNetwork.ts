import {
  DAppProviderRequest,
  DAppRequestHandler,
  JsonRpcRequestParams,
} from '@core/types';
import { resolve } from '@core/common';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

// Chain IDs of the enabled networks
type WalletEnableNetworkResponse = number[];

type Params = { chainId: number };

@injectable()
export class WalletEnableNetworkHandler extends DAppRequestHandler<
  Params,
  WalletEnableNetworkResponse
> {
  methods = [DAppProviderRequest.WALLET_ENABLE_NETWORK];

  constructor(private networkService: NetworkService) {
    super();
  }

  handleAuthenticated = async ({
    request,
  }: JsonRpcRequestParams<DAppProviderRequest, Params>) => {
    const chainId = request.params?.chainId;

    if (!chainId) {
      return {
        ...request,
        error: 'Missing parameter: chainId',
      };
    }

    const network = await this.networkService.getNetwork(chainId);

    if (!network) {
      return {
        ...request,
        error: `Unknown chain id: ${chainId}`,
      };
    }

    const [enabledNetworkIds, err] = await resolve(
      this.networkService.enableNetwork(chainId),
    );

    if (err) {
      return {
        ...request,
        error: (err as any).toString(),
      };
    }

    return {
      ...request,
      result: enabledNetworkIds,
    };
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: 'Not authorized',
    };
  };
}
