import { Account } from '@core/service-worker';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
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
