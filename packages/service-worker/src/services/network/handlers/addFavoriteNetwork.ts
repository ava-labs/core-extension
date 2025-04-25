import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { resolve } from '@core/utils';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

export type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_ADD_FAVORITE_NETWORK,
  number[],
  [number]
>;

@injectable()
export class AddFavoriteNetworkHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_ADD_FAVORITE_NETWORK as const;

  constructor(private networkService: NetworkService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    const { params } = request;
    const [network] = params || [];

    const [favoriteNetworks, err] = await resolve(
      this.networkService.addFavoriteNetwork(network),
    );

    if (err) {
      return {
        ...request,
        error: (err as any).toString(),
      };
    }

    return {
      ...request,
      result: favoriteNetworks,
    };
  };
}
