import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';
import { resolve } from '@core/common';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.ENABLE_NETWORK,
  number[],
  number
>;

@injectable()
export class EnableNetworkHandler implements HandlerType {
  method = ExtensionRequest.ENABLE_NETWORK as const;

  constructor(private networkService: NetworkService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    const { params } = request;

    if (params === null || params === undefined) {
      return {
        ...request,
        error: 'Chain ID not provided in params',
      };
    }

    const [enabledNetworks, err] = await resolve(
      this.networkService.enableNetwork(params),
    );

    if (err) {
      return {
        ...request,
        error: (err as any).toString(),
      };
    }

    return {
      ...request,
      result: enabledNetworks,
    };
  };
}
