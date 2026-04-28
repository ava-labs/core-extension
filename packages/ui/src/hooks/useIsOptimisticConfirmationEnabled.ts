import { utils } from '@avalabs/avalanchejs';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { useCallback, useMemo } from 'react';

import { FeatureVars, NetworkWithCaipId } from '@core/types';
import { isAvalanchePrimaryNetwork } from '@core/common';

import { useFeatureFlagContext, useNetworkContext } from '../contexts';

export const useIsOptimisticConfirmationEnabled = () => {
  const { isDeveloperMode } = useNetworkContext();
  const { selectFeatureFlag } = useFeatureFlagContext();

  const provider = useMemo(
    () =>
      isDeveloperMode
        ? Avalanche.JsonRpcProvider.getDefaultFujiProvider()
        : Avalanche.JsonRpcProvider.getDefaultMainnetProvider(),
    [isDeveloperMode],
  );

  const overrideValue = selectFeatureFlag(FeatureVars.SAE_OVERRIDE);

  return useCallback(
    async (network?: NetworkWithCaipId) => {
      // If SAE is forced to be enabled, we disable optimistic confirmations
      if (overrideValue === 'enabled') {
        return false;
        // If SAE is forced to be disabled, we enable optimistic confirmations
      } else if (overrideValue === 'disabled') {
        return true;
      }

      /**
       * If SAE feature flag no override set, we look at the network state
       * to determine if optimistic confetti should be toggled on:
       *    - live -> optimistic confirmations disabled
       *    - not live -> optimistic confirmations enabled
       */
      const isAvalanche = network && isAvalanchePrimaryNetwork(network);

      if (!isAvalanche) {
        return false;
      }

      const upgradesInfo = await provider.getInfo().getUpgradesInfo();

      // Only use optimistic confirmations before Helicon is enabled,
      // as this upgrade will introduce ACP-194, after which optimistic
      // confirmations should no longer be needed.
      return !utils.isHeliconEnabled(upgradesInfo);
    },
    [provider, overrideValue],
  );
};
