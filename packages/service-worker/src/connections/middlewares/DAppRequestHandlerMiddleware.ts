import {
  DAppRequestHandler,
  DAppProviderRequest,
  JsonRpcRequest,
  JsonRpcRequestParams,
  JsonRpcResponse,
  DEFERRED_RESPONSE,
} from '@core/types';
import { engine, resolve } from '@core/common';
import { ethErrors } from 'eth-rpc-errors';

import { ModuleManager } from '../../vmModules/ModuleManager';
import { Middleware } from './models';

export function DAppRequestHandlerMiddleware(
  handlers: DAppRequestHandler[],
  moduleManager: ModuleManager,
): Middleware<JsonRpcRequest, JsonRpcResponse<unknown>> {
  const handlerMap = handlers.reduce((acc, handler) => {
    for (const method of handler.methods) {
      acc.set(method, handler);
    }
    return acc;
  }, new Map<string, DAppRequestHandler>());

  return async (context, next) => {
    const method = context.request.params.request.method;
    const handler = handlerMap.get(method);
    // Call correct handler method based on authentication status
    let promise: Promise<JsonRpcResponse<unknown>>;

    if (!context.domainMetadata) {
      context.response = {
        error: ethErrors.rpc.invalidRequest('Unknown request domain'),
      };

      return next();
    }

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
      const scope = context.network?.caipId || context.request.params.scope;
      const [module] = await resolve(moduleManager.loadModule(scope, method));

      if (!context.network) {
        promise = Promise.reject(ethErrors.provider.disconnected());
      } else if (!module) {
        promise = engine(context.network).then((e) =>
          e.handle<unknown, unknown>({
            ...context.request.params.request,
            id: crypto.randomUUID(),

            jsonrpc: '2.0',
          }),
        );
      } else if (
        !context.authenticated &&
        !moduleManager.isNonRestrictedMethod(module, method)
      ) {
        promise = Promise.reject(ethErrors.provider.unauthorized());
      } else {
        promise = module.onRpcRequest(
          {
            chainId: context.network.caipId,
            dappInfo: {
              icon: context.domainMetadata.icon ?? '',
              name: context.domainMetadata.name ?? '',
              url: context.domainMetadata.url ?? '',
            },
            requestId: context.request.id,
            sessionId: context.request.params.sessionId,
            method: context.request.params.request.method,
            params: context.request.params.request.params,
            // Do not pass context from unknown sources.
            // This field is for our internal use only (only used with extension's direct connection)
            context: {
              currentAddress: context.currentAddress,
              currentEvmAddress: context.currentEvmAddress,
              xpubXP: context.xpubXP,
            },
          },
          context.network,
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
