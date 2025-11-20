import { useMemo } from 'react';
import { useBalancesContext, useNetworkContext } from '../contexts';
import { useAccountsContext } from '../contexts';
import { NftTokenWithBalance } from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';
import { getAddressForChain } from '@core/common';

export const useNfts = (network?: NetworkWithCaipId) => {
  const { balances } = useBalancesContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { network: currentNetwork } = useNetworkContext();

  return useMemo<{
    collectibles: NftTokenWithBalance[];
    loading: boolean;
    error: string | undefined;
  }>(() => {
    if (!balances.nfts || !activeAccount) {
      return {
        collectibles: [],
        loading: balances.loading,
        error: balances.error,
      };
    }

    if (network) {
      const userAddress = getAddressForChain(network, activeAccount);

      if (!userAddress) {
        return {
          collectibles: [],
          loading: balances.loading,
          error: balances.error,
        };
      }

      return {
        collectibles: Object.values(
          balances.nfts?.[network.chainId]?.[userAddress] ?? {},
        ),
        loading: balances.loading,
        error: balances.error,
      };
    }

    if (!currentNetwork) {
      return {
        collectibles: [],
        loading: false,
        error: undefined,
      };
    }

    const activeChainId = currentNetwork.chainId;
    const userAddress = getAddressForChain(currentNetwork, activeAccount);

    return {
      collectibles: Object.values(
        balances.nfts?.[activeChainId]?.[userAddress] ?? {},
      ),
      loading: balances.loading,
      error: balances.error,
    };
  }, [network, balances, activeAccount, currentNetwork]);
};
