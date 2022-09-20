import { Network } from '@avalabs/chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_AVALANCHE_GET,
  { avalancheNetwork: Network }
>;

@injectable()
export class GetAvalancheNetworkHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_AVALANCHE_GET as const;

  constructor(private networkService: NetworkService) {}

  handle: HandlerType['handle'] = async (request) => {
    const avalancheNetwork = await this.networkService.getAvalancheNetwork();

    return {
      ...request,
      result: { avalancheNetwork },
    };
  };
}
