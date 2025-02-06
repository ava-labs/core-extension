import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_REMOVE_CUSTOM,
  'success',
  [number]
>;
@injectable()
export class RemoveCustomNetworkHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_REMOVE_CUSTOM as const;

  constructor(private networkService: NetworkService) {}
  handle: HandlerType['handle'] = async ({ request }) => {
    const { params } = request;
    const chainId: number = params?.[0];

    if (!chainId)
      return {
        ...request,
        error: 'Chain ID not provided in params',
      };

    const [, err] = await resolve(
      this.networkService.removeCustomNetwork(chainId),
    );

    if (err) {
      return {
        ...request,
        error: err.toString(),
      };
    }

    return {
      ...request,
      result: 'success',
    };
  };
}
