import {
  DEFERRED_RESPONSE,
  DomainMetadata,
  NetworkWithCaipId,
} from '@core/types';

export type Next = () => Promise<void> | void;
export type ErrorCallback = (error: Error) => void;

type AvalancheTxAccountInfo = {
  xpAddress: string;
  evmAddress?: string;
  xpubXP?: string;
  xpAddresses: {
    index: number;
    address: string;
  }[];
};

export type Context<RequestType, ResponseType> = {
  request: RequestType;
  domainMetadata?: DomainMetadata;
  network?: NetworkWithCaipId;
  account?: AvalancheTxAccountInfo;
  currentAddress?: string;
  currentEvmAddress?: string;
  xpubXP?: string;
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
