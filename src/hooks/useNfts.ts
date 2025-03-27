import { useMemo } from 'react';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { getAddressForChain } from '@src/utils/getAddressForChain';
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
