import {
  ChainListWithCaipIds,
  NetworkWithCaipId,
  ExtensionRequest,
  ExtensionRequestHandler,
} from '@core/types';
import { resolve } from '@core/common';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORKS_GET_STATE,
  {
    networks: NetworkWithCaipId[];
    activeNetwork?: NetworkWithCaipId;
    enabledNetworks: number[];
    customNetworks: number[];
  }
>;

@injectable()
export class GetNetworksStateHandler implements HandlerType {
  method = ExtensionRequest.NETWORKS_GET_STATE as const;

  constructor(private networkService: NetworkService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    const [networks, err] = await resolve<Promise<ChainListWithCaipIds>>(
      this.networkService.activeNetworks.promisify(),
    );

    if (err) {
      return {
        ...request,
        error: err.toString(),
      };
    }

    const networkList = Object.values<NetworkWithCaipId>(await networks)
      .map((network) => {
        const networkWithoutTokens = { ...network };
        delete networkWithoutTokens.tokens;
        return networkWithoutTokens;
      })
      .sort((a, b) => a.chainName.localeCompare(b.chainName));

    const filteredEnabledNetworks =
      await this.networkService.getEnabledNetworks();

    const customNetworks = Object.values(
      this.networkService.customNetworks,
    ).map((network) => network.chainId);

    const activeNetwork = Object.assign(
      {},
      this.networkService.uiActiveNetwork,
    );
    delete activeNetwork?.tokens;

    return {
      ...request,
      result: {
        networks: networkList,
        enabledNetworks: filteredEnabledNetworks,
        customNetworks,
        activeNetwork: this.networkService.uiActiveNetwork
          ? activeNetwork
          : undefined,
      },
    };
  };
}
