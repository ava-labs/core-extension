import { useMemo } from 'react';
import { useBalancesContext } from '@/contexts/BalancesProvider';
import { useAccountsContext } from '@/contexts/AccountsProvider';
import { useNetworkContext } from '@/contexts/NetworkProvider';
import { getAddressForChain } from '@core/common';
import { NftTokenWithBalance } from '@avalabs/vm-module-types';

export const useNfts = () => {
  const { balances } = useBalancesContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { network } = useNetworkContext();

  return useMemo<NftTokenWithBalance[]>(() => {
    if (!network || !balances.nfts || !activeAccount) {
      return [];
    }
    const userAddress = getAddressForChain(network, activeAccount);

    if (!userAddress) {
      return [];
    }

    return Object.values(balances.nfts?.[network.chainId]?.[userAddress] ?? {});
  }, [network, balances.nfts, activeAccount]);
};
