import { NetworkService } from '@src/background/services/network/NetworkService';

import { JsonRpcRequest, JsonRpcResponse } from '../dAppConnection/models';

import { Middleware } from './models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
} from '../models';
import { RpcMethod } from '@avalabs/vm-module-types';
import getTargetNetworkForTx from '@src/background/services/wallet/handlers/eth_sendTransaction/utils/getTargetNetworkForTx';

export function ActiveNetworkMiddleware(
  networkService: NetworkService
): Middleware<
  JsonRpcRequest | ExtensionConnectionMessage,
  JsonRpcResponse | ExtensionConnectionMessageResponse
> {
  return async (context, next, error) => {
    const {
      scope,
      request: { method, params },
    } = context.request.params;

    if (!scope) {
      next();
      return;
    }

    const isEthSendTx = method === RpcMethod.ETH_SEND_TRANSACTION;
    const hasParams = Array.isArray(params) && typeof params[0] === 'object';

    let network;

    if (isEthSendTx && hasParams) {
      try {
        network = await getTargetNetworkForTx(params[0], networkService, scope);
      } catch (err: any) {
        error(err);
        return;
      }
    } else {
      network = await networkService.getNetwork(scope);
    }

    if (!network) {
      error(new Error(`Unrecognized network: ${scope}`));
      return;
    }

    context.network = network;

    next();
  };
}