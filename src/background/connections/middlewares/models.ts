import { DomainMetadata } from '@src/background/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
} from '../models';

export type Next = () => Promise<void> | void;
export type ErrorCallback = (error: Error) => void;

export const DEFERRED_RESPONSE: unique symbol = Symbol();

export type Context = {
  request: ExtensionConnectionMessage;
  domainMetadata?: DomainMetadata;
  authenticated: boolean;
  response?:
    | ExtensionConnectionMessage // DAPP requests
    | ExtensionConnectionMessageResponse<any, any> // Connection requests
    | typeof DEFERRED_RESPONSE;
};

export type Middleware = (
  context: Context,
  next: Next,
  error: ErrorCallback
) => Promise<void> | void;

export type Pipeline = {
  push: (...middlewares: Middleware[]) => void;
  execute: (context: Context) => Promise<Context>;
};
