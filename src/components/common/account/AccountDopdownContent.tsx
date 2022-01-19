import React, { useEffect, useMemo, useRef } from 'react';
import {
  Card,
  CaretIcon,
  CheckmarkIcon,
  HorizontalFlex,
  HorizontalSeparator,
  IconDirection,
  PlusIcon,
  PrimaryAddress,
  TextButton,
  Typography,
  useDialog,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import Scrollbars from 'react-custom-scrollbars';
import { EditableAccountName } from './EditableAccountName';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { exhaustMap, from, Subject } from 'rxjs';
import { QRCodeWithLogo } from '../QRCodeWithLogo';

interface AccountDropdownContentProps {
  onClose?: () => void;
}

const IconBox = styled(VerticalFlex)<{ $show?: boolean }>`
  visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};
  margin: 0 0 0 8px;
`;

const StyledCheckmarkIcon = styled(CheckmarkIcon)`
  flex-shrink: 0;
`;

const SimpleAddress = styled(PrimaryAddress)`
  width: 100%;
`;

const StyledQRCodeWithLogo = styled(QRCodeWithLogo)`
  margin: 16px 0;
`;

const AccountRow = styled(VerticalFlex)`
  cursor: pointer;
  padding: 8px 15px 16px 0;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.bg1}20`};
  }
`;

export function AccountDropdownContent({
  onClose,
}: AccountDropdownContentProps) {
  const { accounts, selectAccount, addAccount, renameAccount } =
    useAccountsContext();
  const theme = useTheme();
  const scrollbarsRef = useRef<Scrollbars>(null);
  const { showDialog, clearDialog } = useDialog();

  const selectAccountSubject$ = useMemo(() => {
    return new Subject<number>();
  }, []);

  useEffect(() => {
    const subscription = selectAccountSubject$
      .pipe(exhaustMap((index) => from(selectAccount(index))))
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectAccount, selectAccountSubject$]);

  const showQR = (e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    showDialog({
      title: 'C-Chain QR Code',
      component: <StyledQRCodeWithLogo value={address} logoText="C-Chain" />,
      confirmText: 'Close',
      width: '343px',
      onConfirm: () => {
        clearDialog();
      },
    });
  };

  return (
    <Card
      direction="column"
      height={'100%'}
      width={'100%'}
      padding="16px"
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
      }}
    >
      <HorizontalFlex
        justify="space-between"
        align="flex-start"
        width="100%"
        margin="0 0 8px"
        padding="16px 0"
      >
        <TextButton onClick={() => onClose?.()}>
          <CaretIcon
            height="20px"
            direction={IconDirection.LEFT}
            color={theme.colors.icon1}
          />
        </TextButton>
        <Typography size={18} weight={500}>
          Accounts
        </Typography>
        <TextButton onClick={() => addAccount()}>
          <PlusIcon height="20px" color={theme.colors.icon1} />
        </TextButton>
      </HorizontalFlex>

      <Scrollbars
        style={{
          flexGrow: 1,
          maxHeight: 'unset',
          height: '100%',
          width: '100%',
        }}
        autoHide={true}
        ref={scrollbarsRef}
      >
        {accounts.map((account) => {
          return (
            <>
              <AccountRow
                key={account.addressC}
                onClick={() => selectAccountSubject$.next(account.index)}
              >
                <HorizontalFlex
                  width="100%"
                  padding="8px"
                  justify="space-between"
                  align="center"
                >
                  <EditableAccountName
                    name={account.name}
                    enabled={true}
                    onSave={(name) => {
                      renameAccount(account.index, name);
                    }}
                  />
                </HorizontalFlex>
                <HorizontalFlex align="center" padding="0 0 0 8px">
                  <SimpleAddress
                    address={account.addressC}
                    withQR={true}
                    onQRClicked={(e: React.MouseEvent) => {
                      showQR(e, account.addressC);
                    }}
                    truncateLength={17}
                  />
                  <IconBox $show={account.active}>
                    <StyledCheckmarkIcon
                      height="16px"
                      color={theme.colors.icon1}
                    />
                  </IconBox>
                </HorizontalFlex>
              </AccountRow>
              <HorizontalSeparator
                key={`separator${account.addressC}`}
                margin="0"
              />
            </>
          );
        })}
      </Scrollbars>
    </Card>
  );
}
