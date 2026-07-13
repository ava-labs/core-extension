import type { Account } from '@core/types';
import { useBalancesContext } from '@core/ui';
import { useMemo } from 'react';
import { useHypercoreBalanceInCurrency } from './useHypercoreBalanceInCurrency';

/**
 * Account portfolio total in the active currency (balance-service chains + HyperCore).
 */
export const useAccountTotalBalance = (account?: Account) => {
  const { getTotalBalance } = useBalancesContext();
  const hypercoreBalanceInCurrency = useHypercoreBalanceInCurrency(account);

  return useMemo(() => {
    if (!account?.addressC) {
      return undefined;
    }

    const totalBalance = getTotalBalance(account.addressC);
    if (!totalBalance) {
      return undefined;
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
