import {
  Scrollbars,
  ScrollbarsRef,
  Stack,
  SxProps,
} from '@avalabs/k2-components';
import { useEffect, useRef } from 'react';

import { Account } from '@src/background/services/accounts/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';

import { AccountItem } from './AccountItem';
import { SecretType } from '@src/background/services/secrets/models';

export enum SelectionMode {
  None, // Reserved for Seedless
  Any,
  Consecutive,
}

type AccountListProps = {
  accounts: Account[];
  selectionMode: SelectionMode;
  walletType?: SecretType;
  sx?: SxProps;
};

export const AccountList = ({
  accounts,
  selectionMode,
  sx,
  walletType,
}: AccountListProps) => {
  const {
    accounts: { active },
  } = useAccountsContext();
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
        {accounts.map((account) => (
          <AccountItem
            key={account.id}
            ref={active?.id === account.id ? activeAccountRef : null}
            account={account}
            selectionMode={selectionMode}
            walletType={walletType}
          />
        ))}
      </Stack>
    </Scrollbars>
  );
};
