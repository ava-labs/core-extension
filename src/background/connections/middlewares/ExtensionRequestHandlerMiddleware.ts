import { Middleware } from './models';
import { resolve } from '@src/utils/promiseResolver';
import { ExtensionRequestHandler } from '../models';

export function ExtensionRequestHandlerMiddleware(
  handlers: ExtensionRequestHandler<any, any>[]
): Middleware {
  const handlerMap = handlers.reduce((acc, handler) => {
    if (acc.get(handler.method))
      throw new Error(`Method already handled: ${handler.method}`);
    acc.set(handler.method, handler);
    return acc;
  }, new Map<string, ExtensionRequestHandler<any, any>>());

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
