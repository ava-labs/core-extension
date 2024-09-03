import { NetworkService } from '@src/background/services/network/NetworkService';

import { JsonRpcRequest, JsonRpcResponse } from '../dAppConnection/models';

import { Middleware } from './models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
} from '../models';

export function ActiveNetworkMiddleware(
  networkService: NetworkService
): Middleware<
  JsonRpcRequest | ExtensionConnectionMessage,
  JsonRpcResponse | ExtensionConnectionMessageResponse
> {
  return async (context, next, error) => {
    const { scope } = context.request.params;

    if (scope) {
      const network = await networkService.getNetwork(
        context.request.params.scope
      );

      if (!network) {
        error(new Error(`Unrecognized network: ${scope}`));
        return;
      }

      context.network = network;
    }

    next();
  };
}
