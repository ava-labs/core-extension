import { Network } from '@avalabs/chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_GET_SELECTED,
  Network | undefined
>;

@injectable()
export class GetSelectedNetworkHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_GET_SELECTED as const;

  constructor(private networkService: NetworkService) {}

  handle: HandlerType['handle'] = async (request) => {
    const result = await this.networkService.activeNetwork.promisify();
    return {
      ...request,
      result,
    };
  };
}
