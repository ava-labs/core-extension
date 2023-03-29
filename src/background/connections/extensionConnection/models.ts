export enum ExtensionRequest {
  ONBOARDING_GET_STATE = 'onboarding_getIsOnBoarded',
  ONBOARDING_SUBMIT = 'onboarding_submit',
  ONBOARDING_INITIAL_WALLET_OPEN = 'onboarding_initial_wallet_open',

  NETWORK_SET_SELECTED = 'network_setSelectedNetwork',
  NETWORK_SET_DEVELOPER_MODE = 'network_setDeveloperMode',
  NETWORK_ADD_FAVORITE_NETWORK = 'network_add_favorite_networks',
  NETWORK_REMOVE_FAVORITE_NETWORK = 'network_remove_favorite_network',
  NETWORK_SAVE_CUSTOM = 'network_saveCustomNetwork',
  NETWORK_REMOVE_CUSTOM = 'network_removeCustomNetwork',
  NETWORKS_GET_STATE = 'networks_get_state',
  NETWORK_AVALANCHE_GET = 'network_avalanche_get',

  ACCOUNT_GET_ACCOUNTS = 'account_get',
  ACCOUNT_SELECT = 'account_select',
  ACCOUNT_RENAME = 'account_rename',
  ACCOUNT_ADD = 'account_add',
  ACCOUNT_DELETE = 'account_delete',

  BALANCES_GET = 'balances_get',
  BALANCES_START_POLLING = 'balances_start_polling',
  BALANCES_STOP_POLLING = 'balances_stop_polling',
  NETWORK_BALANCES_UPDATE = 'network_balances_update',
  NFT_BALANCES_GET = 'nft_balances_get',
  TOKEN_PRICE_GET = 'token_price_get',
  BALANCE_AVAX_GET = 'balance_avax_get',

  BRIDGE_GET_CONFIG = 'bridge_get_config',

  BRIDGE_GET_STATE = 'bridge_get_state',
  BRIDGE_TRANSFER_ASSET = 'bridge_transfer_asset',
  BRIDGE_TRANSACTION_CREATE = 'bridge_transaction_create',
  BRIDGE_TRANSACTION_REMOVE = 'bridge_transaction_remove',
  BRIDGE_SET_IS_DEV_ENV = 'bridge_set_is_dev_env',
  BRIDGE_GET_ETH_MAX_TRANSFER_AMOUNT = 'bridge_get_eth_max_transfer_amount',

  WALLET_GET_DETAILS = 'wallet_getDetails',
  WALLET_UNENCRYPTED_MNEMONIC = 'wallet_getUnencryptedMnemonic',
  WALLET_GET_BTC_WALLET_POLICY_DETAILS = 'wallet_getBtcWalletPolicyDetails',
  WALLET_STORE_BTC_WALLET_POLICY_DETAILS = 'wallet_storeBtcWalletPolicyDetails',
  GET_WALLET_HISTORY = 'wallet_getHistory',

  LOCK_WALLET = 'lock_lock',
  UNLOCK_WALLET = 'lock_unlock',
  LOCK_GET_STATE = 'lock_getState',
  LOCK_CHANGE_PASSWORD = 'lock_changePassword',

  ACTION_GET = 'action_getAction',
  ACTION_UPDATE = 'action_updateAction',

  PERMISSIONS_ADD_DOMAIN = 'permissions_addDomain',
  PERMISSIONS_GET_PERMISSIONS = 'permissions_getPermissionsForDomain',
  PERMISSIONS_GET_ALL_PERMISSIONS = 'permissions_getAllPermissions',

  TRANSACTIONS_GET = 'transactions_getTransaction',
  TRANSACTIONS_UPDATE = 'transactions_updateTransaction',

  SEND_VALIDATE = 'send_validate',
  SEND_SUBMIT = 'send_submit',

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
  SETTINGS_SET_LANGUAGE = 'settings_set_language',

  CONTACTS_GET = 'contacts_get',
  CONTACTS_CREATE = 'contacts_create',
  CONTACTS_UPDATE = 'contacts_update',
  CONTACTS_REMOVE = 'contacts_remove',

  FAVORITES_CREATE = 'favorites_create',
  FAVORITES_REMOVE = 'favorites_remove',
  FAVORITES_GET = 'favorites_get',

  SWAP_GET_RATE = 'swap_get_rate',
  SWAP_PERFORM = 'swap_perform',

  NETWORK_FEE_GET = 'network_fee_get',

  LEDGER_INIT_TRANSPORT = 'ledger_init_transport',
  LEDGER_HAS_TRANSPORT = 'ledger_has_transport',
  LEDGER_RESPONSE = 'ledger_response',
  LEDGER_REMOVE_TRANSPORT = 'ledger_remove_transport',
  LEDGER_CLOSE_TRANSPORT = 'ledger_close_transport',
  SHOW_LEDGER_VERSION_WARNING = 'show_ledger_version_warning',
  LEDGER_VERSION_WARNING_CLOSED = 'ledger_version_warning_closed',
  LEDGER_MIGRATE_MISSING_PUBKEYS = 'ledger_migrate_missing_pubkeys',

  KEYSTONE_SUBMIT_SIGNATURE = 'keystone_submit_signature',

  NAVIGATION_HISTORY_GET = 'navigation_history_get',
  NAVIGATION_HISTORY_SET = 'navigation_history_set',
  NAVIGATION_HISTORY_DATA_GET = 'navigation_history_data_get',
  NAVIGATION_HISTORY_DATA_SET = 'navigation_history_data_set',

  ANALYTICS_INIT_IDS = 'analytics_init_ids',
  ANALYTICS_STORE_IDS = 'analytics_store_ids',
  ANALYTICS_CLEAR_IDS = 'analytics_clear_ids',
  ANALYTICS_GET_IDS = 'analytics_get_ids',
  ANALYTICS_CAPTURE_EVENT = 'analytics_capture_event',

  FEATURE_FLAGS_GET = 'feature_flags_get',

  RESET_EXTENSION_STATE = 'reset_extension_state',

  HISTORY_GET = 'history_get',
}
