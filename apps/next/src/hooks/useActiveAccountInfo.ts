import { isPrimaryAccount } from '@core/common';
import {
  Account,
  AccountType,
  SecretType,
  SeedlessAuthProvider,
} from '@core/types';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export type WalletSummary = {
  id: string;
  name: string;
  isTrueWallet: boolean;
  type?: SecretType;
  authProvider?: SeedlessAuthProvider;
};

export type ActiveAccountInfo = {
  account?: Account;
  walletSummary?: WalletSummary;
};

export const useActiveAccountInfo = (): ActiveAccountInfo => {
  const { t } = useTranslation();
  const { accounts } = useAccountsContext();
  const { getWallet } = useWalletContext();

  const activeAccount = accounts.active;

  const activeWallet = useMemo(
    () =>
      activeAccount && isPrimaryAccount(activeAccount)
        ? getWallet(activeAccount.walletId)
        : undefined,
    [activeAccount, getWallet],
  );

  const getImportedWalletName = useCallback(
    (accountType: AccountType) => {
      const defaultName = t('Wallet');
      if (!accountType) {
        return defaultName;
      }
      switch (accountType) {
        case AccountType.IMPORTED:
          return t(`Imported accounts`);
        case AccountType.WALLET_CONNECT:
          return t(`WalletConnect`);
        case AccountType.FIREBLOCKS:
          return t(`Fireblocks`);
        default:
          return defaultName;
      }
    },
    [t],
  );

  const walletSummary: WalletSummary | undefined = useMemo(() => {
    if (!activeAccount) {
      return undefined;
    }
    const walletId = activeWallet ? activeWallet.id : activeAccount.id;

    const walletName: string = activeWallet
      ? (activeWallet.name ?? t('Wallet'))
      : getImportedWalletName(activeAccount.type);

    return {
      id: walletId,
      name: walletName,
      isTrueWallet: !!activeWallet,
      type: activeWallet?.type,
      authProvider: activeWallet?.authProvider,
    };
  }, [activeAccount, getImportedWalletName, activeWallet, t]);

  return {
    account: activeAccount,
    walletSummary,
  };
};
