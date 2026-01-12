import { BridgeType } from '@avalabs/bridge-unified';
import { type FeatureFlags, FeatureGates } from '@core/types';

export const getEnabledBridgeTypes = (featureFlags: Partial<FeatureFlags>) => {
  const enabled: BridgeType[] = [
    BridgeType.LOMBARD_BTC_TO_BTCB,
    BridgeType.LOMBARD_BTCB_TO_BTC,
  ];

  if (featureFlags[FeatureGates.UNIFIED_BRIDGE_CCTP]) {
    enabled.push(BridgeType.CCTP);
  }
  if (featureFlags[FeatureGates.UNIFIED_BRIDGE_ICTT]) {
    enabled.push(BridgeType.ICTT_ERC20_ERC20);
  }
  if (featureFlags[FeatureGates.UNIFIED_BRIDGE_AB_EVM]) {
    enabled.push(BridgeType.AVALANCHE_EVM);
  }
  if (featureFlags[FeatureGates.UNIFIED_BRIDGE_LOMBARD_BTC_TO_AVA]) {
    enabled.push(BridgeType.LOMBARD_BTC_TO_BTCB);
  } else if (featureFlags[FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA]) {
    // Make sure to not enable both at the same time
    enabled.push(BridgeType.AVALANCHE_BTC_AVA);
  }

  if (featureFlags[FeatureGates.UNIFIED_BRIDGE_LOMBARD_AVA_TO_BTC]) {
    enabled.push(BridgeType.LOMBARD_BTCB_TO_BTC);
  } else if (featureFlags[FeatureGates.UNIFIED_BRIDGE_AB_AVA_TO_BTC]) {
    // Make sure to not enable both at the same time
    enabled.push(BridgeType.AVALANCHE_AVA_BTC);
  }

  return enabled;
};
