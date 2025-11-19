import { getHexAlpha, Stack, useTheme } from '@avalabs/k2-alpine';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeaderActions } from './components/HeaderActions';
import {
  AccountInfo,
  AccountSelectContainer,
} from './components/styledComponents';
import { ConciergePrompt } from './ConciergePrompt';
import { isImportedAccount, isPrimaryAccount } from '@core/common';
import { AccountType, ImportedAccount } from '@core/types';
import { HeaderWalletDetails } from './types';
import { HeaderWallet } from './components/HeaderWallet';
import { HeaderAccount } from './components/HeaderAccount';

export const Header = () => {
  const { accounts } = useAccountsContext();
  const { t } = useTranslation();
  const { getWallet } = useWalletContext();
  const activeAccount = accounts.active;
  const activeWallet = isPrimaryAccount(activeAccount)
    ? getWallet(activeAccount.walletId)
    : undefined;

  const getImportedWalletName = useCallback(
    (acct: ImportedAccount) => {
      switch (acct.type) {
        case AccountType.IMPORTED:
          return t(`Imported`);
        case AccountType.WALLET_CONNECT:
          return t(`WalletConnect`);
        case AccountType.FIREBLOCKS:
          return t(`Fireblocks`);
      }
    },
    [t],
  );

  const headerWalletDetails: HeaderWalletDetails = useMemo(() => {
    const walletId = isPrimaryAccount(activeAccount)
      ? activeAccount.walletId
      : isImportedAccount(activeAccount)
        ? activeAccount.id
        : '';

    const walletName = isPrimaryAccount(activeAccount)
      ? (activeWallet?.name ?? '')
      : isImportedAccount(activeAccount)
        ? getImportedWalletName(activeAccount as ImportedAccount)
        : '';

    return {
      id: walletId,
      name: walletName,
      type: activeWallet?.type,
      authProvider: activeWallet?.authProvider,
    };
  }, [
    activeAccount,
    activeWallet?.name,
    activeWallet?.type,
    activeWallet?.authProvider,
    getImportedWalletName,
  ]);

  const theme = useTheme();
  const location = useLocation();
  const [isAIBackdropOpen, setIsAIBackdropOpen] = useState(false);

  // TODO: fix this after the transactions will be implemented
  // TODO: fix the icon in k2 dark mode.....
  // the true will rotate
  const isTransactionPending = false;

  const isWalletView =
    location.pathname === `/wallet/${headerWalletDetails.id}`;
  return (
    <Stack
      sx={{
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: theme.zIndex.appBar,
        borderBottom: `1px solid ${getHexAlpha(theme.palette.primary.main, 10)}`,
        overflow: 'visible',
      }}
    >
      <Stack
        direction="row"
        sx={{
          background: theme.palette.background.default,
          width: '100%',
          height: '56px',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1,
          zIndex: theme.zIndex.tooltip + 1,
          overflow: 'visible',
        }}
        onMouseEnter={() => {
          setIsAIBackdropOpen(false);
        }}
      >
        <AccountSelectContainer>
          <AccountInfo>
            {isWalletView ? (
              <HeaderWallet wallet={headerWalletDetails} />
            ) : (
              <HeaderAccount
                wallet={headerWalletDetails}
                account={activeAccount}
              />
            )}
          </AccountInfo>
        </AccountSelectContainer>
        <HeaderActions
          activeAccount={activeAccount}
          pendingTransaction={isTransactionPending}
        />
      </Stack>
      <ConciergePrompt
        isAIBackdropOpen={isAIBackdropOpen}
        setIsAIBackdropOpen={setIsAIBackdropOpen}
      />
    </Stack>
  );
};
