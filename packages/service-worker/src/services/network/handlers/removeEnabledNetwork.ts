import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { resolve } from '@core/common';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_REMOVE_ENABLED_NETWORK,
  number[],
  number
>;
@injectable()
export class RemoveEnabledNetworkHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_REMOVE_ENABLED_NETWORK as const;

  constructor(private networkService: NetworkService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    const { params } = request;

    if (params === null || params === undefined)
      return {
        ...request,
        error: 'Chain ID not provided in params',
      };

    const [enabledNetworks, err] = await resolve(
      this.networkService.removeEnabledNetwork(params),
    );

    if (err) {
      return {
        ...request,
        error: err.toString(),
      };
    }

    return {
      ...request,
      result: enabledNetworks,
    };
  };
}
