import { Middleware } from './models';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { NetworkVMType } from '@avalabs/chains-sdk';
import { JsonRpcRequest, JsonRpcResponse } from '../dAppConnection/models';

export function RPCCallsMiddleware(
  networkService: NetworkService
): Middleware<JsonRpcRequest, JsonRpcResponse> {
  return async (context, next, error) => {
    const network = await networkService.getNetwork(
      context.request.params.scope
    );
    const { method } = context.request;
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
