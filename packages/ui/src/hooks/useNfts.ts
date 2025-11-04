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
    console.log(network, { balances }, activeAccount, 'helolo check here');
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

    // No network provided: return NFTs across all networks for the active account
    return Object.values(balances.nfts ?? {}).flatMap((chainBalances) =>
      Object.values(
        chainBalances?.['0x886b7142402D3e9A31E71D2f0009146B61f80D3B'] ?? {},
      ),
    );
  }, [network, balances, activeAccount]);
};
