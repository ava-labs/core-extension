import { useMemo } from 'react';
import { ChainId, SolanaCaip2ChainId } from '@avalabs/core-chains-sdk';

import { FeatureGates, NetworkWithCaipId } from '@core/types';
import { useFeatureFlagContext, useNetworkContext } from '@core/ui';

export const useSwapEnabledNetworks = (): NetworkWithCaipId[] => {
  const { getNetwork } = useNetworkContext();
  const { isFlagEnabled } = useFeatureFlagContext();

  return useMemo(() => {
    if (!isFlagEnabled(FeatureGates.SWAP)) {
      return [];
    }

    const chains: NetworkWithCaipId[] = [];

    if (isFlagEnabled(FeatureGates.SWAP_C_CHAIN)) {
      const cChain = getNetwork(ChainId.AVALANCHE_MAINNET_ID);
      if (cChain) chains.push(cChain);
    }

    if (isFlagEnabled(FeatureGates.SWAP_ETHEREUM)) {
      const ethereum = getNetwork(ChainId.ETHEREUM_HOMESTEAD);
      if (ethereum) chains.push(ethereum);
    }

    if (isFlagEnabled(FeatureGates.SWAP_SOLANA)) {
      const solana = getNetwork(SolanaCaip2ChainId.MAINNET);
      if (solana) chains.push(solana);
    }

    return chains;
  }, [getNetwork, isFlagEnabled]);
};
