import { ServiceType } from '@avalabs/unified-asset-transfer';
import { type FeatureFlags, FeatureGates } from '@core/types';
import { memoize } from 'lodash';

const getEnabledTransferServicesRaw = (
  featureFlags: Partial<FeatureFlags>,
): ServiceType[] => {
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
};

export const getEnabledTransferServices = memoize(
  getEnabledTransferServicesRaw,
);
