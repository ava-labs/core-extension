/* eslint-disable no-prototype-builtins */

import { Runtime } from 'webextension-polyfill';
import { ArrayElement, DomainMetadata } from '../models';
import { ExtensionRequest } from './extensionConnection/models';
import { DAppProviderRequest, JsonRpcRequest } from './dAppConnection/models';
import { ErrorData } from '@src/utils/errors';
import { EthereumProviderError, EthereumRpcError } from 'eth-rpc-errors';
import { SerializedEthereumRpcError } from 'eth-rpc-errors/dist/classes';
import { DAppRequestHandler } from './dAppConnection/DAppRequestHandler';

interface ExtensionConnectionMessageBase<
  Method extends ExtensionRequest | DAppProviderRequest,
  Data
> {
  id: string;
  method: Method;
  /**
   * Domain metadata gets added to incoming requests only
   * for requests that go to DAppRequestHandler's.
   */
  site?: DomainMetadata;
  data?: Data;
  tabId?: number;
}
interface ExtensionConnectionMessageWithParams<
  Method extends ExtensionRequest | DAppProviderRequest,
  Params,
  Data
> extends ExtensionConnectionMessageBase<Method, Data> {
  params: Params;
}
interface ExtensionConnectionMessageWithoutParams<
  Method extends ExtensionRequest | DAppProviderRequest,
  Data
> extends ExtensionConnectionMessageBase<Method, Data> {
  params?: never;
}

export type ExtensionConnectionMessage<
  Method extends ExtensionRequest | DAppProviderRequest = any,
  Params = any,
  Data = any
> = Params extends undefined
  ? ExtensionConnectionMessageWithoutParams<Method, Data>
  : ExtensionConnectionMessageWithParams<Method, Params, Data>;

export type ExtensionConnectionMessageResponse<
  Method extends ExtensionRequest | DAppProviderRequest = any,
  Result = any,
  Params = any,
  Data = any
> = ExtensionConnectionMessage<Method, Params, Data> &
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
  message: ExtensionConnectionMessageResponse | ExtensionConnectionEvent
): message is ExtensionConnectionEvent {
  return !message.hasOwnProperty('id') && message.hasOwnProperty('name');
}

export function isConnectionResponse(
  message: ExtensionConnectionMessageResponse | ExtensionConnectionEvent
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
  Method extends ExtensionRequest | DAppProviderRequest,
  Result,
  // `= undefined` is needed here so calls to ConnectionProvider's `request`
  // function will complain when `params` are provided but not expected.
  Params = undefined,
  Data = undefined
> {
  method: Method;
  handle: (
    request: ExtensionConnectionMessage<Method, Params, Data>
  ) => Promise<
    ExtensionConnectionMessageResponse<Method, Result, Params, Data>
  >;
}

type ExtractHandlerTypes<Type> = Type extends ExtensionRequestHandler<
  infer M,
  infer R,
  infer P,
  infer D
>
  ? { Method: M; Result: R; Params: P; Data: D }
  : Type extends DAppRequestHandler<infer P, infer R>
  ? { Method: ArrayElement<Type['methods']>; Params: P; Result: R; Data: never }
  : never;

/**
 * The `Handler` type argument is required and must be a reference to a class
 * that implements `ExtensionRequestHandler`.
 */
export type RequestHandlerType = <
  // Reference to a class that implements ExtensionRequestHandler.
  Handler extends
    | ExtensionRequestHandler<Method, Result, Params, Data>
    | DAppRequestHandler<Result, Params>,
  // The following type arguments should NOT be provided, they are inferred.
  Method extends
    | ExtensionRequest
    | DAppProviderRequest = ExtractHandlerTypes<Handler>['Method'],
  Result = ExtractHandlerTypes<Handler>['Result'],
  Params = ExtractHandlerTypes<Handler>['Params'],
  Data = ExtractHandlerTypes<Handler>['Data']
>(
  message: Omit<ExtensionConnectionMessage<Method, Params, Data>, 'id'>
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
