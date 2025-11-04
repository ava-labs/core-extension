import { z } from 'zod';
import { FeatureGates, FeatureVars } from '@core/types';

/**
 * Zod schema for FeatureFlags
 * Validates that all FeatureGates are booleans and all FeatureVars are strings
 * When the flag is not present, it is considered disabled
 */
export const featureFlagsSchema = z.object({
  // FeatureGates - all boolean values
  [FeatureGates.EVERYTHING]: z.boolean().optional(),
  [FeatureGates.EVENTS]: z.boolean().optional(),
  [FeatureGates.SWAP]: z.boolean().optional(),
  [FeatureGates.SWAP_C_CHAIN]: z.boolean().optional(),
  [FeatureGates.SWAP_ETHEREUM]: z.boolean().optional(),
  [FeatureGates.SWAP_SOLANA]: z.boolean().optional(),
  [FeatureGates.SWAP_FEES]: z.boolean().optional(),
  [FeatureGates.SWAP_FEES_JUPITER]: z.boolean().optional(),
  [FeatureGates.BRIDGE]: z.boolean().optional(),
  [FeatureGates.BRIDGE_ETH]: z.boolean().optional(),
  [FeatureGates.BRIDGE_BTC]: z.boolean().optional(),
  [FeatureGates.SEND]: z.boolean().optional(),
  [FeatureGates.SEND_P_CHAIN]: z.boolean().optional(),
  [FeatureGates.SEND_X_CHAIN]: z.boolean().optional(),
  [FeatureGates.SENDTRANSACTION_CHAIN_ID_SUPPORT]: z.boolean().optional(),
  [FeatureGates.BUY]: z.boolean().optional(),
  [FeatureGates.BUY_MOONPAY]: z.boolean().optional(),
  [FeatureGates.BUY_COINBASE]: z.boolean().optional(),
  [FeatureGates.KEYSTONE]: z.boolean().optional(),
  [FeatureGates.KEYSTONE_3]: z.boolean().optional(),
  [FeatureGates.NFT_MARKETPLACE]: z.boolean().optional(),
  [FeatureGates.BOTTOM_NAVIGATION]: z.boolean().optional(),
  [FeatureGates.DEFI]: z.boolean().optional(),
  [FeatureGates.IMPORT_WALLET_CONNECT]: z.boolean().optional(),
  [FeatureGates.IMPORT_FIREBLOCKS]: z.boolean().optional(),
  [FeatureGates.IN_APP_SUPPORT_P_CHAIN]: z.boolean().optional(),
  [FeatureGates.IN_APP_SUPPORT_X_CHAIN]: z.boolean().optional(),
  [FeatureGates.SEEDLESS_ONBOARDING]: z.boolean().optional(),
  [FeatureGates.SEEDLESS_ONBOARDING_GOOGLE]: z.boolean().optional(),
  [FeatureGates.SEEDLESS_ONBOARDING_APPLE]: z.boolean().optional(),
  [FeatureGates.SEEDLESS_MFA_PASSKEY]: z.boolean().optional(),
  [FeatureGates.SEEDLESS_MFA_AUTHENTICATOR]: z.boolean().optional(),
  [FeatureGates.SEEDLESS_MFA_YUBIKEY]: z.boolean().optional(),
  [FeatureGates.SEEDLESS_SIGNING]: z.boolean().optional(),
  [FeatureGates.SEEEDLESS_MFA_SETTINGS]: z.boolean().optional(),
  [FeatureGates.SEEDLESS_OPTIONAL_MFA]: z.boolean().optional(),
  [FeatureGates.UNIFIED_BRIDGE_CCTP]: z.boolean().optional(),
  [FeatureGates.UNIFIED_BRIDGE_ICTT]: z.boolean().optional(),
  [FeatureGates.UNIFIED_BRIDGE_AB_EVM]: z.boolean().optional(),
  [FeatureGates.UNIFIED_BRIDGE_AB_AVA_TO_BTC]: z.boolean().optional(),
  [FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA]: z.boolean().optional(),
  [FeatureGates.DEBANK_TRANSACTION_PARSING]: z.boolean().optional(),
  [FeatureGates.DEBANK_TRANSACTION_PRE_EXECUTION]: z.boolean().optional(),
  [FeatureGates.PRIMARY_ACCOUNT_REMOVAL]: z.boolean().optional(),
  [FeatureGates.ADD_WALLET_WITH_SEEDPHRASE]: z.boolean().optional(),
  [FeatureGates.ADD_WALLET_WITH_KEYSTORE_FILE]: z.boolean().optional(),
  [FeatureGates.ADD_WALLET_WITH_LEDGER]: z.boolean().optional(),
  [FeatureGates.BLOCKAID_DAPP_SCAN]: z.boolean().optional(),
  [FeatureGates.BLOCKAID_DAPP_SCAN_WARNING]: z.boolean().optional(),
  [FeatureGates.BLOCKAID_TRANSACTION_SCAN]: z.boolean().optional(),
  [FeatureGates.BLOCKAID_JSONRPC_SCAN]: z.boolean().optional(),
  [FeatureGates.HALLIDAY_BRIDGE_BANNER]: z.boolean().optional(),
  [FeatureGates.FIREBASE_CLOUD_MESSAGING]: z.boolean().optional(),
  [FeatureGates.ONE_CLICK_SWAP]: z.boolean().optional(),
  [FeatureGates.GASLESS]: z.boolean().optional(),
  [FeatureGates.SOLANA_SUPPORT]: z.boolean().optional(),
  [FeatureGates.SOLANA_LAUNCH_MODAL]: z.boolean().optional(),
  [FeatureGates.CORE_ASSISTANT]: z.boolean().optional(),
  [FeatureGates.SWAP_USE_MARKR]: z.boolean().optional(),
  // FeatureVars - all string values
  [FeatureVars.MARKR_SWAP_GAS_BUFFER]: z.string().optional(),
});

/**
 * Zod schema for PostHog response structure
 * Validates the full response from PostHog's /decide endpoint
 */
export const posthogResponseSchema = z.object({
  featureFlags: featureFlagsSchema,
  featureFlagPayloads: z.record(z.string()).optional(),
});
