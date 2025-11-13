import { getHexAlpha, Stack, styled, useTheme } from '@avalabs/k2-alpine';
import { useAccountsContext, useWalletContext } from '@core/ui';
import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AddressList } from './AddressList';
import { HeaderActions } from './components/HeaderActions';
import { isImportedAccount, isPrimaryAccount } from '@core/common';
import { AccountType, ImportedAccount } from '@core/types';
import { HeaderWallet } from './components/HeaderWallet';
import { HeaderAccount } from './components/HeaderAccount';
import { HeaderWalletDetails } from './types';
import { useTranslation } from 'react-i18next';

const AccountInfo = styled(Stack)`
  cursor: pointer;
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing(0.5)};
  transition: ${({ theme }) =>
    theme.transitions.create(['background', 'opacity'])};
  flex-direction: row;
  align-items: center;
  & > svg {
    opacity: 0;
  }
`;

const AccountSelectContainer = styled(Stack)`
  cursor: pointer;
  position: relative;
  &:hover > div:first-of-type {
    background: ${({ theme }) => getHexAlpha(theme.palette.primary.main, 10)};
    & > svg {
      opacity: 1;
    }
  }
`;

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
    };
  }, [activeAccount, activeWallet?.name, getImportedWalletName]);

  const theme = useTheme();
  const [isAddressAppear, setIsAddressAppear] = useState(false);
  const location = useLocation();

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
          zIndex: 1,
        }}
      >
        <AccountSelectContainer
          onMouseOver={() => setIsAddressAppear(true)}
          onMouseLeave={() => setIsAddressAppear(false)}
        >
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
          <AddressList
            isAddressAppear={isAddressAppear}
            activeAccount={activeAccount}
          />
        </AccountSelectContainer>
        <HeaderActions
          activeAccount={activeAccount}
          pendingTransaction={isTransactionPending}
        />
      </Stack>
    </Stack>
  );
};
