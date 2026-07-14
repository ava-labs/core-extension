import type { Account } from '@core/types';
import { useBalancesContext } from '@core/ui';

/**
 * Account portfolio total in the active currency from BalanceService
 * (incl. HyperCore once HypercoreModule is registered).
 */
export const useAccountTotalBalance = (account?: Account) => {
  const { getTotalBalance } = useBalancesContext();

  if (!account?.addressC) {
    return undefined;
  }

  return getTotalBalance(account.addressC);
};
