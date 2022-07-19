/* eslint-disable no-prototype-builtins */

import { Runtime } from 'webextension-polyfill-ts';
import { JsonRpcRequest } from '../../utils/jsonRpcEngine';
import { DomainMetadata } from '../models';
import { ExtensionRequest } from './extensionConnection/models';

export interface ExtensionMessageMetaData {
  coords?: {
    /**
     * These are added in the inpage file. Before forwarding the
     * request it attaches the window height and width so we can
     * pass this info to confirm popups and place them on the screen correctly
     */
    viewPortHeight: number;
    viewportWidth: number;
    screenX: number;
    screenY: number;
  };
}

interface ExtensionConnectionMessageBase<
  Method extends ExtensionRequest,
  Data
> {
  id: string;
  method: Method;
  /**
   * Domain and icon get added onto incoming requests at the permission
   * level, its only present on requests from dApps. Look in
   * dAppConnection -> providerController to see injection point
   */
  site?: DomainMetadata;
  meta?: ExtensionMessageMetaData;
  data?: Data;
  tabId?: number;
}
interface ExtensionConnectionMessageWithParams<
  Method extends ExtensionRequest,
  Params,
  Data
> extends ExtensionConnectionMessageBase<Method, Data> {
  params: Params;
}
interface ExtensionConnectionMessageWithoutParams<
  Method extends ExtensionRequest,
  Data
> extends ExtensionConnectionMessageBase<Method, Data> {
  params?: never;
}

export type ExtensionConnectionMessage<
  Method extends ExtensionRequest = any,
  Params = any,
  Data = any
> = Params extends undefined
  ? ExtensionConnectionMessageWithoutParams<Method, Data>
  : ExtensionConnectionMessageWithParams<Method, Params, Data>;

export type ExtensionConnectionMessageResponse<
  Method extends ExtensionRequest = any,
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
        error: string;
      }
  );

export interface ExtensionConnectionEvent<V = any> {
  name: string;
  value: V;
}

export function isConnectionEvent(
  message: ExtensionConnectionMessageResponse | ExtensionConnectionEvent
): message is ExtensionConnectionEvent {
  return (
    !message.hasOwnProperty('id') &&
    message.hasOwnProperty('name') &&
    message.hasOwnProperty('value')
  );
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

export interface DAppRequestHandler<T extends ExtensionRequest = any> {
  methods: string[];
  handleAuthenticated: (
    request: ExtensionConnectionMessage
  ) => Promise<ExtensionConnectionMessageResponse<T, any>>;
  handleUnauthenticated: (
    request: ExtensionConnectionMessage
  ) => Promise<ExtensionConnectionMessageResponse<T, any>>;
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
  Method extends ExtensionRequest,
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
  : never;

/**
 * The `Handler` type argument is required and must be a reference to a class
 * that implements `ExtensionRequestHandler`.
 */
export type RequestHandlerType = <
  // Reference to a class that implements ExtensionRequestHandler.
  Handler extends ExtensionRequestHandler<Method, Result, Params, Data>,
  // The following type arguments should NOT be provided, they are inferred.
  Method extends ExtensionRequest = ExtractHandlerTypes<Handler>['Method'],
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

export const COREX_DOMAINS = [
  'localhost',
  'core-web.pages.dev',
  'core.avax-test.network',
  'core.avax.network',
];

export interface ConnectionController {
  connect(connection: Runtime.Port): void;
  disconnect(): void;
}
