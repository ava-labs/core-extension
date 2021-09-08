/* eslint-disable no-prototype-builtins */
import { JsonRpcRequest } from '../../utils/jsonRpcEngine';

export interface ExtensionConnectionMessage<T = any> {
  id: string;
  method: string;
  params?: any[];
  /**
   * This gets added onto incoming requests at the permission
   * level, its only present on requests from dApps
   */
  domain?: string;
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

export enum ExtensionRequest {
  ONBOARDING_GET_STATE = 'onboarding_getIsOnBoarded',
  ONBOARDING_SET_PHASE = 'onboarding_setCurrentPhase',
  ONBOARDING_SET_MNEMONIC = 'onboarding_setWalletMnemonic',
  ONBOARDING_SET_PASSWORD = 'onboarding_setWalletPassword',
  ONBOARDING_SET_FINALIZED = 'onboarding_setOnboardingFinalized',
  NETWORK_GET_SELECTED = 'network_getSelectedNetwork',
  NETWORK_SET_SELECTED = 'network_setSelectedNetwork',
  WALLET_STATE = 'wallet_InitializeState',
  WALLET_UNLOCK_STATE = 'wallet_unlockWalletState',
  SETTINGS_LOCK_WALLET = 'settings_lockWallet',
  MESSAGE_SIGN = 'message_signMessage',
  MESSAGE_GET_PENDING = 'message_getPendingMessage',
  MESSAGE_CANCEL_PENDING = 'message_cancelPendingMessage',
  PERMISSIONS_ADD_DOMAIN = 'permissions_addDomain',
  PERMISSIONS_GET_PERMISSIONS = 'permissions_getPermissionsForDomain',
  PERMISSIONS_GET_ACCOUNTS = 'permissions_getAccounts',
  TRANSACTIONS_GET = 'transactions_getTransaction',
  TRANSACTIONS_UPDATE = 'transactions_updateTransaction',
}

export enum ProviderRequest {
  DOMAIN_METADATA_METHOD = 'metamask_sendDomainMetadata',
  CONNECT_METHOD = 'eth_requestAccounts',
}

export interface JSONRPCRequestWithDomain extends JsonRpcRequest<any> {
  domain: string;
}
