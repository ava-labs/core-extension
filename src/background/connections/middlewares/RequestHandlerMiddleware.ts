import { DAppProviderRequest } from '../dAppConnection/models';
import { Middleware } from './models';
import { resolve } from '@src/utils/promiseResolver';
import { engine } from '@src/utils/jsonRpcEngine';
import { DappRequestHandler } from '../models';

export function RequestHandlerMiddleware(
  handlers: Map<DAppProviderRequest, DappRequestHandler>
): Middleware {
  return async (context, next) => {
    const handler = handlers.get(context.request.data.method);

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
