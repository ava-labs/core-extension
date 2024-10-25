export enum ExtensionRequest {
  ONBOARDING_GET_STATE = 'onboarding_getIsOnBoarded',
  ONBOARDING_SUBMIT = 'onboarding_submit',
  ONBOARDING_INITIAL_WALLET_OPEN = 'onboarding_initial_wallet_open',
  MNEMONIC_ONBOARDING_SUBMIT = 'mnemonic_onboarding_submit',
  SEEDLESS_ONBOARDING_SUBMIT = 'seedless_onboarding_submit',
  KEYSTONE_ONBOARDING_SUBMIT = 'keystone_onboarding_submit',
  LEDGER_ONBOARDING_SUBMIT = 'ledger_onboarding_submit',

  NETWORK_SET_ACTIVE = 'network_setActiveNetwork',
  NETWORK_SET_DEVELOPER_MODE = 'network_setDeveloperMode',
  NETWORK_ADD_FAVORITE_NETWORK = 'network_add_favorite_networks',
  NETWORK_REMOVE_FAVORITE_NETWORK = 'network_remove_favorite_network',
  NETWORK_SAVE_CUSTOM = 'network_saveCustomNetwork',
  NETWORK_REMOVE_CUSTOM = 'network_removeCustomNetwork',
  NETWORKS_GET_STATE = 'networks_get_state',
  NETWORK_UPDATE_DEFAULT = 'network_update_default',

  ACCOUNT_GET_ACCOUNTS = 'account_get',
  ACCOUNT_SELECT = 'account_select',
  ACCOUNT_ADD = 'account_add',
  ACCOUNT_DELETE = 'account_delete',
  ACCOUNT_GET_PRIVATEKEY = 'account_get_privatekey',

  BALANCES_GET = 'balances_get',
  BALANCES_START_POLLING = 'balances_start_polling',
  BALANCES_STOP_POLLING = 'balances_stop_polling',
  NETWORK_BALANCES_UPDATE = 'network_balances_update',
  NFT_BALANCES_GET = 'nft_balances_get',
  NFT_REFRESH_METADATA = 'nft_refresh_metadata',
  TOKEN_PRICE_GET = 'token_price_get',
  BALANCE_AVAX_GET = 'balance_avax_get',

  BRIDGE_GET_CONFIG = 'bridge_get_config',

  BRIDGE_GET_STATE = 'bridge_get_state',
  BRIDGE_TRANSFER_ASSET = 'bridge_transfer_asset',
  BRIDGE_TRANSACTION_CREATE = 'bridge_transaction_create',
  BRIDGE_TRANSACTION_REMOVE = 'bridge_transaction_remove',
  BRIDGE_SET_IS_DEV_ENV = 'bridge_set_is_dev_env',
  BRIDGE_GET_ETH_MAX_TRANSFER_AMOUNT = 'bridge_get_eth_max_transfer_amount',
  BRIDGE_ESTIMATE_GAS = 'bridge_estimate_gas',

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
  ACTION_UPDATE_TX_DATA = 'action_updateTxData',

  PERMISSIONS_ADD_DOMAIN = 'permissions_addDomain',
  PERMISSIONS_GET_PERMISSIONS = 'permissions_getPermissionsForDomain',
  PERMISSIONS_GET_ALL_PERMISSIONS = 'permissions_getAllPermissions',

  TRANSACTIONS_GET = 'transactions_getTransaction',
  TRANSACTIONS_UPDATE = 'transactions_updateTransaction',

  SEND_VALIDATE = 'send_validate',
  SEND_SUBMIT = 'send_submit',

  SETTINGS_GET = 'settings_get',
  SETTINGS_UPDATE_COLLECTIBLES_VISIBILITY = 'settings_update_collectibles_visibility',
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

  DEFI_GET_PORTFOLIO = 'defi_get_portfolio',

  CURRENCIES_GET_EXCHANGE_RATES = 'currencies_get_exchange_rates',

  GET_NETWORK_TOKENS = 'get_network_tokens',

  WALLET_CONNECT_ESTABLISH_REQUIRED_SESSION = 'wallet_connect_establish_required_session',
  WALLET_CONNECT_IMPORT_ACCOUNT = 'wallet_connect_import_account',

  FIREBLOCKS_UPDATE_API_CREDENTIALS = 'fireblocks_update_api_credentials',

  SEEDLESS_UPDATE_SIGNER_TOKEN = 'seedless_update_signer_token',
  SEEDLESS_HAS_TOKEN_EXPIRED = 'seedless_has_token_expired',
  SEEDLESS_INIT_RECOVERY_PHRASE_EXPORT = 'seedless_init_recovery_phrase_export',
  SEEDLESS_CANCEL_RECOVERY_PHRASE_EXPORT = 'seedless_cancel_recovery_phrase_export',
  SEEDLESS_GET_RECOVERY_PHRASE_EXPORT_STATE = 'seedless_get_recovery_phrase_export_state',
  SEEDLESS_COMPLETE_RECOVERY_PHRASE_EXPORT = 'seedless_complete_recovery_phrase_export',
  SEEDLESS_SUBMIT_MFA_RESPONSE = 'seedless_submit_mfa_response',
  SEEDLESS_GET_RECOVERY_METHODS = 'seedless_get_recovery_methods',
  SEEDLESS_INIT_AUTHENTICATOR_CHANGE = 'seedless_init_authenticator_change',
  SEEDLESS_COMPLETE_AUTHENTICATOR_CHANGE = 'seedless_complete_authenticator_change',
  SEEDLESS_CHOOSE_MFA_METHOD = 'seedless_choose_mfa_method',
  SEEDLESS_ADD_FIDO_DEVICE = 'seedless_add_fido_device',
  SEEDLESS_REMOVE_FIDO_DEVICE = 'seedless_remove_fido_device',
  SEEDLESS_REMOVE_TOTP = 'seedless_remove_totp',

  UNIFIED_BRIDGE_GET_FEE = 'unified_bridge_get_fee',
  UNIFIED_BRIDGE_ESTIMATE_GAS = 'unified_bridge_estimate_gas',
  UNIFIED_BRIDGE_TRANSFER_ASSET = 'unified_bridge_transfer_asset',
  UNIFIED_BRIDGE_TRACK_TRANSFER = 'unified_bridge_track_transfer',
  UNIFIED_BRIDGE_GET_STATE = 'unified_bridge_get_state',
  UNIFIED_BRIDGE_GET_ASSETS = 'unified_bridge_get_assets',

  WALLET_IMPORT_SEED_PHRASE = 'wallet_import_seed_phrase',
  WALLET_IMPORT_LEDGER = 'wallet_import_ledger',

  BLOCKAID_DAPP_SCAN = 'blockaid_dapp_scan',
}
