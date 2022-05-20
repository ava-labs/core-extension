export enum ExtensionRequest {
  ONBOARDING_GET_STATE = 'onboarding_getIsOnBoarded',
  ONBOARDING_SUBMIT = 'onboarding_submit',
  ONBOARDING_INITIAL_WALLET_OPEN = 'onboarding_initial_wallet_open',

  NETWORK_GET_SELECTED = 'network_getSelectedNetwork',
  NETWORK_SET_SELECTED = 'network_setSelectedNetwork',
  NETWORK_SET_DEVELOPER_MODE = 'network_setDeveloperMode',
  NETWORK_GET_SUPPORTED_NETWORKS = 'network_getSupportedNetworks',
  NETWORK_GET_DEVELOPER_MODE = 'network_getDeveloperMode',

  ACCOUNT_GET_ACCOUNTS = 'account_get',
  ACCOUNT_SELECT = 'account_select',
  ACCOUNT_RENAME = 'account_rename',
  ACCOUNT_ADD = 'account_add',

  BALANCES_GET = 'balances_get',

  BRIDGE_GET_CONFIG = 'bridge_get_config',
  BRIDGE_GET_BTC_BALANCES = 'bridge_get_btc_balances',
  BRIDGE_GET_ETH_BALANCE = 'bridge_get_eth_balance',
  BRIDGE_GET_ETH_BALANCES = 'bridge_get_eth_balances',
  BRIDGE_TRANSFER_ASSET = 'bridge_transfer_asset',
  BRIDGE_SIGN_ISSUE_BTC = 'bridge_sign_issue_btc',

  WALLET_STATE = 'wallet_InitializeState',
  WALLET_UNENCRYPTED_MNEMONIC = 'wallet_getUnencryptedMnemonic',
  GET_WALLET_HISTORY = 'wallet_getHistory',

  LOCK_WALLET = 'lock_lock',
  UNLOCK_WALLET = 'lock_unlock',
  LOCK_CHANGE_PASSWORD = 'lock_changePassword',

  ACTION_GET = 'action_getAction',
  ACTION_UPDATE = 'action_updateAction',

  PERMISSIONS_ADD_DOMAIN = 'permissions_addDomain',
  PERMISSIONS_GET_PERMISSIONS = 'permissions_getPermissionsForDomain',
  PERMISSIONS_GET_ALL_PERMISSIONS = 'permissions_getAllPermissions',

  TRANSACTIONS_GET = 'transactions_getTransaction',
  TRANSACTIONS_UPDATE = 'transactions_updateTransaction',

  SEND_AVAX_VALIDATE = 'send_validateSendAvaxState',
  SEND_AVAX_RESET = 'send_resetSendAvaxState',
  SEND_AVAX_SUBMIT = 'send_submitSendAvaxState',

  SEND_ANT_VALIDATE = 'send_validateSendAntState',
  SEND_ANT_RESET = 'send_resetSendAntState',
  SEND_ANT_SUBMIT = 'send_submitSendAntState',

  SEND_BTC_VALIDATE = 'send_validateSendBtcState',
  SEND_BTC_RESET = 'send_resetSendBtcState',
  SEND_BTC_SUBMIT = 'send_submitSendBtcState',

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
  SETTINGS_SET_ANALYTICS_CONSENT = 'settings_set_analytics_consent',

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

  NETWORK_FEE_GET = 'network_fee_get',

  LEDGER_INIT_TRANSPORT = 'ledger_init_transport',
  LEDGER_HAS_TRANSPORT = 'ledger_has_transport',
  LEDGER_GET_PUBLIC = 'ledger_get_public',
  LEDGER_RESPONSE = 'ledger_response',

  NAVIGATION_HISTORY_GET = 'navigation_history_get',
  NAVIGATION_HISTORY_SET = 'navigation_history_set',
  NAVIGATION_HISTORY_DATA_GET = 'navigation_history_data_get',
  NAVIGATION_HISTORY_DATA_SET = 'navigation_history_data_set',

  ANALYTICS_INIT_IDS = 'analytics_init_ids',
  ANALYTICS_STORE_IDS = 'analytics_store_ids',
  ANALYTICS_CLEAR_IDS = 'analytics_clear_ids',
  ANALYTICS_GET_IDS = 'analytics_get_ids',

  RESET_EXTENSION_STATE = 'reset_extension_state',
}
