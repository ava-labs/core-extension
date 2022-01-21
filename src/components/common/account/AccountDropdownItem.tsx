import {
  HorizontalFlex,
  LoadingSpinnerIcon,
  SimpleAddress,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { Account } from '@src/background/services/accounts/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';
import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';

interface AccountDropdownItemProps {
  account: Account;
  editing?: boolean;
  onEdit: () => void;
  onSave: () => void;
  isLoadingIndex: number | null;
}

const AccountName = styled(Typography)`
  max-width: 164px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  margin: 0;
`;

const TransparentInputBase = styled(AccountName)`
  border: none;
  background-color: ${({ theme }) => `${theme.colors.bg1}`};
  flex-grow: 1;
  width: 100%;
  height: 40px;
  border-radius: 8px;
  padding: 8px 16px;
  color: ${({ theme }) => `${theme.colors.text2}`};
`;

const AccountItem = styled(HorizontalFlex)<{
  selected?: boolean;
  editing?: boolean;
  edit?: boolean;
}>`
  background-color: ${({ theme, selected }) =>
    selected ? `${theme.colors.bg3}80` : 'auto'};
  width: 100%;
  padding: 12px 31px 12px 16px;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.bg3}40`};
  }
  opacity: ${({ editing, edit }) => (editing && !edit ? 0.33 : 'initial')};
`;

const StyledEditButton = styled(TextButton)`
  height: 24px;
`;

const StyledSaveButton = styled(TextButton)`
  height: 24px;
  margin: 8px 0 0 0;
`;

const StyledLoadingSpinnerIcon = styled(LoadingSpinnerIcon)`
  margin: 4px 0 0 0;
`;

export function AccountDropdownItem({
  account,
  editing,
  onEdit,
  onSave,
  isLoadingIndex,
}: AccountDropdownItemProps) {
  const [accountName, setAccountName] = useState<string>(account.name);
  const [edit, setEdit] = useState<boolean>(false);
  const { currencyFormatter } = useSettingsContext();
  const balanceTotalUSD = useBalanceTotalInCurrency();
  const { renameAccount } = useAccountsContext();
  const { addresses } = useWalletContext();
  const theme = useTheme();

  const editAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
    setEdit(true);
  };

  const onSaveClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (accountName.trim().length === 0) {
      onSave();
      setEdit(false);
      setAccountName(account.name);
    } else {
      onSave();
      setEdit(false);
      renameAccount(account.index, accountName);
    }
  };

  return (
    <AccountItem selected={account.active} editing={editing} edit={edit}>
      <VerticalFlex align="flex-start">
        <HorizontalFlex
          width={edit ? '100%' : 'auto'}
          align="center"
          justify="space-between"
        >
          {edit ? (
            <>
              <TransparentInputBase
                as="input"
                value={accountName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAccountName(e.target.value);
                }}
                autoFocus
              />
            </>
          ) : (
            <>
              <AccountName>{accountName}</AccountName>
            </>
          )}
        </HorizontalFlex>
        {edit ? (
          <StyledSaveButton onClick={onSaveClicked}>Save</StyledSaveButton>
        ) : (
          <StyledEditButton
            onClick={editAddress}
            disabled={editing ? true : false}
          >
            Edit
          </StyledEditButton>
        )}
      </VerticalFlex>
      <VerticalFlex align="flex-end">
        <SimpleAddress address={account.addressC} />
        {account.active &&
          (isLoadingIndex === account.index ||
          (account.active && account.addressC !== addresses.addrC) ? (
            <StyledLoadingSpinnerIcon height="16" color={theme.colors.icon1} />
          ) : (
            <Typography size={12} height="15px" margin="4px 0 0 0">
              {currencyFormatter(balanceTotalUSD)}
            </Typography>
          ))}
      </VerticalFlex>
    </AccountItem>
  );
}
