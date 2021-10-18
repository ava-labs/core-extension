/* eslint-disable no-prototype-builtins */
import { JsonRpcRequest } from '../../utils/jsonRpcEngine';

export interface ExtensionConnectionMessage<T = any> {
  id: string;
  method: string;
  params?: any[];
  /**
   * Domain and icon get added onto incoming requests at the permission
   * level, its only present on requests from dApps. Look in
   * dAppConnection -> providerController to see injection point
   */
  domain?: string;
  icon?: string;
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
  WALLET_CHANGE_PASSWORD = 'wallet_changePassword',
  WALLET_UNENCRYPTED_MNEMONIC = 'wallet_getUnencryptedMnemonic',
  GET_WALLET_HISTORY = 'wallet_getHistory',

  SETTINGS_LOCK_WALLET = 'settings_lockWallet',

  MESSAGE_SIGN = 'message_signMessage',
  MESSAGE_GET_PENDING = 'message_getPendingMessage',
  MESSAGE_CANCEL_PENDING = 'message_cancelPendingMessage',

  PERMISSIONS_ADD_DOMAIN = 'permissions_addDomain',
  PERMISSIONS_GET_PERMISSIONS = 'permissions_getPermissionsForDomain',
  PERMISSIONS_GET_ACCOUNTS = 'permissions_getAccounts',

  TRANSACTIONS_GET = 'transactions_getTransaction',
  TRANSACTIONS_UPDATE = 'transactions_updateTransaction',

  SEND_AVAX_VALIDATE = 'send_validateSendAvaxState',
  SEND_AVAX_RESET = 'send_resetSendAvaxState',
  SEND_AVAX_SUBMIT = 'send_submitSendAvaxState',

  SEND_ANT_VALIDATE = 'send_validateSendAntState',
  SEND_ANT_RESET = 'send_resetSendAntState',
  SEND_ANT_SUBMIT = 'send_submitSendAntState',

  SEND_ERC20_VALIDATE = 'send_validateSendErc20State',
  SEND_ERC20_RESET = 'send_resetSendErc20State',
  SEND_ERC20_SUBMIT = 'send_submitSendErc20State',

  SETTINGS_GET = 'settings_get',
  SETTINGS_UPDATE_CURRENCY = 'settings_update_currency',
  SETTINGS_UPDATE_SHOW_NO_BALANCE = 'settings_update_show_no_balance',
}

export enum ProviderRequest {
  DOMAIN_METADATA_METHOD = 'metamask_sendDomainMetadata',
  CONNECT_METHOD = 'eth_requestAccounts',
}

export interface JSONRPCRequestWithDomain extends JsonRpcRequest<any> {
  domain: string;
}
