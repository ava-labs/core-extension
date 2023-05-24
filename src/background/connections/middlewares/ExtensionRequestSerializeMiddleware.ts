import { serialize } from '@src/background/serialization/serialize';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
} from '../models';
import { DEFERRED_RESPONSE, Middleware } from './models';

export function ExtensionRequestSerializeMiddleware(): Middleware<
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse<any, any>
> {
  return async (context, next) => {
    if (
      context.response &&
      context.response !== DEFERRED_RESPONSE &&
      'result' in context.response
    ) {
      context.response.result = serialize(context.response.result);
    }

    next();
  };
}
