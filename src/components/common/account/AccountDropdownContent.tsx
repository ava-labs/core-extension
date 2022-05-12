import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CloseIcon,
  ComponentSize,
  HorizontalFlex,
  HorizontalSeparator,
  PrimaryButton,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { AccountDropdownItem } from './AccountDropdownItem';
import {
  Scrollbars,
  ScrollbarsRef,
} from '@src/components/common/scrollbars/Scrollbars';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

interface AccountDropdownContentProps {
  onClose?: () => void;
}

export function AccountDropdownContent({
  onClose,
}: AccountDropdownContentProps) {
  const { accounts, activeAccount, selectAccount, addAccount } =
    useAccountsContext();

  const theme = useTheme();
  const scrollbarsRef = useRef<ScrollbarsRef>(null);

  const [editing, isEditing] = useState<boolean>(false);
  const [hasError, setHasError] = useState(false);
  const [accountIndexLoading, setAccountIndexLoading] = useState<number | null>(
    null
  );
  const { capture } = useAnalyticsContext();

  const addAccountAndFocus = async () => {
    try {
      await addAccount();
      const nextIndex = accounts.length;
      await selectAccount(nextIndex);
      isEditing(true);
      scrollbarsRef.current?.scrollToBottom();
      setHasError(false);
    } catch (e) {
      setHasError(true);
    }
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
        <Typography size={20} weight={600} height="29px">
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
        }}
        autoHide={false}
        ref={scrollbarsRef}
      >
        <VerticalFlex padding="0 0 16px 0">
          {hasError && (
            <Typography color={theme.colors.error} size={12} margin="8px">
              Some error occured, pleas try again later
            </Typography>
          )}
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
                    width="auto"
                  />
                )}
              </VerticalFlex>
            );
          })}
        </VerticalFlex>
      </Scrollbars>
      <HorizontalFlex
        background={`${theme.colors.bg2}99`}
        justify="center"
        padding="12px 16px 24px"
        width="100%"
      >
        <PrimaryButton
          size={ComponentSize.LARGE}
          width="100%"
          onClick={() => {
            capture('AccountSelectorAddAccount', {
              accountNumber: accounts.length + 1,
            });
            addAccountAndFocus();
          }}
        >
          Add Account
        </PrimaryButton>
      </HorizontalFlex>
    </Card>
  );
}
