import { Middleware } from './models';
import { resolve } from '@src/utils/promiseResolver';
import { engine } from '@src/utils/jsonRpcEngine';
import { DAppRequestHandler } from '../models';

export function DAppRequestHandlerMiddleware(
  handlers: DAppRequestHandler[]
): Middleware {
  const handlerMap = handlers.reduce((acc, handler) => {
    for (const method of handler.methods) {
      acc.set(method, handler);
    }
    return acc;
  }, new Map<string, DAppRequestHandler>());

  return async (context, next) => {
    const handler = handlerMap.get(context.request.data.method);

    // Call correct handler method based on authentication status
    let promise: Promise<any>;
    if (handler) {
      const params = {
        ...context.request.data,
        site: context.domainMetadata,
      };
      promise = context.authenticated
        ? handler.handleAuthenticated(params)
        : handler.handleUnauthenticated(params);
    } else {
      promise = engine().then((e) => e.handle(context.request.data));
    }

    context.response = await resolve(promise).then(([result, error]) => {
      return {
        ...context.request,
        data: {
          ...context.request.data,
          ...(error ? { error } : result),
        },
      };
    });

    next();
  };
}
