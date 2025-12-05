import { CurrentAvalancheAccount } from '@avalabs/avalanche-module';

import {
  DEFERRED_RESPONSE,
  DomainMetadata,
  NetworkWithCaipId,
} from '@core/types';

export type Next = () => Promise<void> | void;
export type ErrorCallback = (error: Error) => void;

export type Context<RequestType, ResponseType> = {
  request: RequestType;
  domainMetadata?: DomainMetadata;
  network?: NetworkWithCaipId;
  account?: CurrentAvalancheAccount;
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
