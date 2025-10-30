import { useMemo } from 'react';
import { useBalancesContext } from '../contexts';
import { useAccountsContext } from '../contexts';
import { getAddressForChain } from '@core/common';
import { NftTokenWithBalance } from '@avalabs/vm-module-types';
import { NetworkWithCaipId } from '@core/types';

export const useNfts = (network?: NetworkWithCaipId) => {
  const { balances } = useBalancesContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  return useMemo<NftTokenWithBalance[]>(() => {
    console.log(network, balances.nfts, activeAccount);
    if (!balances.nfts || !activeAccount) {
      return [];
    }

    if (network) {
      const userAddress = getAddressForChain(network, activeAccount);

      if (!userAddress) {
        return [];
      }

      return Object.values(
        balances.nfts?.[network.chainId]?.[userAddress] ?? {},
      );
    }

    return Object.values(balances.nfts ?? {}).flatMap((chainBalances) =>
      Object.values(chainBalances?.[userAddress] ?? {}),
    );
  }, [network, balances.nfts, activeAccount]);
};
