import { FeatureGates } from '@avalabs/posthog-sdk';

export const DEFAULT_FLAGS = {
  [FeatureGates.EVERYTHING]: true,
  [FeatureGates.EVENTS]: true,
  [FeatureGates.SWAP]: true,
  [FeatureGates.BRIDGE]: true,
  [FeatureGates.BRIDGE_ETH]: true,
  [FeatureGates.BRIDGE_BTC]: true,
  [FeatureGates.SEND]: true,
  [FeatureGates.SENDTRANSACTION_CHAIN_ID_SUPPORT]: true,
  [FeatureGates.BUY]: true,
  [FeatureGates.BUY_MOONPAY]: true,
  [FeatureGates.BUY_COINBASE]: true,
  [FeatureGates.KEYSTONE]: true,
  [FeatureGates.NFT_MARKETPLACE]: true,
  [FeatureGates.BOTTOM_NAVIGATION]: true,
  [FeatureGates.DEFI]: true,
  [FeatureGates.IMPORT_WALLET_CONNECT]: true,
};

export enum FeatureFlagEvents {
  FEATURE_FLAG_UPDATED = 'FeatureFlagEvents: FEATURE_FLAG_UPDATED',
}

export type FeatureFlags = Record<FeatureGates, boolean>;

export const FEATURE_FLAGS_OVERRIDES_KEY = '__feature-flag-overrides__';
