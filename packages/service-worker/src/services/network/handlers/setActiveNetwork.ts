import { injectable } from 'tsyringe';
import { runtime } from 'webextension-polyfill';

import { resolve } from '@core/common';
import { ExtensionRequest, ExtensionRequestHandler } from '@core/types';

import { NetworkService } from '../NetworkService';

export type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.NETWORK_SET_ACTIVE,
  void,
  [scope: string]
>;

@injectable()
export class SetActiveNetworkHandler implements HandlerType {
  method = ExtensionRequest.NETWORK_SET_ACTIVE as const;

  constructor(private networkService: NetworkService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [scope] = request.params;
    const [, err] = await resolve(
      this.networkService.setNetwork(runtime.id, scope),
    );

    if (err) {
      return {
        ...request,
        error: err.toString(),
      };
    }

    return {
      ...request,
      result: undefined,
    };
  };
}
