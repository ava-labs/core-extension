import {
  AvaxTokenIcon,
  ComponentSize,
  HorizontalFlex,
  PencilIcon,
  SimpleAddress,
  TextButton,
  Typography,
  VerticalFlex,
  WordInput,
} from '@avalabs/react-components';
import { Account } from '@src/background/services/accounts/models';
import { BitcoinLogo } from '@src/components/icons/BitcoinLogo';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';
import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';

interface AccountDropdownItemProps {
  account: Account;
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  isLoadingIndex: number | null;
}

const AccountName = styled(Typography)`
  max-width: 164px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  line-height: 17px;
  font-weight: 500;
  margin: 0;
`;

const LogoContainer = styled.span`
  margin-right: 8px;
`;

const AccountNameInput = styled(WordInput)`
  border: none;
  width: 150px;
  background-color: ${({ theme }) => `${theme.colors.bg1}`};
  height: 27px;
  padding: 6px;
  color: ${({ theme }) => `${theme.colors.text2}`};

  > input {
    font-size: 12px;
  }

  &:focus-within {
    border: none;
  }
`;

const AccountItem = styled(HorizontalFlex)<{
  selected?: boolean;
  edit?: boolean;
}>`
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.stroke1 : 'auto'};
  width: 100%;
  height: ${({ edit }) => (edit ? '87px' : '78px')};
  padding: 8px 16px;
  z-index: ${({ selected }) => (selected ? 2 : 'unset')};
  margin-top: ${({ selected }) => (selected ? `-1px` : '0')};
  margin-bottom: ${({ selected }) => (selected ? `-1px` : '0')};
  justify-content: space-between;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    opacity: 1;
  }
  opacity: ${({ selected }) => (!selected ? 0.6 : 1)};
  transition: 0.2s ease-in-out;
`;

export function AccountDropdownItem({
  account,
  editing,
  onEdit,
  onSave,
}: AccountDropdownItemProps) {
  const [accountName, setAccountName] = useState<string>(account.name);
  const { currencyFormatter } = useSettingsContext();
  const { renameAccount } = useAccountsContext();
  const theme = useTheme();
  const inEditMode = account.active && editing;
  const totalBalance = useBalanceTotalInCurrency(account);

  const editAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const onSaveClicked = (e: React.UIEvent) => {
    e.stopPropagation();
    if (accountName.trim().length === 0) {
      onSave();
      setAccountName(account.name);
    } else {
      onSave();
      renameAccount(account.index, accountName);
    }
  };

  return (
    <AccountItem selected={account.active} edit={inEditMode}>
      <VerticalFlex align="flex-start">
        <HorizontalFlex
          width={inEditMode ? '100%' : 'auto'}
          align="center"
          justify="space-between"
          marginBottom="2px"
        >
          {inEditMode ? (
            <>
              <AccountNameInput
                value={accountName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAccountName(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onSaveClicked(e);
                  }
                }}
                onFocus={(e) => {
                  e.target.select();
                }}
                autoFocus
              />
              <TextButton
                size={ComponentSize.SMALL}
                margin="0 0 0 8px"
                onClick={onSaveClicked}
              >
                Save
              </TextButton>
            </>
          ) : (
            <>
              <AccountName>{accountName}</AccountName>
              {account.active && (
                <TextButton onClick={editAddress} margin="0 0 0 8px">
                  <PencilIcon color={theme.colors.icon1} height="12px" />
                </TextButton>
              )}
            </>
          )}
        </HorizontalFlex>
        <HorizontalFlex margin="4px 0 0 0">
          <LogoContainer>
            <AvaxTokenIcon height="16" />
          </LogoContainer>
          <SimpleAddress
            address={account.addressC}
            typographyProps={{
              size: 12,
              height: '15px',
              color: theme.colors.text2,
              margin: '0 8px 0 0',
            }}
            copyIconProps={{
              height: '12px',
              color: account.active ? theme.colors.icon1 : theme.colors.icon2,
            }}
          />
        </HorizontalFlex>
        <HorizontalFlex margin="4px 0 0 0">
          <LogoContainer>
            <BitcoinLogo height="16" />
          </LogoContainer>
          <SimpleAddress
            address={account.addressBTC}
            typographyProps={{
              size: 12,
              height: '15px',
              color: theme.colors.text2,
              margin: '0 8px 0 0',
            }}
            copyIconProps={{
              height: '12px',
              color: account.active ? theme.colors.icon1 : theme.colors.icon2,
            }}
          />
        </HorizontalFlex>
      </VerticalFlex>
      <VerticalFlex align="flex-end">
        <Typography
          color={theme.colors.text2}
          size={12}
          height="15px"
          margin="4px 0 0 0"
        >
          {totalBalance !== null && currencyFormatter(totalBalance)}
        </Typography>
      </VerticalFlex>
    </AccountItem>
  );
}
