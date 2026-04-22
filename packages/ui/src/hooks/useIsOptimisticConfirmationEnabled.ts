import { utils } from '@avalabs/avalanchejs';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { useCallback, useMemo } from 'react';

import { NetworkWithCaipId } from '@core/types';
import { isAvalanchePrimaryNetwork } from '@core/common';

import { useNetworkContext } from '../contexts';

export const useIsOptimisticConfirmationEnabled = () => {
  const { isDeveloperMode } = useNetworkContext();

  const provider = useMemo(
    () =>
      isDeveloperMode
        ? Avalanche.JsonRpcProvider.getDefaultFujiProvider()
        : Avalanche.JsonRpcProvider.getDefaultMainnetProvider(),
    [isDeveloperMode],
  );

  return useCallback(
    async (network?: NetworkWithCaipId) => {
      const isAvalanche = network && isAvalanchePrimaryNetwork(network);

      if (!isAvalanche) {
        return false;
      }

      const upgradesInfo = await provider.getInfo().getUpgradesInfo();

      // Only use optimistic confirmations before Helicon is enabled,
      // as this upgrade will introduce ACP-194, after which optimistic
      // confirmations should no longer be needed.
      // TODO: Remove all of these checks once Helicon is enabled.
      return !utils.isHeliconEnabled(upgradesInfo);
    },
    [provider],
  );
};
