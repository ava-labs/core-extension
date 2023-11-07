import { Blockchain } from '@avalabs/bridge-sdk';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { useEffect, useState } from 'react';
import { SUPPORTED_CHAINS } from '../models';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import {
  isFireblocksAccount,
  isWalletConnectAccount,
} from '@src/background/services/accounts/utils/typeGuards';
import isFireblocksApiSupported from '@src/background/services/fireblocks/utils/isFireblocksApiSupported';

export function useAvailableBlockchains() {
  const { featureFlags } = useFeatureFlagContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const [availableBlockchains, setAvailableBlockchains] =
    useState<Blockchain[]>(SUPPORTED_CHAINS);

  // Remove chains turned off by the feature flags and
  // switch chain in case the selected one is not available
  useEffect(() => {
    const availableChains = SUPPORTED_CHAINS.filter((chain) => {
      switch (chain) {
        case Blockchain.BITCOIN:
          if (!featureFlags[FeatureGates.BRIDGE_BTC]) {
            return false;
          }

          if (isWalletConnectAccount(activeAccount)) {
            return false;
          }

          if (isFireblocksAccount(activeAccount)) {
            return isFireblocksApiSupported(activeAccount);
          }

          return true;
        case Blockchain.ETHEREUM:
          return featureFlags[FeatureGates.BRIDGE_ETH];
        default:
          return true;
      }
    });

    setAvailableBlockchains(availableChains);
  }, [featureFlags, activeAccount]);

  return availableBlockchains;
}
