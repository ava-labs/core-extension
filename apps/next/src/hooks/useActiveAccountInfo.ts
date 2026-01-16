import { isPrimaryAccount } from '@core/common';
import {
  Account,
  IMPORTED_ACCOUNTS_WALLET_ID,
  SecretType,
  SeedlessAuthProvider,
} from '@core/types';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { useMemo } from 'react';
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

  const walletSummary: WalletSummary | undefined = useMemo(() => {
    if (!activeAccount) {
      return undefined;
    }

    const wallet = isPrimaryAccount(activeAccount)
      ? getWallet(activeAccount.walletId)
      : {
          name: t('Imported accounts'),
          type: SecretType.PrivateKey,
          id: IMPORTED_ACCOUNTS_WALLET_ID,
          authProvider: undefined,
        };

    if (!wallet) {
      return undefined;
    }

    return {
      id: wallet.id,
      name: wallet.name || t('Wallet'),
      isTrueWallet: isPrimaryAccount(activeAccount),
      type: wallet.type,
      authProvider: wallet.authProvider,
    };
  }, [activeAccount, getWallet, t]);

  return {
    account: activeAccount,
    walletSummary,
  };
};
