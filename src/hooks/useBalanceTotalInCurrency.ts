import { Account } from '@src/background/services/accounts/models';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { calculateTotalBalance } from '@src/utils/calculateTotalBalance';
import { useMemo } from 'react';

export function useBalanceTotalInCurrency(
  account?: Account,
  onlyFavoritesAndActive = false
) {
  const { tokens, totalBalance } = useBalancesContext();

  const { networks, network } = useNetworkContext();

  return useMemo(() => {
    if (onlyFavoritesAndActive && totalBalance !== null) {
      return totalBalance;
    }
    // don't freak users out by display falsely a 0 balance when we just don't know the usd value
    if (!account || !tokens.balances || !network || networks.length === 0) {
      return null;
    }
    const networkIds = new Set(networks.map((m) => m.chainId));

    const sum = calculateTotalBalance(
      network,
      account,
      Array.from(networkIds),
      tokens.balances
    );

    return sum;
  }, [
    onlyFavoritesAndActive,
    account,
    tokens.balances,
    network,
    networks,
    totalBalance,
  ]);
}
