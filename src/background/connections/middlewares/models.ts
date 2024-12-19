import { DomainMetadata } from '@src/background/models';
import { NetworkWithCaipId } from '@src/background/services/network/models';

export type Next = () => Promise<void> | void;
export type ErrorCallback = (error: Error) => void;

export const DEFERRED_RESPONSE: unique symbol = Symbol();

export type Context<RequestType, ResponseType> = {
  request: RequestType;
  domainMetadata?: DomainMetadata;
  network?: NetworkWithCaipId;
  authenticated: boolean;
  response?: ResponseType | typeof DEFERRED_RESPONSE;
};

export type Middleware<RequestType, ResponseType> = (
  context: Context<RequestType, ResponseType>,
  next: Next,
  error: ErrorCallback,
) => Promise<void> | void;

export type Pipeline<RequestType, ResponseType> = {
  push: (...middlewares: Middleware<RequestType, ResponseType>[]) => void;
  execute: (
    context: Context<RequestType, ResponseType>,
  ) => Promise<Context<RequestType, ResponseType>>;
};
