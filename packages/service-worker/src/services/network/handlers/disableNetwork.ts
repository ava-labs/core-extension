import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { resolve } from '@core/common';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.DISABLE_NETWORK,
  number[],
  number
>;
@injectable()
export class DisableNetworkHandler implements HandlerType {
  method = ExtensionRequest.DISABLE_NETWORK as const;

  constructor(private networkService: NetworkService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    const { params } = request;

    if (params === null || params === undefined)
      return {
        ...request,
        error: 'Chain ID not provided in params',
      };

    const [enabledNetworks, err] = await resolve(
      this.networkService.disableNetwork(params),
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
