import { Maybe } from '@avalabs/core-utils-sdk';
import { RpcResponse } from '@avalabs/vm-module-types';
import { EthereumProviderError } from 'eth-rpc-errors';
import { SerializedEthereumRpcError } from 'eth-rpc-errors/dist/classes';

import { Action } from './actions';
import { DomainMetadata } from './domain-metadata';

export enum DAppProviderRequest {
  DOMAIN_METADATA_METHOD = 'avalanche_sendDomainMetadata',
  CONNECT_METHOD = 'eth_requestAccounts',
  INIT_DAPP_STATE = 'avalanche_getProviderState',
  ETH_ACCOUNTS = 'eth_accounts',
  WALLET_PERMISSIONS = 'wallet_requestPermissions',
  WALLET_GET_PERMISSIONS = 'wallet_getPermissions',
  WALLET_ADD_CHAIN = 'wallet_addEthereumChain',
  WALLET_GET_CHAIN = 'wallet_getEthereumChain',
  WALLET_SWITCH_ETHEREUM_CHAIN = 'wallet_switchEthereumChain',
  WALLET_WATCH_ASSET = 'wallet_watchAsset',
  PERSONAL_EC_RECOVER = 'personal_ecRecover',
  PERSONAL_SIGN = 'personal_sign',
  ETH_SIGN_TYPED_DATA_V4 = 'eth_signTypedData_v4',
  ETH_SIGN_TYPED_DATA_V3 = 'eth_signTypedData_v3',
  ETH_SIGN_TYPED_DATA_V1 = 'eth_signTypedData_v1',
  ETH_SIGN_TYPED_DATA = 'eth_signTypedData',
  ETH_SIGN = 'eth_sign',
  AVALANCHE_GET_CONTACTS = 'avalanche_getContacts',
  AVALANCHE_CREATE_CONTACT = 'avalanche_createContact',
  AVALANCHE_UPDATE_CONTACT = 'avalanche_updateContact',
  AVALANCHE_REMOVE_CONTACT = 'avalanche_removeContact',
  AVALANCHE_GET_ACCOUNTS = 'avalanche_getAccounts',
  AVALANCHE_ADD_ACCOUNT = 'avalanche_addAccount',
  AVALANCHE_GET_ADDRESSES_IN_RANGE = 'avalanche_getAddressesInRange',
  AVALANCHE_GET_BRIDGE_STATE = 'avalanche_getBridgeState',
  AVALANCHE_SELECT_WALLET = 'avalanche_selectWallet',
  AVALANCHE_SET_DEVELOPER_MODE = 'avalanche_setDeveloperMode',
  ACCOUNT_SELECT = 'avalanche_selectAccount',
  ACCOUNT_RENAME = 'avalanche_renameAccount',
  ACCOUNTS_DELETE = 'avalanche_deleteAccounts',
  AVALANCHE_GET_ACCOUNT_PUB_KEY = 'avalanche_getAccountPubKey',
  AVALANCHE_SEND_TRANSACTION = 'avalanche_sendTransaction',
  AVALANCHE_SIGN_TRANSACTION = 'avalanche_signTransaction',
  AVALANCHE_SIGN_MESSAGE = 'avalanche_signMessage',
  BITCOIN_SEND_TRANSACTION = 'bitcoin_sendTransaction',
  WALLET_RENAME = 'avalanche_renameWallet',
  WALLET_ADD_NETWORK = 'wallet_addNetwork',
  WALLET_GET_PUBKEY = 'wallet_getPublicKey',
  WALLET_CONNECT = 'wallet_requestAccountPermission',
  WALLET_GET_NETWORK_STATE = 'wallet_getNetworkState',
  WALLET_ENABLE_NETWORK = 'wallet_enableNetwork',
  WALLET_GET_SETTINGS = 'wallet_getSettings',
  WALLET_SET_SETTINGS = 'wallet_setSettings',
  WALLET_GET_CAPABILITIES = 'wallet_getCapabilities',
}

export enum Web3Event {
  // https://eips.ethereum.org/EIPS/eip-1193#connect-1
  // not emitted as a separate event from the background, the inpage provider handles it
  // based on the `avalanche_getProviderState` and the `chainChanged` event
  CONNECT = 'connect',
  // https://eips.ethereum.org/EIPS/eip-1193#disconnect-1
  DISCONNECT = 'disconnect',
  // https://eips.ethereum.org/EIPS/eip-1193#accountschanged-1
  ACCOUNTS_CHANGED = 'accountsChanged',
  ACCOUNTS_CHANGED_CA = 'accountsChangedCA', // Chain-agnostic version of ACCOUNTS_CHANGED
  // https://eips.ethereum.org/EIPS/eip-1193#chainchanged-1
  CHAIN_CHANGED = 'chainChanged',

  // Core Web specific events
  NETWORK_STATE_CHANGED = 'networkStateChanged',
  SETTINGS_CHANGED = 'settingsChanged',
  ACCOUNTS_DELETED = 'accountsDeleted',
  ACCOUNT_NAME_CHANGED = 'accountNameChanged',
  WALLET_NAME_CHANGED = 'walletNameChanged',
}

export interface JsonRpcRequestParams<Method extends string, Params = unknown> {
  readonly scope: string;
  readonly sessionId: string;
  readonly request: JsonRpcRequestPayload<Method, Params>;
}

export type JsonRpcRequestPayload<
  Method extends string = any,
  Params = unknown,
> = Params extends undefined
  ? JsonRpcRequestPayloadWithoutParams<Method>
  : JsonRpcRequestPayloadWithParams<Method, Params>;

export interface JsonRpcRequest<Method extends string = any, Params = unknown> {
  readonly jsonrpc: '2.0';
  readonly id: string;
  readonly method: 'provider_request';
  readonly params: JsonRpcRequestParams<Method, Params>;
  readonly context?: { tabId?: number } & Record<string, unknown>;
}

interface JsonRpcRequestPayloadBase<Method extends string = any> {
  readonly id: string;
  readonly method: Method;
  readonly site?: DomainMetadata;
  readonly tabId?: number;
  readonly context?: Record<string, unknown>;
}

interface JsonRpcRequestPayloadWithParams<
  Method extends string = any,
  Params = unknown,
> extends JsonRpcRequestPayloadBase<Method> {
  readonly params: Params;
}

interface JsonRpcRequestPayloadWithoutParams<Method extends string = any>
  extends JsonRpcRequestPayloadBase<Method> {
  readonly params?: never;
}

export interface JsonRpcSuccess<T = unknown> {
  result: Maybe<T | symbol>;
}
export interface JsonRpcFailure {
  error: EthereumProviderError<unknown> | SerializedEthereumRpcError | Error;
}
export declare type JsonRpcResponse<T = unknown> =
  | JsonRpcSuccess<T>
  | JsonRpcFailure
  | RpcResponse;

/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
export interface DAppRequestHandler {
  /**
   * Optional: Only used when the action needs user approval
   * IS ONLY called when `actionsService.addAction` and a `DEFERRED_RESPONSE` is used by the handler.
   * Called by the ActionsService after the user confirms the request on the approval popup.
   */
  onActionApproved?: (
    pendingAction: Action,
    result: any,
    onSuccess: (result: unknown) => Promise<void>,
    onError: (error: Error) => Promise<void>,
    tabId?: number,
  ) => Promise<void>;
}

export abstract class DAppRequestHandler<
  RequestParams = unknown,
  ResponseParams = any,
> {
  abstract methods: DAppProviderRequest[];

  abstract handleAuthenticated: (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, RequestParams>,
  ) => Promise<JsonRpcResponse<ResponseParams>>;

  abstract handleUnauthenticated: (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, RequestParams>,
  ) => Promise<JsonRpcResponse<ResponseParams>>;
}
