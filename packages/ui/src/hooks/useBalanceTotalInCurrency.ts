import { Account } from '@core/types';
import { useBalancesContext } from '@/contexts/BalancesProvider';
import { useMemo } from 'react';

export function useBalanceTotalInCurrency(account?: Account) {
  const { getTotalBalance } = useBalancesContext();

  return useMemo(() => {
    if (!account?.addressC) {
      return null;
    }

    return getTotalBalance(account.addressC);
  }, [account?.addressC, getTotalBalance]);
}
