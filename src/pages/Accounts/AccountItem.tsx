import {
  AvaxTokenIcon,
  Checkbox,
  ComponentSize,
  HorizontalFlex,
  PencilIcon,
  Skeleton,
  TextButton,
  Typography,
  VerticalFlex,
  WordInput,
} from '@avalabs/react-components';
import { Account, AccountType } from '@src/background/services/accounts/models';
import { BitcoinLogo } from '@src/components/icons/BitcoinLogo';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { AccountBalance } from './AccountBalance';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';
import { CSSTransition } from 'react-transition-group';
import { SimpleAddress } from '@src/components/common/SimpleAddress';

interface AccountItemProps {
  account: Account;
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  isDelete?: boolean;
  setDeleteId?: (id: string) => void;
  isDeleteMode?: boolean;
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
  line-height: 1;
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

const CheckboxContainer = styled.div`
  margin-right: 16px;
  margin-left: 0px;
  &.item-appear {
    margin-left: -30px;
  }
  &.item-appear-active {
    margin-left: 0px;
    transition: margin-left 300ms ease-in-out;
  }
`;

const StyledAccountItem = styled(HorizontalFlex)<{
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

export function AccountItem({
  account,
  editing,
  onEdit,
  onSave,
  setDeleteId,
  isDelete,
  isDeleteMode,
}: AccountItemProps) {
  const [accountName, setAccountName] = useState<string>(account.name);
  const { renameAccount, isActiveAccount } = useAccountsContext();
  const theme = useTheme();
  const { updateBalanceOnAllNetworks } = useBalancesContext();
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const balanceTotalUSD = useBalanceTotalInCurrency(account, false);
  const { t } = useTranslation();

  const hasBalance = balanceTotalUSD !== null;
  const isActive = isActiveAccount(account.id);

  const inEditMode = isActive && editing;

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
      renameAccount(account.id, accountName);
    }
  };

  const getBalance = async () => {
    if (!updateBalanceOnAllNetworks) {
      return;
    }
    setIsBalanceLoading(true);
    await updateBalanceOnAllNetworks(account);
    setIsBalanceLoading(false);
  };

  return (
    <StyledAccountItem selected={isActive} edit={inEditMode}>
      <HorizontalFlex>
        {isDeleteMode && account.type === AccountType.IMPORTED && (
          <CSSTransition timeout={500} classNames="item" appear in exit>
            <CheckboxContainer>
              <Checkbox
                onChange={() => {
                  setDeleteId && setDeleteId(account?.id);
                }}
                isChecked={isDelete}
              />
            </CheckboxContainer>
          </CSSTransition>
        )}
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
                  data-testid="account-name-edit-input"
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
                  data-testid="account-name-save-button"
                  size={ComponentSize.SMALL}
                  margin="0 0 0 8px"
                  onClick={onSaveClicked}
                >
                  {t('Save')}
                </TextButton>
              </>
            ) : (
              <>
                <AccountName data-testid="account-name">
                  {accountName}
                </AccountName>
                {isActive && (
                  <TextButton
                    data-testid="account-name-edit-button"
                    onClick={editAddress}
                    margin="0 0 0 8px"
                  >
                    <PencilIcon color={theme.colors.icon1} height="12px" />
                  </TextButton>
                )}
              </>
            )}
          </HorizontalFlex>
          <HorizontalFlex
            data-testid="account-selector-copy-ava-address"
            margin="4px 0 0 0"
          >
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
                color: isActive ? theme.colors.icon1 : theme.colors.icon2,
              }}
            />
          </HorizontalFlex>
          <HorizontalFlex
            data-testid="account-selector-copy-btc-address"
            margin="4px 0 0 0"
          >
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
                color: isActive ? theme.colors.icon1 : theme.colors.icon2,
              }}
            />
          </HorizontalFlex>
        </VerticalFlex>
      </HorizontalFlex>
      {!inEditMode && (
        <>
          {/* BALANCE */}
          {isBalanceLoading && !hasBalance && (
            <Skeleton width="60px" height="12px" />
          )}
          {hasBalance && (
            <AccountBalance
              refreshBalance={getBalance}
              balanceTotalUSD={balanceTotalUSD}
              isBalanceLoading={isBalanceLoading}
            />
          )}
          {/* BUTTON */}
          {!hasBalance && !isBalanceLoading && (
            <VerticalFlex>
              <TextButton
                data-testid="view-balance-button"
                size={ComponentSize.SMALL}
                margin="0 0 0 8px"
                onClick={(e) => {
                  e.stopPropagation();
                  getBalance();
                }}
              >
                {t('View Balance')}
              </TextButton>
            </VerticalFlex>
          )}
        </>
      )}
    </StyledAccountItem>
  );
}
