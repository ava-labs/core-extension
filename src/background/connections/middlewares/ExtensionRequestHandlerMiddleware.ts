import type { Context, Middleware } from './models';
import { resolve } from '@src/utils/promiseResolver';
import type {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '../models';
import * as Sentry from '@sentry/browser';
import type { ModuleManager } from '@src/background/vmModules/ModuleManager';
import type { Module } from '@avalabs/vm-module-types';
import { runtime } from 'webextension-polyfill';

export function ExtensionRequestHandlerMiddleware(
  handlers: ExtensionRequestHandler<any, any>[],
  moduleManager: ModuleManager,
): Middleware<
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse<any, any>
> {
  const handlerMap = handlers.reduce((acc, handler) => {
    if (acc.get(handler.method))
      throw new Error(`Method already handled: ${handler.method}`);
    acc.set(handler.method, handler);
    return acc;
  }, new Map<string, ExtensionRequestHandler<any, any>>());

  return async (context, next, onError) => {
    const method = context.request.params.request.method;
    const handler = handlerMap.get(method);
    const [module] = handler
      ? [null]
      : await resolve(
          moduleManager.loadModule(
            context.request.params.scope,
            context.request.params.request.method,
          ),
        );

    if (!handler && !module) {
      onError(
        new Error(
          'Unable to handle request: ' + context.request.params.request.method,
        ),
      );
      return;
    }

    const sentryTracker = Sentry.startTransaction({
      name: `Handler: ${method}`,
    });
    const promise = handleRequest(handler ?? module, context);

    context.response = await resolve(promise).then(([result, error]) => {
      if (error) {
        console.error(error);
        sentryTracker.setStatus('intertal_error');
      } else {
        sentryTracker.setStatus('ok');
      }

      return {
        ...(error ? error : result),
      };
    });

    sentryTracker.finish();
    next();
  };
}

const handleRequest = async (
  handlerOrModule: ExtensionRequestHandler<any, any> | Module,
  context: Context<ExtensionConnectionMessage, any>,
) => {
  if ('handle' in handlerOrModule) {
    return handlerOrModule.handle({
      ...context.request.params,
    });
  }

  if (!context.network) {
    throw new Error('Unrecognized network: ' + context.request.params.scope);
  }

  const response = await handlerOrModule.onRpcRequest(
    {
      chainId: context.network.caipId,
      dappInfo: {
        icon: runtime.getManifest().icons?.['192'] ?? '',
        name: runtime.getManifest().name,
        url: runtime.getURL(''),
      },
      requestId: context.request.id,
      sessionId: context.request.params.sessionId,
      method: context.request.params.request.method,
      params: context.request.params.request.params,
      context: context.request.context,
    },
    context.network,
  );

  return {
    ...context.request.params.request,
    ...response,
  };
};
