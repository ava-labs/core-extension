import { Middleware } from './models';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { NetworkVMType } from '@avalabs/chains-sdk';

export function RPCCallsMiddleware(networkService: NetworkService): Middleware {
  return async (context, next, error) => {
    const network = await networkService.activeNetwork.promisify();
    const { method } = context.request.data;
    const declineMethodsPattern = /(^eth_|_watchAsset$)/;
    if (
      network &&
      network.vmName !== NetworkVMType.EVM &&
      declineMethodsPattern.test(method)
    ) {
      error(new Error(`Method not supported`));
    } else {
      next();
    }
  };
}
