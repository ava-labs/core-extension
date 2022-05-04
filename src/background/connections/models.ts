/* eslint-disable no-prototype-builtins */

import { Runtime } from 'webextension-polyfill-ts';
import { JsonRpcRequest } from '../../utils/jsonRpcEngine';
import { DomainMetadata } from '../models';

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
export interface ExtensionConnectionMessage<T = any> {
  id: string;
  method: string;
  params?: any[];
  /**
   * Domain and icon get added onto incoming requests at the permission
   * level, its only present on requests from dApps. Look in
   * dAppConnection -> providerController to see injection point
   */
  site?: DomainMetadata;
  meta?: ExtensionMessageMetaData;
  data?: T;
}

export interface ExtensionConnectionMessageResponse<T = any>
  extends ExtensionConnectionMessage {
  result?: T;
  error?: string;
}

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

export type ConnectionRequestHandler<T = any> = (
  request: ExtensionConnectionMessage
) => Promise<ExtensionConnectionMessageResponse<T>>;

export interface DAppRequestHandler<T = any> {
  methods: string[];
  handleAuthenticated: (
    request: ExtensionConnectionMessage
  ) => Promise<ExtensionConnectionMessageResponse<T>>;
  handleUnauthenticated: (
    request: ExtensionConnectionMessage
  ) => Promise<ExtensionConnectionMessageResponse<T>>;
}

export interface ExtensionRequestHandler<T = any> {
  methods: string[];
  handle: (
    request: ExtensionConnectionMessage
  ) => Promise<ExtensionConnectionMessageResponse<T>>;
}

interface ConnectionEventEmitter {
  addListener(handler: (event: ExtensionConnectionEvent) => void): void;
  removeListener(handler: (event: ExtensionConnectionEvent) => void): void;
}

export type ExtensionEventEmitter = ConnectionEventEmitter;
export interface DAppEventEmitter extends ConnectionEventEmitter {
  setDomain(domain: string): void;
}
export interface JSONRPCRequestWithDomain extends JsonRpcRequest<any> {
  domain: string;
}

export const COREX_DOMAINS = ['localhost', 'corex.pages.dev'];

export interface ConnectionController {
  connect(connection: Runtime.Port): void;
  disconnect(): void;
}
