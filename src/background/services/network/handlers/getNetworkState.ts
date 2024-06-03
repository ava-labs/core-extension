import { Network, ChainList } from '@avalabs/chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORKS_GET_STATE,
  {
    networks: Network[];
    activeNetwork?: Network;
    favoriteNetworks: number[];
    customNetworks: number[];
  }
>;

@injectable()
export class GetNetworksStateHandler implements HandlerType {
  method = ExtensionRequest.NETWORKS_GET_STATE as const;

  constructor(private networkService: NetworkService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    const [networks, err] = await resolve<Promise<ChainList>>(
      this.networkService.activeNetworks.promisify()
    );

    if (err) {
      return {
        ...request,
        error: err.toString(),
      };
    }

    const networkList = Object.values<Network>(await networks)
      .map((network) => {
        const networkWithoutTokens = { ...network };
        delete networkWithoutTokens.tokens;
        return networkWithoutTokens;
      })
      .sort((a, b) => a.chainName.localeCompare(b.chainName));

    const activeNetwork = Object.assign({}, this.networkService.activeNetwork);
    delete activeNetwork?.tokens;

    const filteredFavoriteNetworks =
      await this.networkService.getFavoriteNetworks();
    const customNetworks = Object.values(
      this.networkService.customNetworks
    ).map((network) => network.chainId);

    return {
      ...request,
      result: {
        networks: networkList,
        activeNetwork,
        favoriteNetworks: filteredFavoriteNetworks,
        customNetworks,
      },
    };
  };
}
