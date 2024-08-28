import { Context, Middleware } from './models';
import { resolve } from '@src/utils/promiseResolver';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '../models';
import * as Sentry from '@sentry/browser';
import ModuleManager from '@src/background/vmModules/ModuleManager';
import { Module } from '@avalabs/vm-module-types';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { runtime } from 'webextension-polyfill';

export function ExtensionRequestHandlerMiddleware(
  handlers: ExtensionRequestHandler<any, any>[],
  networkService: NetworkService
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
    const handlerOrModule =
      handlerMap.get(method) ??
      (await ModuleManager.loadModule(
        context.request.params.scope,
        context.request.params.request.method
      ));

    if (!handlerOrModule) {
      onError(
        new Error(
          'Unable to handle request: ' + context.request.params.request.method
        )
      );
      return;
    }

    const sentryTracker = Sentry.startTransaction({
      name: `Handler: ${method}`,
    });
    const promise = handleRequest(handlerOrModule, context, networkService);

    context.response = await resolve(promise).then(([result, error]) => {
      error && console.error(error);
      error
        ? sentryTracker.setStatus('intertal_error')
        : sentryTracker.setStatus('ok');

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
  networkService: NetworkService
) => {
  if ('handle' in handlerOrModule) {
    return handlerOrModule.handle({
      ...context.request.params,
    });
  }

  const { scope } = context.request.params;
  const network = await networkService.getNetwork(scope);

  if (!network) {
    throw new Error('Unrecognized network: ' + scope);
  }

  const response = await handlerOrModule.onRpcRequest(
    {
      chainId: network.caipId,
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
    network
  );

  return {
    ...context.request.params.request,
    ...response,
  };
};
