import {
  WalletTotalBalanceState,
  useWalletTotalBalanceContext,
} from '../contexts';

const fallbackBalance: WalletTotalBalanceState = {
  isLoading: false,
  hasErrorOccurred: false,
  hasBalanceServiceErrorOccurred: false,
};

export const useWalletTotalBalance = (walletId?: string) => {
  const { walletBalances } = useWalletTotalBalanceContext();

  if (!walletId || !walletBalances[walletId]) {
    return fallbackBalance;
  }

  return walletBalances[walletId];
};
