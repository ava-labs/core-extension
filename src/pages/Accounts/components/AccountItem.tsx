import {
  Checkbox,
  Collapse,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { Account, AccountType } from '@src/background/services/accounts/models';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { SecretType } from '@src/background/services/secrets/models';
import { getAddressForChain } from '@src/utils/getAddressForChain';
import { truncateAddress } from '@src/utils/truncateAddress';
import { useScopedToast } from '@src/hooks/useScopedToast';

import { useAccountRename } from '../hooks/useAccountRename';
import {
  SelectionMode,
  useAccountManager,
} from '../providers/AccountManagerProvider';
import { AccountBalance } from '../AccountBalance';
import { AccountItemMenu } from './AccountItemMenu';
import AccountNameNew from './AccountName';
import { useAccountRemoval } from '../hooks/useAccountRemoval';

type AccountItemProps = {
  account: Account;
  walletType?: SecretType;
  selectionMode: SelectionMode;
};

export const AccountItem = forwardRef(
  (
    { account, walletType, selectionMode }: AccountItemProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { t } = useTranslation();
    const toast = useScopedToast('account-switcher');
    const theme = useTheme();
    const {
      isManageMode,
      selectAccount,
      deselectAccount,
      isAccountSelectable,
      selectedAccounts,
    } = useAccountManager();
    const { isActiveAccount, selectAccount: activateAccount } =
      useAccountsContext();
    const { capture } = useAnalyticsContext();
    const { network } = useNetworkContext();

    const isActive = isActiveAccount(account.id);
    const isSelected = selectedAccounts.includes(account.id);

    const isSelectable =
      walletType === SecretType.Seedless
        ? false
        : isManageMode && isAccountSelectable(account);
    const balanceTotalUSD = useBalanceTotalInCurrency(account);
    const totalBalance = (balanceTotalUSD && balanceTotalUSD.sum) ?? null;
    const address = network ? getAddressForChain(network.chainId, account) : '';
    const [cardHovered, setCardHovered] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);

    const toggle = useCallback(
      (accountId: string) => {
        if (isSelected) {
          deselectAccount(
            accountId,
            selectionMode === SelectionMode.Consecutive
          );
        } else {
          selectAccount(accountId);
        }
      },
      [deselectAccount, isSelected, selectAccount, selectionMode]
    );

    const handleAccountClick = useCallback(async () => {
      if (isSelectable) {
        toggle(account.id);
      } else if (!isManageMode) {
        await activateAccount(account.id);
        toast.success(
          t(`Account "{{accountName}}" is now active`, {
            accountName: account.name,
          }),
          { duration: 1000 }
        );
        await capture('AccountSelectorAccountSwitched', {
          type: account.type,
        });
      }
    }, [
      account.id,
      account.type,
      account.name,
      activateAccount,
      capture,
      isManageMode,
      isSelectable,
      t,
      toggle,
      toast,
    ]);

    const nonSelectableHint = useMemo(() => {
      if (isSelectable) {
        return '';
      }

      if (walletType === SecretType.Seedless) {
        return t('You cannot delete a seedless account.');
      }

      if (
        !isSelectable &&
        account.type === AccountType.PRIMARY &&
        account.index === 0
      ) {
        return t('Removing the last account is not possible.');
      }

      return t(
        'To remove this account, you must also remove all accounts that follow.'
      );
    }, [account, isSelectable, t, walletType]);

    const [isBalanceLoading, setIsBalanceLoading] = useState(false);
    const { updateBalanceOnNetworks } = useBalancesContext();

    const getBalance = useCallback(async () => {
      setIsBalanceLoading(true);
      await updateBalanceOnNetworks([account]);
      setIsBalanceLoading(false);
    }, [account, updateBalanceOnNetworks]);

    const toBeRemoved = useMemo(() => [account.id], [account.id]);
    const { prompt: promptRename, renderDialog: renameDialog } =
      useAccountRename(account);
    const { prompt: promptRemove, renderDialog: removeDialog } =
      useAccountRemoval(toBeRemoved);

    return (
      <>
        <Stack
          key={account.id}
          ref={ref}
          direction="row"
          sx={{
            width: 1,
            cursor: 'pointer',

            opacity: isManageMode ? (isSelectable ? 1 : 0.6) : 1,
            transition: theme.transitions.create('opacity'),
            ':hover': {
              opacity: isManageMode ? (isSelectable ? 1 : 0.6) : 1,
            },
          }}
          onClick={isManageMode ? undefined : handleAccountClick}
          onClickCapture={isManageMode ? handleAccountClick : undefined}
          data-testid={`account-li-item-${account.id}`}
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
        >
          <Collapse in={isManageMode} orientation="horizontal">
            <Stack
              sx={{
                height: 1,
                ml: -1,
                pr: 0.25,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Tooltip
                title={nonSelectableHint}
                sx={{ cursor: isSelectable ? 'pointer' : 'not-allowed' }}
              >
                <Checkbox
                  disableRipple
                  disabled={!isSelectable}
                  onChange={() => toggle(account.id)}
                  checked={selectedAccounts.includes(account.id)}
                />
              </Tooltip>
            </Stack>
          </Collapse>
          <Stack
            ref={itemRef}
            sx={{
              flexGrow: 1,
              width: 1,
              // maxWidth is needed due to potentially long account name stopping the container from shrinking
              maxWidth: isManageMode ? 'calc(100% - 32px)' : '100%',
              borderRadius: 1,
              transition:
                'color .2s ease-in-out, background-color .2s ease-in-out, max-width .2s ease-in-out',
              backgroundColor: isActive ? 'grey.700' : 'grey.850',
              color: isActive ? 'grey.50' : 'text.primary',
              ':hover': {
                backgroundColor: isActive ? 'grey.700' : 'grey.800',
                color: 'grey.50',
              },
              pt: 0.5,
              pb: 1,
              pl: 2,
              pr: 1,
            }}
          >
            <Stack
              sx={{
                flexDirection: 'row',
                minWidth: 0,
                justifyContent: 'space-between',
              }}
            >
              <Stack
                sx={{
                  minWidth: 0,
                  justifyContent: 'space-between',
                  flexGrow: 1,
                }}
              >
                <AccountNameNew
                  accountName={account.name}
                  promptRename={promptRename}
                  cardHovered={cardHovered}
                  isActive={isActive}
                />
                {address && (
                  <Stack direction="row">
                    <Tooltip title={address}>
                      <Typography
                        variant="caption"
                        color={isActive ? 'text.primary' : 'text.secondary'}
                      >
                        {truncateAddress(address)}
                      </Typography>
                    </Tooltip>
                  </Stack>
                )}
              </Stack>
              <Stack
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  pl: 2,
                  pr: 1,
                  pt: 0.25,
                  gap: 0.5,
                }}
              >
                <AccountBalance
                  refreshBalance={getBalance}
                  balanceTotalUSD={totalBalance}
                  isBalanceLoading={isBalanceLoading}
                  accountType={account.type}
                  isActive={isActive}
                  isHovered={cardHovered}
                />
                <Collapse
                  orientation="horizontal"
                  in={!isManageMode && cardHovered}
                >
                  <AccountItemMenu
                    account={account}
                    isActive={isActive}
                    handleRemove={promptRemove}
                    promptRename={promptRename}
                    activateAccount={handleAccountClick}
                    walletType={walletType}
                    menuAnchor={itemRef}
                  />
                </Collapse>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        {renameDialog()}
        {removeDialog()}
      </>
    );
  }
);

AccountItem.displayName = 'AccountItem';
