import { IMPORTED_ACCOUNTS_WALLET_ID } from '@core/types';
import {
  useAccountsContext,
  useWalletTotalBalance as useWalletTotalBalanceBase,
} from '@core/ui';
import { useMemo } from 'react';
import { useHypercoreBalanceInCurrencyForAddresses } from './useHypercoreBalanceInCurrency';

/**
 * Wallet portfolio total in currency (balance-service + HyperCore across accounts).
 */
export const useWalletTotalBalance = (walletId?: string) => {
  const walletBalance = useWalletTotalBalanceBase(walletId);
  const {
    accounts: { imported },
    getAccountsByWalletId,
  } = useAccountsContext();

  const evmAddresses = useMemo(() => {
    if (!walletId) {
      return [];
    }

    const accounts =
      walletId === IMPORTED_ACCOUNTS_WALLET_ID
        ? Object.values(imported)
        : getAccountsByWalletId(walletId);

    return accounts
      .map((account) => account.addressC)
      .filter((address): address is string => Boolean(address));
  }, [getAccountsByWalletId, imported, walletId]);

  const hypercoreBalanceInCurrency =
    useHypercoreBalanceInCurrencyForAddresses(evmAddresses);

  return useMemo(() => {
    if (hypercoreBalanceInCurrency === 0) {
      return walletBalance;
    }

    return {
      ...walletBalance,
      totalBalanceInCurrency:
        (walletBalance.totalBalanceInCurrency ?? 0) +
        hypercoreBalanceInCurrency,
    };
  }, [hypercoreBalanceInCurrency, walletBalance]);
};
