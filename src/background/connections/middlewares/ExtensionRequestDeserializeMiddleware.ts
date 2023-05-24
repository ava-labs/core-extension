import { deserialize } from '@src/background/serialization/deserialize';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
} from '../models';
import { Middleware } from './models';

export function ExtensionRequestDeserializeMiddleware(): Middleware<
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse<any, any>
> {
  return async (context, next) => {
    context.request.params = deserialize(context.request.params);
    next();
  };
}
