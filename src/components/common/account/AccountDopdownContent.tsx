import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CheckmarkIcon,
  CloseIcon,
  DropDownMenuItem,
  HorizontalFlex,
  HorizontalSeparator,
  PrimaryAddress,
  SecondaryButton,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import styled, { useTheme } from 'styled-components';
import Scrollbars from 'react-custom-scrollbars';
import { EditableAccountName } from './EditableAccountName';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';

interface AccountDropdownContentProps {
  onClose?: () => void;
}

const StyledPrimaryAddress = styled(PrimaryAddress)`
  margin: 0 0 8px 0;
`;

const AddressContainer = styled(VerticalFlex)<{ selected: boolean }>`
  overflow: hidden;
  margin: ${({ selected }) => (selected ? '16px 0 8px 0' : '0px')};
  max-height: ${({ selected }) => (selected ? '90px' : '0px')};
  transition: max-height 300ms, margin 300ms;
`;

const StyledCheckmarkIcon = styled(CheckmarkIcon)`
  flex-shrink: 0;
`;

export function AccountDropdownContent({
  onClose,
}: AccountDropdownContentProps) {
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);
  const { accounts, selectAccount, addAccount, renameAccount } =
    useAccountsContext();
  const theme = useTheme();
  const { currency, currencyFormatter } = useSettingsContext();
  const balanceTotalUSD = useBalanceTotalInCurrency();
  const { addresses } = useWalletContext();
  const scrollbarsRef = useRef<Scrollbars>(null);
  const selectedAccountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollbarsRef || !selectedAccountRef || !accounts) {
      return;
    }
    if (selectedAccountRef.current?.offsetTop) {
      scrollbarsRef.current?.scrollTop(selectedAccountRef.current.offsetTop);
    }
  }, [accounts, selectedAccountRef, scrollbarsRef]);

  return (
    <Card
      direction="column"
      height={isMiniMode ? '100%' : '400px'}
      width={isMiniMode ? '100%' : '375px'}
      padding="16px 0"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <HorizontalFlex
        justify="space-between"
        align="flex-start"
        width="100%"
        margin="0 0 8px"
        padding="0 16px"
      >
        <Typography size={24} weight={700} height="29px" margin="8px 0">
          My Accounts
        </Typography>
        {isMiniMode && (
          <TextButton onClick={() => onClose?.()}>
            <CloseIcon height="18px" color={theme.colors.icon1} />
          </TextButton>
        )}
      </HorizontalFlex>
      <Scrollbars
        style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
        ref={scrollbarsRef}
      >
        {accounts.map((account, i) => (
          <DropDownMenuItem
            key={i}
            padding="0 16px"
            direction="column"
            onClick={() => selectAccount(account.index)}
            ref={account.active ? selectedAccountRef : undefined}
          >
            {i > 0 && account.active && <HorizontalSeparator margin="0" />}
            <VerticalFlex width="100%" padding="16px 0">
              <HorizontalFlex
                width="100%"
                justify="space-between"
                align="center"
              >
                <VerticalFlex>
                  <EditableAccountName
                    name={account.name}
                    enabled={account.active}
                    onSave={(name) => {
                      renameAccount(account.index, name);
                    }}
                  />
                  {account.active && (
                    <Typography
                      size={14}
                      height="17px"
                      margin="8px 0 0"
                      color={theme.colors.text2}
                    >
                      ~{currencyFormatter(balanceTotalUSD)} {currency}
                    </Typography>
                  )}
                </VerticalFlex>
                {account.active && (
                  <StyledCheckmarkIcon
                    height="16px"
                    color={theme.colors.icon1}
                  />
                )}
              </HorizontalFlex>
              <AddressContainer selected={account.active}>
                <StyledPrimaryAddress
                  name="C chain"
                  address={addresses.addrC}
                />
                <StyledPrimaryAddress
                  name="X chain"
                  address={addresses.addrX}
                />
              </AddressContainer>
            </VerticalFlex>
            {i < accounts.length - 1 && account.active && (
              <HorizontalSeparator margin="0" />
            )}
          </DropDownMenuItem>
        ))}
      </Scrollbars>
      <HorizontalFlex padding="16px 16px 8px">
        <SecondaryButton width="100%" onClick={() => addAccount()}>
          + Add Account
        </SecondaryButton>
      </HorizontalFlex>
    </Card>
  );
}
