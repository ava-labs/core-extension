import React, { forwardRef, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AvalancheColorIcon,
  BitcoinColorIcon,
  Button,
  Checkbox,
  EditIcon,
  Grow,
  IconButton,
  Stack,
  StackProps,
  Typography,
  styled,
  useTheme,
} from '@avalabs/k2-components';

import { Account } from '@src/background/services/accounts/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';
import { SimpleAddressK2 } from '@src/components/common/SimpleAddressK2';

import { AccountBalance } from './AccountBalance';

interface AccountItemProps {
  account: Account;
  onClick: () => void;
  editing: boolean;
  onEditStart: () => void;
  onEditEnd: () => void;
  isChecked: boolean;
  toggle: (id: string) => void;
  isDeleteMode: boolean;
}

const AccountNameInput = styled('input')`
  width: 150px;
  height: 28px;
  color: ${({ theme }) => `${theme.palette.text.primary}`};
  padding: ${({ theme }) => theme.spacing(0.25, 1.5)};
  font-size: ${({ theme }) => theme.typography.body1.fontSize}px;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  background-color: ${({ theme }) => theme.palette.grey[900]};

  border: none;

  &:focus {
    border: 1px solid #f8f8fb;
  }
`;

export const AccountItem = forwardRef(
  (
    {
      account,
      editing,
      onEditStart,
      onEditEnd,
      isChecked,
      isDeleteMode,
      toggle,
      onClick,
    }: AccountItemProps,
    ref
  ) => {
    const [accountName, setAccountName] = useState<string>(account.name);
    const { renameAccount, isActiveAccount } = useAccountsContext();
    const { updateBalanceOnAllNetworks } = useBalancesContext();
    const [isBalanceLoading, setIsBalanceLoading] = useState(false);
    const balanceTotalUSD = useBalanceTotalInCurrency(account, false);
    const { t } = useTranslation();

    const isActive = isActiveAccount(account.id);
    const inEditMode = isActive && editing;

    const editAddress = (e: React.MouseEvent) => {
      e.stopPropagation();
      onEditStart();
    };

    const onCancelEdit = (e: React.KeyboardEvent) => {
      e.stopPropagation();
      setAccountName(account.name);
    };

    const onSaveClicked = (e: React.UIEvent) => {
      e.stopPropagation();
      if (accountName.trim().length === 0) {
        setAccountName(account.name);
      } else {
        renameAccount(account.id, accountName);
      }
      onEditEnd();
    };

    const getBalance = async () => {
      if (!updateBalanceOnAllNetworks) {
        return;
      }
      setIsBalanceLoading(true);
      await updateBalanceOnAllNetworks(account);
      setIsBalanceLoading(false);
    };

    const handleClick = useCallback(() => {
      if (isDeleteMode) {
        toggle?.(account.id);
      } else {
        onClick();
      }
    }, [isDeleteMode, account.id, toggle, onClick]);

    return (
      <Wrapper
        ref={ref}
        isActive={isActive}
        isDeleteMode={isDeleteMode}
        onClick={handleClick}
        data-testid={`account-li-item-${account.id}`}
      >
        <Grow in={isDeleteMode} mountOnEnter unmountOnExit>
          <Stack sx={{ justifyContent: 'center', ml: -1.5, mr: 1 }}>
            <Checkbox
              size="medium"
              checked={isChecked}
              onChange={() => toggle?.(account.id)}
            />
          </Stack>
        </Grow>
        <Stack sx={{ width: '100%', zIndex: 0, mr: -0.5, gap: 0.5 }}>
          {/* Header */}
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', gap: 3 }}
          >
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                flexGrow: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                height: 32,
                gap: 1,
              }}
            >
              {inEditMode ? (
                <>
                  <AccountNameInput
                    autoFocus
                    data-testid="account-name-edit-input"
                    value={accountName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setAccountName(e.target.value);
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        onSaveClicked(e);
                      } else if (e.key === 'Escape') {
                        onCancelEdit(e);
                      }
                    }}
                  />
                  <Button
                    variant="text"
                    size="small"
                    onClick={onSaveClicked}
                    data-testid="account-name-save-button"
                  >
                    {t('Save')}
                  </Button>
                </>
              ) : (
                <>
                  <Typography
                    variant="h6"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    data-testid="account-name"
                  >
                    {accountName}
                  </Typography>
                  {isActive && (
                    <IconButton
                      size="small"
                      onClick={editAddress}
                      data-testid="account-name-edit-button"
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </>
              )}
            </Stack>
            <AccountBalance
              refreshBalance={getBalance}
              balanceTotalUSD={balanceTotalUSD}
              isBalanceLoading={isBalanceLoading}
            />
          </Stack>
          {/* Addresses */}
          <Stack sx={{ gap: 1 }}>
            <Stack
              direction="row"
              data-testid="account-selector-copy-ava-address"
              sx={{ gap: 1 }}
            >
              <AvalancheColorIcon size={17} />
              <SimpleAddressK2
                address={account.addressC}
                iconColor={isActive ? 'text.secondary' : 'text.primary'}
                textColor="text.secondary"
              />
            </Stack>

            <Stack
              direction="row"
              data-testid="account-selector-copy-btc-address"
              sx={{ gap: 1 }}
            >
              <BitcoinColorIcon size={17} />
              <SimpleAddressK2
                address={account.addressBTC}
                iconColor={isActive ? 'text.secondary' : 'text.primary'}
                textColor="text.secondary"
              />
            </Stack>
          </Stack>
        </Stack>
      </Wrapper>
    );
  }
);

AccountItem.displayName = 'AccountItem';

type WrapperProps = StackProps & { isActive: boolean; isDeleteMode: boolean };
const Wrapper = forwardRef(
  ({ isActive, isDeleteMode, ...props }: WrapperProps, ref) => {
    const theme = useTheme();

    // Disable hover styles when manager mode is enabled.
    const hoverStyles = isDeleteMode
      ? {}
      : {
          ':hover': {
            opacity: 1,
            backgroundColor: isActive ? theme.palette.grey[850] : 'transparent',
          },
        };

    return (
      <Stack
        direction="row"
        ref={ref}
        sx={{
          zIndex: 0,
          pt: 0.5,
          pb: 1.5,
          px: 2,
          width: '100%',
          height: '92px',
          position: 'relative',
          transition:
            'opacity ease-in-out .15s, background-color ease-in-out .15s',
          opacity: isActive || isDeleteMode ? 1 : 0.6,
          backgroundColor: isActive ? theme.palette.grey[850] : 'transparent',
          cursor: isActive ? 'default' : 'pointer',

          ...hoverStyles,
        }}
        {...props}
      ></Stack>
    );
  }
);
Wrapper.displayName = 'Wrapper';
