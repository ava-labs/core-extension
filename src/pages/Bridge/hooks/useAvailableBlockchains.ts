import { Blockchain } from '@avalabs/bridge-sdk';
import { FeatureGates } from '@avalabs/posthog-sdk';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { useEffect, useState } from 'react';
import { SUPPORTED_CHAINS } from '../models';

export function useAvailableBlockchains() {
  const { featureFlags } = useFeatureFlagContext();
  const [availableBlockchains, setAvailableBlockchains] =
    useState<Blockchain[]>(SUPPORTED_CHAINS);

  // Remove chains turned off by the feature flags and
  // switch chain in case the selected one is not available
  useEffect(() => {
    const availableChains = SUPPORTED_CHAINS.filter((chain) => {
      switch (chain) {
        case Blockchain.BITCOIN:
          return featureFlags[FeatureGates.BRIDGE_BTC];
        case Blockchain.ETHEREUM:
          return featureFlags[FeatureGates.BRIDGE_ETH];
        default:
          return true;
      }
    });

    setAvailableBlockchains(availableChains);
  }, [featureFlags]);

  return availableBlockchains;
}
