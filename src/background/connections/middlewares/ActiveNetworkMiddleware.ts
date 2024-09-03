import { NetworkService } from '@src/background/services/network/NetworkService';

import { JsonRpcRequest, JsonRpcResponse } from '../dAppConnection/models';

import { Middleware } from './models';

export function ActiveNetworkMiddleware(
  networkService: NetworkService
): Middleware<JsonRpcRequest, JsonRpcResponse> {
  return async (context, next) => {
    context.network = await networkService.getNetwork(
      context.request.params.scope
    );

    next();
  };
}
