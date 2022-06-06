import { Middleware } from './models';
import { resolve } from '@src/utils/promiseResolver';
import { ExtensionRequestHandler } from '../models';

export function ExtensionRequestHandlerMiddleware(
  handlers: ExtensionRequestHandler[]
): Middleware {
  const handlerMap = handlers.reduce((acc, handler) => {
    for (const method of handler.methods) {
      acc.set(method, handler);
    }
    return acc;
  }, new Map<string, ExtensionRequestHandler>());

  return async (context, next, error) => {
    const handler = handlerMap.get(context.request.method);

    if (!handler) {
      error(new Error('no handler for this request found'));
      return;
    }

    const promise = handler.handle({ ...context.request });

    context.response = await resolve(promise).then(([result, error]) => {
      error && console.error(error);
      return {
        ...(error ? error : result),
      };
    });

    next();
  };
}
