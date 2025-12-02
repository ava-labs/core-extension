import {
  useWalletTotalBalanceContext,
  WalletAtomicBalanceState,
} from '../contexts/WalletTotalBalanceProvider';

const fallbackBalance: WalletAtomicBalanceState = {
  isLoading: false,
  hasErrorOccurred: false,
};

export const useWalletTotalAtomicBalance = (walletId?: string) => {
  const { walletAtomicBalances } = useWalletTotalBalanceContext();

  if (!walletId || !walletAtomicBalances[walletId]) {
    return fallbackBalance;
  }

  return walletAtomicBalances[walletId];
};
