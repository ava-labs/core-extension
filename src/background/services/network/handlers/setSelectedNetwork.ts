import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';
import { NetworkService } from '../NetworkService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_SET_SELECTED,
  'success',
  [chainId: number]
>;

@injectable()
export class SetSelectedNetworkHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_SET_SELECTED as const;

  constructor(private networkService: NetworkService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [chainId] = request.params;

    const [, err] = await resolve(this.networkService.setNetwork(chainId));

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
