import { ethErrors } from 'eth-rpc-errors';
import { DAppProviderRequest } from '../dAppConnection/models';
import { Middleware } from './models';

export function RateLimitMiddleware(): Middleware {
  let lastConnectRequest: number;

  return async (context, next, error) => {
    const { method } = context.request.data;
    if (method === DAppProviderRequest.CONNECT_METHOD) {
      if (!!lastConnectRequest && Date.now() - lastConnectRequest < 300) {
        error(
          ethErrors.rpc.resourceUnavailable(
            `Request of type ${DAppProviderRequest.CONNECT_METHOD} already pending for origin ${context.domainMetadata?.domain}. Please wait.`
          )
        );
      } else {
        lastConnectRequest = Date.now();
        next();
      }
    } else {
      next();
    }
  };
}
