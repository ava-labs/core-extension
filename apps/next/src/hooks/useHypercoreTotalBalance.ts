import type { Account } from '@core/types';
import { useBalancesContext } from '@core/ui';
import { useMemo } from 'react';
import { useHypercoreBalanceInCurrency } from './useHypercoreBalanceInCurrency';

export const useHypercoreTotalBalance = (account?: Account) => {
  const { getTotalBalance } = useBalancesContext();
  const hypercoreBalanceInCurrency = useHypercoreBalanceInCurrency(account);

  return useMemo(() => {
    if (!account?.addressC) {
      return null;
    }

    const totalBalance = getTotalBalance(account.addressC);
    if (!totalBalance) {
      return null;
    }

    if (hypercoreBalanceInCurrency === 0) {
      return totalBalance;
    }

    return {
      ...totalBalance,
      sum: (totalBalance.sum ?? 0) + hypercoreBalanceInCurrency,
    };
  }, [account?.addressC, getTotalBalance, hypercoreBalanceInCurrency]);
};
