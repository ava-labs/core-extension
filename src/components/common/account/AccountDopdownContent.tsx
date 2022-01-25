import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { exhaustMap, from, Subject, tap } from 'rxjs';
import { AccountDropdownItem } from './AccountDropdownItem';

interface AccountDropdownContentProps {
  onClose?: () => void;
}

export function AccountDropdownContent({
  onClose,
}: AccountDropdownContentProps) {
  const { accounts, selectAccount, addAccount } = useAccountsContext();

  const theme = useTheme();
  const scrollbarsRef = useRef<Scrollbars>(null);

  const selectAccountSubject$ = useMemo(() => {
    return new Subject<number>();
  }, []);
  const [editing, isEditing] = useState(false);
  const [accountIndexLoading, setAccountIndexLoading] = useState<number | null>(
    null
  );

  useEffect(() => {
    const subscription = selectAccountSubject$
      .pipe(
        tap((index) => {
          setAccountIndexLoading(index);
        }),
        exhaustMap((index) => from(selectAccount(index))),
        tap(() => {
          setAccountIndexLoading(null);
        })
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectAccount, selectAccountSubject$]);

  return (
    <Card
      direction="column"
      height={'100%'}
      width={'100%'}
      padding="16px 0"
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
      }}
    >
      <HorizontalFlex
        justify="space-between"
        align="flex-start"
        width="100%"
        margin="0 0 8px"
        padding="16px"
      >
        <Typography size={24} weight={700} height="24px">
          Accounts
        </Typography>
        <TextButton onClick={() => onClose?.()}>
          <CloseIcon color={theme.colors.icon1} />
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
        autoHide={true}
        ref={scrollbarsRef}
      >
        <VerticalFlex paddingBottom="64px">
          {accounts.map((account, i) => {
            return (
              <VerticalFlex
                key={account.addressC}
                onClick={() =>
                  !editing && selectAccountSubject$.next(account.index)
                }
                width="100%"
              >
                <AccountDropdownItem
                  editing={editing}
                  account={account}
                  onEdit={() => isEditing(true)}
                  onSave={() => isEditing(false)}
                  isLoadingIndex={accountIndexLoading}
                />
                {i < accounts.length - 1 && (
                  <HorizontalSeparator
                    color={`${theme.colors.bg3}80`}
                    margin="0"
                  />
                )}
              </VerticalFlex>
            );
          })}
        </VerticalFlex>
        <HorizontalFlex
          position="fixed"
          justify="center"
          padding="16px 17px"
          margin="0 0 16px 0"
          style={{
            bottom: '0px',
            background: `${theme.colors.bg2}`,
          }}
        >
          <PrimaryButton width="309px" onClick={() => addAccount()}>
            Add Account
          </PrimaryButton>
        </HorizontalFlex>
      </Scrollbars>
    </Card>
  );
}
