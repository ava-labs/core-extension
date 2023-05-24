import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { Middleware } from './models';
import { resolve } from '@src/utils/promiseResolver';
import { engine } from '@src/utils/jsonRpcEngine';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { DAppRequestHandler } from '../dAppConnection/DAppRequestHandler';
import { ethErrors } from 'eth-rpc-errors';
import { JsonRpcRequest, JsonRpcResponse } from '../dAppConnection/models';

export function DAppRequestHandlerMiddleware(
  handlers: DAppRequestHandler[],
  networkService: NetworkService
): Middleware<JsonRpcRequest, JsonRpcResponse<unknown>> {
  const handlerMap = handlers.reduce((acc, handler) => {
    for (const method of handler.methods) {
      acc.set(method, handler);
    }
    return acc;
  }, new Map<string, DAppRequestHandler>());

  return async (context, next) => {
    const handler = handlerMap.get(context.request.method);
    // Call correct handler method based on authentication status
    let promise: Promise<JsonRpcResponse<unknown>>;
    if (handler) {
      const params = {
        ...context.request,
        site: context.domainMetadata,
      };
      promise = context.authenticated
        ? handler.handleAuthenticated(params)
        : handler.handleUnauthenticated(params);
    } else {
      const activeNetwork = networkService.activeNetwork;

      if (!activeNetwork) {
        promise = Promise.reject(ethErrors.provider.disconnected());
      } else {
        promise = engine(activeNetwork).then((e) =>
          e.handle<unknown, unknown>({
            ...context.request,
            id: crypto.randomUUID(),
            jsonrpc: '2.0',
          })
        );
      }
    }

    context.response = await resolve(promise).then(([result, error]) => {
      if (result && result === DEFERRED_RESPONSE) {
        return DEFERRED_RESPONSE;
      }

      return {
        ...context.request,
        ...(error ? { error } : result),
      };
    });

    next();
  };
}
