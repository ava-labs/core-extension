import { NetworkService } from '@src/background/services/network/NetworkService';

import { JsonRpcRequest, JsonRpcResponse } from '../dAppConnection/models';

import { Middleware } from './models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
} from '../models';
import { ethErrors } from 'eth-rpc-errors';

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

      if (
        Boolean(network.isTestnet) !==
        Boolean(networkService.uiActiveNetwork?.isTestnet)
      ) {
        error(
          ethErrors.rpc.invalidParams({
            message: 'Provided ChainID is in a different environment',
            data: { chainId: network.chainId },
          })
        );
      }

      context.network = network;
    }

    next();
  };
}
