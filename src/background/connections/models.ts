/* eslint-disable no-prototype-builtins */

import { Runtime } from 'webextension-polyfill';
import { RpcMethod } from '@avalabs/vm-module-types';

import { ArrayElement } from '../models';
import { ExtensionRequest } from './extensionConnection/models';
import {
  DAppProviderRequest,
  JsonRpcRequest,
  JsonRpcRequestPayload,
} from './dAppConnection/models';
import { ErrorData } from '@src/utils/errors';
import { EthereumProviderError, EthereumRpcError } from 'eth-rpc-errors';
import { SerializedEthereumRpcError } from 'eth-rpc-errors/dist/classes';
import { DAppRequestHandler } from './dAppConnection/DAppRequestHandler';

export type ExtensionConnectionMessage<
  Method extends ExtensionRequest | DAppProviderRequest | RpcMethod = any,
  Params = any,
> = JsonRpcRequest<Method, Params>;

export type ExtensionConnectionMessageResponse<
  Method extends ExtensionRequest | DAppProviderRequest | RpcMethod = any,
  Result = any,
  Params = any,
> = ExtensionConnectionMessage<Method, Params>['params']['request'] &
  (
    | {
        result: Result;
        error?: never;
      }
    | {
        result?: never;
        error:
          | string
          | EthereumRpcError<ErrorData>
          | EthereumProviderError<Params>
          | SerializedEthereumRpcError;
      }
  );

export interface ExtensionConnectionEvent<V = any> {
  name: string;
  value: V;
}

export function isConnectionEvent(
  message: ExtensionConnectionMessageResponse | ExtensionConnectionEvent,
): message is ExtensionConnectionEvent {
  return !message.hasOwnProperty('id') && message.hasOwnProperty('name');
}

export function isConnectionResponse(
  message: ExtensionConnectionMessageResponse | ExtensionConnectionEvent,
): message is ExtensionConnectionMessageResponse {
  return (
    message.hasOwnProperty('id') &&
    !message.hasOwnProperty('name') &&
    !message.hasOwnProperty('value')
  );
}

/**
 * Background handler for messages from the UI.
 * @param Method The ExtensionRequest handled by this handler (only one handler per ExtensionRequest).
 * @param Result Type of the return `result` of the handler.
 * @param Params [Optional] type of `request.params` in the `handle` function.
 * Can be any simple type that is serializable e.g. struct, array, number,
 * string
 */
export interface ExtensionRequestHandler<
  Method extends ExtensionRequest | DAppProviderRequest | RpcMethod,
  Result,
  Params = undefined,
> {
  method: Method;
  handle: (
    rpcCall: ExtensionConnectionMessage<Method, Params>['params'],
  ) => Promise<ExtensionConnectionMessageResponse<Method, Result, Params>>;
}

type ExtractHandlerTypes<Type> =
  Type extends ExtensionRequestHandler<infer M, infer R, infer P>
    ? { Method: M; Result: R; Params: P }
    : Type extends DAppRequestHandler<infer P, infer R>
      ? {
          Method: ArrayElement<Type['methods']>;
          Params: P;
          Result: R;
        }
      : {
          Method: RpcMethod;
          Params: Type;
          Result: string;
        };

type ModuleRequestPayload = Record<string, unknown>;

/**
 * The `Handler` type argument is required and must be a reference to a class
 * that implements `ExtensionRequestHandler`.
 */
export type RequestHandlerType = <
  // Reference to a class that implements ExtensionRequestHandler.
  HandlerOrKnownParams extends
    | ExtensionRequestHandler<Method, Result, Params>
    | DAppRequestHandler<Params, Result>
    | ModuleRequestPayload,
  // The following type arguments should NOT be provided, they are inferred.
  Method extends
    | ExtensionRequest
    | DAppProviderRequest
    | RpcMethod = ExtractHandlerTypes<HandlerOrKnownParams>['Method'],
  Result = Exclude<ExtractHandlerTypes<HandlerOrKnownParams>['Result'], symbol>,
  Params = ExtractHandlerTypes<HandlerOrKnownParams>['Params'],
>(
  message: Omit<JsonRpcRequestPayload<Method, Params>, 'id'>,
  context?: Record<string, unknown>,
) => Promise<Result>;

interface ConnectionEventEmitter {
  addListener(handler: (event: ExtensionConnectionEvent) => void): void;
  removeListener(handler: (event: ExtensionConnectionEvent) => void): void;
}

export interface ConnectionInfo {
  domain: string;
  tabId?: number;
}

export type ExtensionEventEmitter = ConnectionEventEmitter;
export interface DAppEventEmitter extends ConnectionEventEmitter {
  setConnectionInfo(connectionInfo: ConnectionInfo): void;
}
export interface JSONRPCRequestWithDomain extends JsonRpcRequest<any> {
  domain: string;
}

export const CORE_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'core-web.pages.dev',
  'core.app',
  'test.core.app',
  'ava-labs.github.io', // playground
  'avacloud.io',
  'avacloud-app.pages.dev',
];

export interface ConnectionController {
  connect(connection: Runtime.Port): void;
  disconnect(): void;
}
