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
import { HeaderContainer, HeaderNavigationContainer } from './styled';

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
    const walletId = activeWallet
      ? activeWallet.id
      : isImportedAccount(activeAccount)
        ? activeAccount.id
        : '';

    const walletName = activeWallet
      ? (activeWallet?.name ?? '')
      : isImportedAccount(activeAccount)
        ? getImportedWalletName(activeAccount as ImportedAccount)
        : '';

    return {
      id: walletId,
      name: walletName,
      isTrueWallet: !!activeWallet,
      type: activeWallet?.type,
      authProvider: activeWallet?.authProvider,
    };
  }, [activeAccount, getImportedWalletName, activeWallet]);
  const location = useLocation();
  const [isAIBackdropOpen, setIsAIBackdropOpen] = useState(false);

  const isWalletView =
    location.pathname === `/wallet/${headerWalletDetails.id}`;

  return (
    <HeaderContainer>
      <HeaderNavigationContainer
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
                isTrueWallet={headerWalletDetails.isTrueWallet}
              />
            )}
          </AccountInfo>
        </AccountSelectContainer>
        <HeaderActions account={activeAccount} />
      </HeaderNavigationContainer>
      <ConciergePrompt
        isAIBackdropOpen={isAIBackdropOpen}
        setIsAIBackdropOpen={setIsAIBackdropOpen}
      />
    </HeaderContainer>
  );
};
