import { HorizontalSeparator, VerticalFlex } from '@avalabs/react-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useTheme } from 'styled-components';
import { AccountItem } from './AccountItem';
import { AccountListProps } from './Accounts';
import {
  Scrollbars,
  ScrollbarsRef,
} from '@src/components/common/scrollbars/Scrollbars';
import { useEffect, useRef } from 'react';
import { AccountType } from '@src/background/services/accounts/models';

export function MainList({
  isEditing,
  onAccountClicked,
  setIsEditing,
}: AccountListProps) {
  const theme = useTheme();
  const {
    accounts: { primary: primaryAccounts, active: activeAccount },
  } = useAccountsContext();
  const scrollbarsRef = useRef<ScrollbarsRef>(null);

  useEffect(() => {
    if (activeAccount && activeAccount.type === AccountType.PRIMARY) {
      scrollbarsRef.current?.scrollTop(50 * activeAccount.index);
    }
    // only scroll to the selected account on the first open
  }, [activeAccount]);

  {
    return (
      <Scrollbars
        style={{
          flexGrow: 1,
          maxHeight: 'unset',
          height: '100%',
          width: '100%',
        }}
        autoHide={false}
        ref={scrollbarsRef}
      >
        <VerticalFlex padding="0 0 16px 0" grow="1" height="100%">
          {primaryAccounts.map((account, i) => {
            return (
              <VerticalFlex
                data-testid={`account-${i}`}
                key={account.addressC}
                onClick={() => !isEditing && onAccountClicked(account.id)}
                width="100%"
              >
                <AccountItem
                  account={account}
                  editing={isEditing}
                  onEdit={() => setIsEditing(true)}
                  onSave={() => setIsEditing(false)}
                />
                {i < primaryAccounts.length - 1 && (
                  <HorizontalSeparator
                    color={`${theme.colors.bg3}80`}
                    margin="0 16px"
                    width="auto"
                  />
                )}
              </VerticalFlex>
            );
          })}
        </VerticalFlex>
      </Scrollbars>
    );
  }
}
