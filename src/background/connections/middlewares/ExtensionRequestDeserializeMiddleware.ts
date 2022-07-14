import { deserialize } from '@src/background/serialization/deserialize';
import { Middleware } from './models';

export function ExtensionRequestDeserializeMiddleware(): Middleware {
  return async (context, next) => {
    context.request.params = deserialize(context.request.params);
    next();
  };
}
