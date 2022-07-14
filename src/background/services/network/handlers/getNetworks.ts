import { Network } from '@avalabs/chains-sdk';
import { resolve } from '@avalabs/utils-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_GET_NETWORKS,
  Network[]
>;

@injectable()
export class GetNetworksHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_GET_NETWORKS as const;

  constructor(private networkService: NetworkService) {}
  handle: HandlerType['handle'] = async (request) => {
    const [networks, err] = await resolve(
      this.networkService.activeNetworks.promisify()
    );

    if (err) {
      return {
        ...request,
        error: (err as any).toString(),
      };
    }

    const result = Object.values(networks || {});

    return {
      ...request,
      result,
    };
  };
}
