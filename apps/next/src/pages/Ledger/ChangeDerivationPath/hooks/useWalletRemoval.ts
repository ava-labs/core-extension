import { useAccountsContext } from '@core/ui';
import { useCallback } from 'react';

export function useWalletRemoval() {
  const {
    accounts: { primary },
    deleteAccounts,
  } = useAccountsContext();

  return useCallback(
    async (walletId: string) => {
      if (walletId && primary[walletId]) {
        await deleteAccounts(primary[walletId].map((account) => account.id));
      }
    },
    [deleteAccounts, primary],
  );
}
