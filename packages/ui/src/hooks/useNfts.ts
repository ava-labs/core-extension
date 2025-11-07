import { useMemo } from 'react';
import { useBalancesContext } from '../contexts';
import { useAccountsContext } from '../contexts';
import { NftTokenWithBalance } from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';

export const useNfts = (network?: NetworkWithCaipId) => {
  const { balances } = useBalancesContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

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
    // const userAddress = getAddressForChain(network, activeAccount);
    const userAddress = '0xe3da71823db3f0dffa7df0117cc2604127101c79';

    if (network) {
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

    return {
      collectibles: Object.values(balances.nfts ?? {}).flatMap(
        (chainBalances) =>
          userAddress ? Object.values(chainBalances?.[userAddress] ?? {}) : [],
      ),
      loading: balances.loading,
      error: balances.error,
    };
  }, [network, balances, activeAccount]);
};
