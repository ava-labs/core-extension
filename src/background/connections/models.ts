/* eslint-disable no-prototype-builtins */

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

export interface DappRequestHandler<T = any> {
  handleAuthenticated: (
    request: ExtensionConnectionMessage
  ) => Promise<ExtensionConnectionMessageResponse<T>>;
  handleUnauthenticated: (
    request: ExtensionConnectionMessage
  ) => Promise<ExtensionConnectionMessageResponse<T>>;
}

export enum ExtensionRequest {
  ONBOARDING_GET_STATE = 'onboarding_getIsOnBoarded',
  ONBOARDING_SET_PHASE = 'onboarding_setCurrentPhase',
  ONBOARDING_SET_MNEMONIC = 'onboarding_setWalletMnemonic',
  ONBOARDING_SET_PASSWORD_AND_NAME = 'onboarding_setWalletPasswordAndName',
  ONBOARDING_SET_ACCOUNT_NAME = 'onboarding_setAccountName',
  ONBOARDING_SET_FINALIZED = 'onboarding_setOnboardingFinalized',
  ONBOARDING_INITIAL_WALLET_OPEN = 'onboarding_initial_wallet_open',

  NETWORK_GET_SELECTED = 'network_getSelectedNetwork',
  NETWORK_SET_SELECTED = 'network_setSelectedNetwork',

  ACCOUNT_GET_ACCOUNTS = 'account_get',
  ACCOUNT_SELECT = 'account_select',
  ACCOUNT_RENAME = 'account_rename',
  ACCOUNT_ADD = 'account_add',

  BRIDGE_GET_CONFIG = 'bridge_get_config',
  BRIDGE_GET_ETH_BALANCE = 'bridge_get_eth_balance',
  BRIDGE_GET_ETH_BALANCES = 'bridge_get_eth_balances',
  BRIDGE_TRANSFER_ASSET = 'bridge_transfer_asset',

  WALLET_STATE = 'wallet_InitializeState',
  WALLET_UNLOCK_STATE = 'wallet_unlockWalletState',
  WALLET_CHANGE_PASSWORD = 'wallet_changePassword',
  WALLET_UNENCRYPTED_MNEMONIC = 'wallet_getUnencryptedMnemonic',
  GET_WALLET_HISTORY = 'wallet_getHistory',

  SETTINGS_LOCK_WALLET = 'settings_lockWallet',

  MESSAGE_GET = 'message_getMessage',
  MESSAGE_UPDATE = 'message_updateMessage',

  PERMISSIONS_ADD_DOMAIN = 'permissions_addDomain',
  PERMISSIONS_GET_PERMISSIONS = 'permissions_getPermissionsForDomain',
  PERMISSIONS_GET_ALL_PERMISSIONS = 'permissions_getAllPermissions',
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

  SEND_NFT_VALIDATE = 'send_validateSendNftState',
  SEND_NFT_RESET = 'send_resetSendNftState',
  SEND_NFT_SUBMIT = 'send_submitSendNfftState',

  SETTINGS_GET = 'settings_get',
  SETTINGS_UPDATE_CURRENCY = 'settings_update_currency',
  SETTINGS_UPDATE_SHOW_NO_BALANCE = 'settings_update_show_no_balance',
  SETTINGS_UPDATE_THEME = 'settings_update_theme',
  SETTINGS_UPDATE_TOKENS_VISIBILITY = 'settings_update_tokens_visibility',
  SETTINGS_ADD_CUSTOM_TOKEN = 'settings_add_custom_token',
  SETTINGS_GET_TOKEN_DATA = 'settings_get_token_data',
  SETTINGS_SET_DEFAULT_EXTENSION = 'settings_set_default_extension',
  SETTINGS_GET_DEFAULT_EXTENSION = 'settings_get_default_extension',

  CONTACTS_GET = 'contacts_get',
  CONTACTS_CREATE = 'contacts_create',
  CONTACTS_REMOVE = 'contacts_remove',

  BRIDGE_TRANSACTION_CREATE = 'bridge_transaction_create',
  BRIDGE_TRANSACTIONS_GET = 'bridge_transaction_get',
  BRIDGE_TRANSACTION_REMOVE = 'bridge_transaction_remove',

  FAVORITES_CREATE = 'favorites_create',
  FAVORITES_REMOVE = 'favorites_remove',
  FAVORITES_GET = 'favorites_get',

  SWAP_GET_RATE = 'swap_get_rate',
  SWAP_PERFORM = 'swap_perform',

  GAS_GET = 'gas_get',

  LEDGER_INIT_TRANSPORT = 'ledger_init_transport',
  LEDGER_HAS_TRANSPORT = 'ledger_has_transport',
  LEDGER_GET_PUBLIC = 'ledger_get_public',
  LEDGER_RESPONSE = 'ledger_response',

  NAVIGATION_HISTORY_GET = 'navigation_history_get',
  NAVIGATION_HISTORY_SET = 'navigation_history_set',
  NAVIGATION_HISTORY_DATA_GET = 'navigation_history_data_get',
  NAVIGATION_HISTORY_DATA_SET = 'navigation_history_data_set',
}

export interface JSONRPCRequestWithDomain extends JsonRpcRequest<any> {
  domain: string;
}

export const COREX_DOMAINS = ['localhost'];
