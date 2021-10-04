import React, { useEffect, useRef, useState } from 'react';
import {
  CheckmarkIcon,
  DropDownMenuItem,
  HorizontalFlex,
  HorizontalSeparator,
  PrimaryAddress,
  SecondaryAddress,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import styled, { useTheme } from 'styled-components';
import Scrollbars from 'react-custom-scrollbars';
import { EditableAccountName } from './EditableAccountName';

const StyledPrimaryAddress = styled(PrimaryAddress)`
  margin: 0 0 8px 0;
`;

const AddressContainer = styled(VerticalFlex)<{ selected: boolean }>`
  overflow: hidden;
  margin: ${({ selected }) => (selected ? '16px 0 0 0' : '0px')};
  max-height: ${({ selected }) => (selected ? '90px' : '0px')};
  transition: max-height 300ms, margin 300ms;
`;

const StyledCheckmarkIcon = styled(CheckmarkIcon)`
  flex-shrink: 0;
`;

export function AccountDropdownContent() {
  const theme = useTheme();
  const { addresses } = useWalletContext();
  const [selectedAccount, setSelectedAccount] = useState(0);
  const scrollbarsRef = useRef<Scrollbars>(null);
  const selectedAccountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollbarsRef || !selectedAccountRef || !selectedAccount) {
      return;
    }
    if (selectedAccountRef.current?.offsetTop) {
      scrollbarsRef.current?.scrollTop(selectedAccountRef.current.offsetTop);
    }
  }, [selectedAccount, selectedAccountRef, scrollbarsRef]);

  const accounts = [
    {
      name: 'Account 1',
      addresses,
    },
    {
      name: 'Account 2',
      addresses,
    },
    {
      name: 'Account 3',
      addresses,
    },
    {
      name: 'Account 4',
      addresses,
    },
  ];

  const selectAccount = (index: number) => {
    setSelectedAccount(index);
  };

  return (
    <VerticalFlex
      maxHeight="504px"
      height="400px"
      width="375px"
      padding="12px 0"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Typography size={18} weight={700} padding="12px 24px" height="24px">
        My Accounts
      </Typography>
      <Scrollbars
        style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
        ref={scrollbarsRef}
      >
        {accounts.map((account, i) => (
          <DropDownMenuItem
            key={i}
            selected={selectedAccount === i}
            padding="16px 32px"
            onClick={() => selectAccount(i)}
            ref={selectedAccount === i ? selectedAccountRef : undefined}
          >
            <VerticalFlex width="100%">
              <HorizontalFlex
                width="100%"
                justify="space-between"
                align="center"
              >
                <EditableAccountName
                  name={account.name}
                  enabled={selectedAccount === i}
                  onSave={(name) =>
                    console.log('TODO: handle save new name:', name)
                  }
                />
                {selectedAccount === i && (
                  <StyledCheckmarkIcon
                    size="16px"
                    color={theme.colors.primary[400]}
                  />
                )}
              </HorizontalFlex>
              <AddressContainer selected={selectedAccount === i}>
                <StyledPrimaryAddress
                  name="C chain"
                  address={account.addresses.addrC}
                />
                <SecondaryAddress
                  name="X chain"
                  address={account.addresses.addrX}
                />
              </AddressContainer>
            </VerticalFlex>
          </DropDownMenuItem>
        ))}
      </Scrollbars>
      <HorizontalSeparator margin="0" />
      <TextButton margin="24px 24px 12px">+ Add Account</TextButton>
    </VerticalFlex>
  );
}
