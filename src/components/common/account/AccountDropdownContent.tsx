import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CloseIcon,
  HorizontalFlex,
  HorizontalSeparator,
  PrimaryButton,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import Scrollbars from 'react-custom-scrollbars-2';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { AccountDropdownItem } from './AccountDropdownItem';

interface AccountDropdownContentProps {
  onClose?: () => void;
}

export function AccountDropdownContent({
  onClose,
}: AccountDropdownContentProps) {
  const { accounts, activeAccount, selectAccount, addAccount } =
    useAccountsContext();

  const theme = useTheme();
  const scrollbarsRef = useRef<Scrollbars>(null);

  const [editing, isEditing] = useState<boolean>(false);
  const [accountIndexLoading, setAccountIndexLoading] = useState<number | null>(
    null
  );

  const addAccountAndFocus = async () => {
    const nextIndex = accounts.length;
    await addAccount();
    await selectAccount(nextIndex);
    isEditing(true);
    scrollbarsRef.current?.scrollToBottom();
  };

  useEffect(() => {
    if (activeAccount) {
      scrollbarsRef.current?.scrollTop(50 * activeAccount.index);
    }
    // only scroll to the selected account on the first open
    // new selects will always be in the view since the user had to click them
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAccountClicked = async (index: number) => {
    setAccountIndexLoading(index);
    await selectAccount(index);
    setAccountIndexLoading(null);
    onClose?.();
  };

  return (
    <Card
      direction="column"
      height={'100%'}
      width={'100%'}
      padding="0"
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
      }}
    >
      <HorizontalFlex
        justify="space-between"
        align="center"
        width="100%"
        margin="16px 0 8px"
        padding="0 16px"
      >
        <Typography size={24} weight={700} height="29px">
          Accounts
        </Typography>
        <TextButton onClick={() => onClose?.()}>
          <CloseIcon height="18px" color={theme.colors.icon1} />
        </TextButton>
      </HorizontalFlex>

      <Scrollbars
        style={{
          flexGrow: 1,
          maxHeight: 'unset',
          height: '100%',
          width: '100%',
          padding: '0 15px 15px 0',
        }}
        autoHide={false}
        ref={scrollbarsRef}
      >
        <VerticalFlex padding="0 0 16px 0">
          {accounts.map((account, i) => {
            return (
              <VerticalFlex
                key={account.addressC}
                onClick={() => !editing && onAccountClicked(account.index)}
                width="100%"
              >
                <AccountDropdownItem
                  account={account}
                  editing={editing}
                  onEdit={() => isEditing(true)}
                  onSave={() => isEditing(false)}
                  isLoadingIndex={accountIndexLoading}
                />
                {i < accounts.length - 1 && (
                  <HorizontalSeparator
                    color={`${theme.colors.bg3}80`}
                    margin="0 16px"
                    width={327}
                  />
                )}
              </VerticalFlex>
            );
          })}
        </VerticalFlex>
      </Scrollbars>
      <HorizontalFlex justify="center" padding="16px" width="100%">
        <PrimaryButton width="100%" onClick={() => addAccountAndFocus()}>
          Add Account
        </PrimaryButton>
      </HorizontalFlex>
    </Card>
  );
}
