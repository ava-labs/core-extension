import { ServiceType } from '@avalabs/unified-asset-transfer';
import { type FeatureFlags, FeatureGates } from '@core/types';
import { memoize } from 'lodash';

export const getEnabledTransferServices = memoize(
  (featureFlags: Partial<FeatureFlags>): ServiceType[] => {
    // If the Fusion feature flag is not enabled, we don't initialize any transfer services.
    if (!featureFlags[FeatureGates.FUSION_FEATURE]) {
      return [];
    }

    const enabled: ServiceType[] = [];

    if (featureFlags[FeatureGates.FUSION_MARKR]) {
      enabled.push(ServiceType.MARKR);
    }

    if (featureFlags[FeatureGates.FUSION_AVALANCHE_EVM]) {
      enabled.push(ServiceType.AVALANCHE_EVM);
    }

    if (featureFlags[FeatureGates.FUSION_LOMBARD_BTC_TO_AVA]) {
      enabled.push(ServiceType.LOMBARD_BTC_TO_BTCB);
    }

    if (featureFlags[FeatureGates.FUSION_LOMBARD_AVA_TO_BTC]) {
      enabled.push(ServiceType.LOMBARD_BTCB_TO_BTC);
    }

    return enabled;
  },
);
