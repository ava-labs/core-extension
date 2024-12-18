import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';
import { resolve } from '@src/utils/promiseResolver';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_REMOVE_FAVORITE_NETWORK,
  number[],
  [number]
>;

@injectable()
export class RemoveFavoriteNetworkHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_REMOVE_FAVORITE_NETWORK as const;

  constructor(private networkService: NetworkService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    const [chainId] = request.params;

    const [favoriteNetworks, err] = await resolve(
      this.networkService.removeFavoriteNetwork(chainId),
    );

    if (err) {
      return {
        ...request,
        error: err.toString(),
      };
    }

    return {
      ...request,
      result: favoriteNetworks,
    };
  };
}
