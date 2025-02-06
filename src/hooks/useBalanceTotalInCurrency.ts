import type { Account } from '@src/background/services/accounts/models';
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
