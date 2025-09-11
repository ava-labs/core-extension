import { NetworkService } from '../../services/network/NetworkService';

import {
  JsonRpcRequest,
  JsonRpcResponse,
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  NetworkWithCaipId,
} from '@core/types';

import { Middleware } from './models';

import { RpcMethod } from '@avalabs/vm-module-types';
import getTargetNetworkForTx from '../../services/wallet/utils/getTargetNetworkForTx';

const isNetworkNeeded = (method: string) => {
  return (
    !method.startsWith('wallet_') && method !== 'avalanche_getProviderState'
  );
};

export function ActiveNetworkMiddleware(
  networkService: NetworkService,
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

    if (!isNetworkNeeded(method)) {
      next();
      return;
    }

    const isEthSendTx = method === RpcMethod.ETH_SEND_TRANSACTION;
    const hasParams = Array.isArray(params) && typeof params[0] === 'object';

    let network: NetworkWithCaipId | undefined;

    if (isEthSendTx && hasParams) {
      try {
        network = await getTargetNetworkForTx(params[0], networkService, scope);
      } catch (err: any) {
        error(err);
        return;
      }
    } else if (
      // These requests are still coming through the EVM injected provider
      // with scope set to "eip155:43114" / "eip155:43113". Since those are
      // valid CAIP-2 identifiers, we can't force-map them to the `avax:...`
      // namespace directly in the ChainAgnosticProvider (like we do for Bitcoin
      // or Solana, for example).
      //
      // The perfect solution would be if Core Web used the ChainAgnosticProvider
      // for non-EVM requests, or at least supplied the fake X/P chain id -- then
      // those would be recognized and remapped by the ChainAgnosticProvider, and
      // this clause would not be required. For now though, this works.
      method === RpcMethod.AVALANCHE_SEND_TRANSACTION ||
      method === RpcMethod.AVALANCHE_SIGN_TRANSACTION ||
      method === RpcMethod.AVALANCHE_SIGN_MESSAGE
    ) {
      // We actually DO get the scope in some cases, like when signing a message.
      // So let's try to get it from the request payload and if not possible,
      // look at the request params.
      if (scope.startsWith('avax:')) {
        network = await networkService.getNetwork(scope);
        // If we know the chain alias, we can get the appropriate network
      } else if (
        params &&
        typeof params === 'object' &&
        'chainAlias' in params
      ) {
        const alias = params.chainAlias as 'C' | 'P' | 'X';

        if (alias === 'C') {
          network = await networkService.getCoreEthNetwork();
        } else {
          network = await networkService.getAvalancheNetworkXP();
        }
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
