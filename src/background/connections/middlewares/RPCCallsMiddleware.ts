import { Middleware } from './models';
import { NetworkVM } from '@src/background/services/network/models';
import { NetworkService } from '@src/background/services/network/NetworkService';

export function RPCCallsMiddleware(networkService: NetworkService): Middleware {
  return async (context, next, error) => {
    const network = networkService.activeNetwork;
    const { method } = context.request.data;
    const declineMethodsPattern = /(^eth_|_watchAsset$)/;
    if (
      network &&
      network.vm !== NetworkVM.EVM &&
      declineMethodsPattern.test(method)
    ) {
      error(new Error(`Method not supported`));
    } else {
      next();
    }
  };
}
