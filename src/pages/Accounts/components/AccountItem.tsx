import {
  Card,
  CardContent,
  Checkbox,
  Collapse,
  Stack,
  Tooltip,
  useTheme,
} from '@avalabs/core-k2-components';
import { useHistory } from 'react-router-dom';
import {
  ForwardedRef,
  MouseEvent,
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { SimpleAddress } from '@src/components/common/SimpleAddress';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { Account, AccountType } from '@src/background/services/accounts/models';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';

import { SelectionMode } from './AccountList';
import { AccountItemMenu } from './AccountItemMenu';
import { AccountItemChip } from '../AccountItemChip';
import { useAccountManager } from '../providers/AccountManagerProvider';
import { AccountBalance } from '../AccountBalance';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';
import { SecretType } from '@src/background/services/secrets/models';
import { getAddressForChain } from '@src/utils/getAddressForChain';
import AccountName from './AccountName';

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
    const history = useHistory();
    const { capture } = useAnalyticsContext();
    const { network } = useNetworkContext();
    const { updateBalanceOnAllNetworks } = useBalancesContext();
    const [isBalanceLoading, setIsBalanceLoading] = useState(false);

    const isActive = isActiveAccount(account.id);

    const isImportedAccount = account.type !== AccountType.PRIMARY;
    const isSelected = selectedAccounts.includes(account.id);
    const isSelectable =
      walletType === SecretType.Seedless
        ? false
        : isManageMode && isAccountSelectable(account);
    const balanceTotalUSD = useBalanceTotalInCurrency(account);
    const totalBalance = (balanceTotalUSD && balanceTotalUSD.sum) ?? null;
    const isBitcoinActive = network && isBitcoinNetwork(network);
    const address = network ? getAddressForChain(network.chainId, account) : '';
    const [cardHovered, setCardHovered] = useState<boolean>(false);

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

    const handleAccountClick = useCallback(
      async (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();

        if (isSelectable) {
          toggle(account.id);
        } else if (!isManageMode) {
          await activateAccount(account.id);
          history.replace('/home');
          await capture('AccountSelectorAccountSwitched', {
            type: account.type,
          });
        }
      },
      [
        account.id,
        account.type,
        activateAccount,
        capture,
        history,
        isManageMode,
        isSelectable,
        toggle,
      ]
    );

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

    const getBalance = useCallback(async () => {
      setIsBalanceLoading(true);
      await updateBalanceOnAllNetworks([account]);
      setIsBalanceLoading(false);
    }, [account, updateBalanceOnAllNetworks]);

    return (
      <Stack
        key={account.id}
        ref={ref}
        direction="row"
        sx={{
          px: 2,
          width: 1,
          cursor: 'pointer',
          opacity: isManageMode ? (isSelectable ? 1 : 0.6) : isActive ? 1 : 0.6,
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
        <Collapse in={isManageMode} orientation="horizontal" unmountOnExit>
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
        <Card elevation={1} sx={{ flexGrow: 1, backgroundColor: 'grey.850' }}>
          <CardContent
            sx={{ px: 2, py: 1, height: isImportedAccount ? 86 : 64 }}
          >
            <Stack>
              <Stack
                direction="row"
                sx={{ gap: 1, justifyContent: 'space-between' }}
              >
                {/* <Typography
                  variant="h6"
                  data-testid="account-name"
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {account.name}
                </Typography> */}
                <AccountName
                  accountName={account.name}
                  accountId={account.id}
                  cardHovered={cardHovered}
                />
                <Stack direction="row" sx={{ alignItems: 'center' }}>
                  <AccountBalance
                    refreshBalance={getBalance}
                    balanceTotalUSD={totalBalance}
                    isBalanceLoading={isBalanceLoading}
                    accountType={account.type}
                  />
                </Stack>
              </Stack>
              <Stack
                direction="row"
                data-testid="account-selector-copy-address"
                sx={{
                  gap: 1,
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                {address && (
                  <Tooltip title={address}>
                    <SimpleAddress
                      address={address}
                      iconColor="text.secondary"
                      textColor="text.secondary"
                      copyCallback={() => {
                        const eventName = isBitcoinActive
                          ? 'AccountSelectorBtcAddressCopied'
                          : 'AccountSelectorEthAddressCopied';

                        capture(eventName, {
                          type: account.type,
                        });
                      }}
                    />
                  </Tooltip>
                )}
                {!isManageMode && (
                  <AccountItemMenu
                    account={account}
                    isActive={isActive}
                    activateAccount={handleAccountClick}
                    walletType={walletType}
                  />
                )}
              </Stack>

              {isImportedAccount && (
                <Stack direction="row">
                  <AccountItemChip account={account} />
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    );
  }
);

AccountItem.displayName = 'AccountItem';
