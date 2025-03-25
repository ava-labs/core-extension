export enum FeatureGates {
  EVERYTHING = 'everything',
  EVENTS = 'events',
  SWAP = 'swap-feature',
  SWAP_C_CHAIN = 'swap-c-chain',
  SWAP_ETHEREUM = 'swap-ethereum',
  BRIDGE = 'bridge-feature',
  BRIDGE_ETH = 'bridge-feature-eth',
  BRIDGE_BTC = 'bridge-feature-btc',
  SEND = 'send-feature',
  SEND_P_CHAIN = 'send-p-chain',
  SEND_X_CHAIN = 'send-x-chain',
  SENDTRANSACTION_CHAIN_ID_SUPPORT = 'sendtransaction-chain-id-support-feature',
  BUY = 'buy',
  BUY_MOONPAY = 'buy-feature-moonpay',
  BUY_COINBASE = 'buy-feature-coinbase',
  KEYSTONE = 'keystone',
  NFT_MARKETPLACE = 'nft-marketplace',
  BOTTOM_NAVIGATION = 'bottom-navigation',
  DEFI = 'defi-feature',
  IMPORT_WALLET_CONNECT = 'import-wallet-connect',
  IMPORT_FIREBLOCKS = 'import-fireblocks',
  IN_APP_SUPPORT_P_CHAIN = 'in-app-support-p-chain',
  IN_APP_SUPPORT_X_CHAIN = 'in-app-support-x-chain',
  SEEDLESS_ONBOARDING = 'seedless-onboarding',
  SEEDLESS_ONBOARDING_GOOGLE = 'seedless-onboarding-google',
  SEEDLESS_ONBOARDING_APPLE = 'seedless-onboarding-apple',
  SEEDLESS_MFA_PASSKEY = 'seedless-mfa-passkey',
  SEEDLESS_MFA_AUTHENTICATOR = 'seedless-mfa-authenticator',
  SEEDLESS_MFA_YUBIKEY = 'seedless-mfa-yubikey',
  SEEDLESS_SIGNING = 'seedless-signing',
  SEEEDLESS_MFA_SETTINGS = 'seedless-mfa-settings',
  SEEDLESS_OPTIONAL_MFA = 'seedless-optional-mfa',
  UNIFIED_BRIDGE_CCTP = 'unified-bridge-cctp',
  UNIFIED_BRIDGE_ICTT = 'unified-bridge-ictt',
  UNIFIED_BRIDGE_AB_EVM = 'unified-bridge-ab-evm',
  UNIFIED_BRIDGE_AB_AVA_TO_BTC = 'unified-bridge-ab-ava-to-btc',
  UNIFIED_BRIDGE_AB_BTC_TO_AVA = 'unified-bridge-ab-btc-to-ava',
  DEBANK_TRANSACTION_PARSING = 'debank-transaction-parsing',
  DEBANK_TRANSACTION_PRE_EXECUTION = 'debank-transaction-pre-execution',
  PRIMARY_ACCOUNT_REMOVAL = 'primary-account-removal',
  ADD_WALLET_WITH_SEEDPHRASE = 'add-wallet-with-seedphrase',
  ADD_WALLET_WITH_KEYSTORE_FILE = 'add-wallet-with-keystore-file',
  ADD_WALLET_WITH_LEDGER = 'add-wallet-with-ledger',
  BLOCKAID_DAPP_SCAN = 'blockaid-dapp-scan',
  BLOCKAID_DAPP_SCAN_WARNING = 'blockaid-dapp-scan-warning',
  BLOCKAID_TRANSACTION_SCAN = 'blockaid-transaction-scan',
  BLOCKAID_JSONRPC_SCAN = 'blockaid-jsonrpc-scan',
  HALLIDAY_BRIDGE_BANNER = 'halliday-bridge-banner',
  FIREBASE_CLOUD_MESSAGING = 'firebase-cloud-messaging',
  ONE_CLICK_SWAP = 'one-click-swap',
  GASLESS = 'gasless',
}

// Posthog API does not return disabled flags on their `/decide` api endpoint
// Define disabled state values for the flags
export const DISABLED_FLAG_VALUES: FeatureFlags = {
  [FeatureGates.EVERYTHING]: false,
  [FeatureGates.EVENTS]: false,
  [FeatureGates.SWAP]: false,
  [FeatureGates.SWAP_C_CHAIN]: false,
  [FeatureGates.SWAP_ETHEREUM]: false,
  [FeatureGates.BRIDGE]: false,
  [FeatureGates.BRIDGE_ETH]: false,
  [FeatureGates.BRIDGE_BTC]: false,
  [FeatureGates.SEND]: false,
  [FeatureGates.SEND_P_CHAIN]: false,
  [FeatureGates.SEND_X_CHAIN]: false,
  [FeatureGates.SENDTRANSACTION_CHAIN_ID_SUPPORT]: false,
  [FeatureGates.BUY]: false,
  [FeatureGates.BUY_MOONPAY]: false,
  [FeatureGates.BUY_COINBASE]: false,
  [FeatureGates.KEYSTONE]: false,
  [FeatureGates.NFT_MARKETPLACE]: false,
  [FeatureGates.BOTTOM_NAVIGATION]: false,
  [FeatureGates.DEFI]: false,
  [FeatureGates.IMPORT_WALLET_CONNECT]: false,
  [FeatureGates.IMPORT_FIREBLOCKS]: false,
  [FeatureGates.IN_APP_SUPPORT_P_CHAIN]: false,
  [FeatureGates.IN_APP_SUPPORT_X_CHAIN]: false,
  [FeatureGates.SEEDLESS_ONBOARDING]: false,
  [FeatureGates.SEEDLESS_ONBOARDING_GOOGLE]: false,
  [FeatureGates.SEEDLESS_ONBOARDING_APPLE]: false,
  [FeatureGates.SEEDLESS_MFA_PASSKEY]: false,
  [FeatureGates.SEEDLESS_MFA_AUTHENTICATOR]: false,
  [FeatureGates.SEEDLESS_MFA_YUBIKEY]: false,
  [FeatureGates.SEEDLESS_SIGNING]: false,
  [FeatureGates.SEEEDLESS_MFA_SETTINGS]: false,
  [FeatureGates.SEEDLESS_OPTIONAL_MFA]: false,
  [FeatureGates.UNIFIED_BRIDGE_CCTP]: false,
  [FeatureGates.UNIFIED_BRIDGE_ICTT]: false,
  [FeatureGates.UNIFIED_BRIDGE_AB_EVM]: false,
  [FeatureGates.UNIFIED_BRIDGE_AB_AVA_TO_BTC]: false,
  [FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA]: false,
  [FeatureGates.DEBANK_TRANSACTION_PARSING]: false,
  [FeatureGates.DEBANK_TRANSACTION_PRE_EXECUTION]: false,
  [FeatureGates.PRIMARY_ACCOUNT_REMOVAL]: false,
  [FeatureGates.ADD_WALLET_WITH_SEEDPHRASE]: false,
  [FeatureGates.ADD_WALLET_WITH_KEYSTORE_FILE]: false,
  [FeatureGates.ADD_WALLET_WITH_LEDGER]: false,
  [FeatureGates.BLOCKAID_DAPP_SCAN]: false,
  [FeatureGates.BLOCKAID_DAPP_SCAN_WARNING]: false,
  [FeatureGates.BLOCKAID_TRANSACTION_SCAN]: false,
  [FeatureGates.BLOCKAID_JSONRPC_SCAN]: false,
  [FeatureGates.HALLIDAY_BRIDGE_BANNER]: false,
  [FeatureGates.FIREBASE_CLOUD_MESSAGING]: false,
  [FeatureGates.ONE_CLICK_SWAP]: false,
  [FeatureGates.GASLESS]: false,
};

// Default flags are used when posthog is not available
export const DEFAULT_FLAGS: FeatureFlags = {
  [FeatureGates.EVERYTHING]: true,
  [FeatureGates.EVENTS]: true,
  [FeatureGates.SWAP]: true,
  [FeatureGates.SWAP_C_CHAIN]: true,
  [FeatureGates.SWAP_ETHEREUM]: true,
  [FeatureGates.BRIDGE]: true,
  [FeatureGates.BRIDGE_ETH]: true,
  [FeatureGates.BRIDGE_BTC]: true,
  [FeatureGates.SEND]: true,
  [FeatureGates.SEND_P_CHAIN]: true,
  [FeatureGates.SEND_X_CHAIN]: true,
  [FeatureGates.SENDTRANSACTION_CHAIN_ID_SUPPORT]: true,
  [FeatureGates.BUY]: true,
  [FeatureGates.BUY_MOONPAY]: true,
  [FeatureGates.BUY_COINBASE]: true,
  [FeatureGates.KEYSTONE]: true,
  [FeatureGates.NFT_MARKETPLACE]: true,
  [FeatureGates.BOTTOM_NAVIGATION]: true,
  [FeatureGates.DEFI]: true,
  [FeatureGates.IMPORT_WALLET_CONNECT]: true,
  [FeatureGates.IMPORT_FIREBLOCKS]: true,
  [FeatureGates.IN_APP_SUPPORT_P_CHAIN]: true,
  [FeatureGates.IN_APP_SUPPORT_X_CHAIN]: true,
  [FeatureGates.SEEDLESS_ONBOARDING]: true,
  [FeatureGates.SEEDLESS_ONBOARDING_GOOGLE]: true,
  [FeatureGates.SEEDLESS_ONBOARDING_APPLE]: true,
  [FeatureGates.SEEDLESS_MFA_PASSKEY]: true,
  [FeatureGates.SEEDLESS_MFA_AUTHENTICATOR]: true,
  [FeatureGates.SEEDLESS_MFA_YUBIKEY]: true,
  [FeatureGates.SEEDLESS_SIGNING]: true,
  [FeatureGates.SEEEDLESS_MFA_SETTINGS]: true,
  [FeatureGates.SEEDLESS_OPTIONAL_MFA]: true,
  [FeatureGates.UNIFIED_BRIDGE_CCTP]: true,
  [FeatureGates.UNIFIED_BRIDGE_ICTT]: true,
  [FeatureGates.UNIFIED_BRIDGE_AB_EVM]: true,
  [FeatureGates.UNIFIED_BRIDGE_AB_AVA_TO_BTC]: true,
  [FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA]: true,
  [FeatureGates.DEBANK_TRANSACTION_PARSING]: false,
  [FeatureGates.DEBANK_TRANSACTION_PRE_EXECUTION]: false,
  [FeatureGates.PRIMARY_ACCOUNT_REMOVAL]: true,
  [FeatureGates.ADD_WALLET_WITH_SEEDPHRASE]: true,
  [FeatureGates.ADD_WALLET_WITH_KEYSTORE_FILE]: true,
  [FeatureGates.ADD_WALLET_WITH_LEDGER]: true,
  [FeatureGates.BLOCKAID_DAPP_SCAN]: true,
  [FeatureGates.BLOCKAID_DAPP_SCAN_WARNING]: true,
  [FeatureGates.BLOCKAID_TRANSACTION_SCAN]: true,
  [FeatureGates.BLOCKAID_JSONRPC_SCAN]: true,
  [FeatureGates.HALLIDAY_BRIDGE_BANNER]: true,
  [FeatureGates.FIREBASE_CLOUD_MESSAGING]: true,
  [FeatureGates.ONE_CLICK_SWAP]: true,
  [FeatureGates.GASLESS]: true,
};

export enum FeatureFlagEvents {
  FEATURE_FLAG_UPDATED = 'FeatureFlagEvents: FEATURE_FLAG_UPDATED',
}

export type FeatureFlags = Record<FeatureGates, boolean>;

export const FEATURE_FLAGS_OVERRIDES_KEY = '__feature-flag-overrides__';
