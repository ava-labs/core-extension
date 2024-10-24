import {
  Scrollbars,
  ScrollbarsRef,
  Stack,
  SxProps,
} from '@avalabs/core-k2-components';
import { useEffect, useRef } from 'react';

import {
  PrimaryAccount,
  WalletId,
} from '@src/background/services/accounts/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';

import { AccountItem } from './AccountItem';
import { SelectionMode } from './AccountList';
import { useWalletContext } from '@src/contexts/WalletProvider';
import WalletHeader from './WalletHeader';

type AccountListProps = {
  primaryAccount: Record<WalletId, PrimaryAccount[]>;
  selectionMode: SelectionMode;
  sx?: SxProps;
};

export const AccountListPrimary = ({
  primaryAccount,
  selectionMode,
  sx,
}: AccountListProps) => {
  const {
    accounts: { active },
  } = useAccountsContext();
  const { walletDetails: activeWalletDetails, wallets } = useWalletContext();

  const scrollbarsRef = useRef<ScrollbarsRef>(null);
  const activeAccountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Make sure the active account element is visible after switching tabs
    // or active account.
    if (scrollbarsRef.current && activeAccountRef.current) {
      const containerTop = scrollbarsRef.current.getScrollTop();
      const containerBottom =
        containerTop + scrollbarsRef.current.getClientHeight();

      const { offsetTop: elementTop, clientHeight: elementHeight } =
        activeAccountRef.current;
      const elementBottom = elementTop + elementHeight;

      if (elementTop < containerTop || elementBottom > containerBottom) {
        activeAccountRef.current.scrollIntoView({ block: 'center' });
      }
    }
  }, [active?.id]);

  return (
    <Scrollbars ref={scrollbarsRef}>
      <Stack sx={{ gap: 1, width: 1, ...sx }}>
        {Object.keys(primaryAccount).map((walletId) => {
          const walletAccounts = primaryAccount[walletId];
          const walletDetails = wallets.find(
            (wallet) => wallet.id === walletId
          );

          if (!walletDetails) {
            return;
          }

          const isActive = activeWalletDetails?.id === walletId;

          if (walletAccounts && walletAccounts.length > 0) {
            return (
              <Stack sx={{ gap: 1.5, pt: 1, width: 1 }} key={walletId}>
                <WalletHeader
                  walletDetails={walletDetails}
                  isActive={isActive}
                />
                {walletAccounts.map((account) => (
                  <AccountItem
                    key={account.id}
                    ref={active?.id === account.id ? activeAccountRef : null}
                    account={account}
                    selectionMode={selectionMode}
                    walletType={walletDetails?.type}
                  />
                ))}
              </Stack>
            );
          }
        })}
      </Stack>
    </Scrollbars>
  );
};
