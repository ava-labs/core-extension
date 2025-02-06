import { useMemo } from 'react';

import type { WalletTotalBalanceState } from '../providers/WalletTotalBalanceProvider';
import { useWalletTotalBalanceContext } from '../providers/WalletTotalBalanceProvider';

export const useWalletTotalBalance = (walletId?: string) => {
  const { walletBalances } = useWalletTotalBalanceContext();

  return useMemo(
    (): WalletTotalBalanceState =>
      (walletId && walletBalances[walletId]) || {
        isLoading: false,
        hasErrorOccurred: false,
      },
    [walletBalances, walletId],
  );
};
