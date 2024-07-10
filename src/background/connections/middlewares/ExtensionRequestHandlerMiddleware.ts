import { Middleware } from './models';
import { resolve } from '@src/utils/promiseResolver';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '../models';
import * as Sentry from '@sentry/browser';

export function ExtensionRequestHandlerMiddleware(
  handlers: ExtensionRequestHandler<any, any>[]
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

    if (!handler) {
      onError(new Error('no handler for this request found'));
      return;
    }
    const sentryTracker = Sentry.startTransaction({
      name: `Handler: ${method}`,
    });
    const promise = handler.handle({
      ...context.request.params,
    });

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
