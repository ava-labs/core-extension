import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { Middleware } from './models';
import { resolve } from '@src/utils/promiseResolver';
import { engine } from '@src/utils/jsonRpcEngine';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { DAppRequestHandler } from '../dAppConnection/DAppRequestHandler';
import { ethErrors } from 'eth-rpc-errors';
import {
  DAppProviderRequest,
  JsonRpcRequest,
  JsonRpcRequestParams,
  JsonRpcResponse,
} from '../dAppConnection/models';

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
    const handler = handlerMap.get(context.request.params.request.method);
    // Call correct handler method based on authentication status
    let promise: Promise<JsonRpcResponse<unknown>>;
    if (handler) {
      const params: JsonRpcRequestParams<DAppProviderRequest> = {
        ...context.request.params,
        request: {
          ...context.request.params.request,
          site: context.domainMetadata, // TODO: move it outside of the inner request payload as contextual data?
        },
      };
      promise = context.authenticated
        ? handler.handleAuthenticated(params)
        : handler.handleUnauthenticated(params);
    } else {
      const activeNetwork = await networkService.getNetwork(
        context.request.params.scope
      );

      if (!activeNetwork) {
        promise = Promise.reject(ethErrors.provider.disconnected());
      } else {
        promise = engine(activeNetwork).then((e) =>
          e.handle<unknown, unknown>({
            ...context.request.params.request,
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
