import {
  Button,
  ChevronLeftIcon,
  Divider,
  IconButton,
  LoadingDotsIcon,
  Scrollbars,
  Stack,
  TrashIcon,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  useAccountsContext,
  useAnalyticsContext,
  useLedgerContext,
  useIsUsingKeystone3Wallet,
  useBalancesContext,
  useSettingsContext,
  useWalletContext,
  useAccountManager,
} from '@core/ui';
import { AccountType } from '@core/types';
import { isPrimaryAccount } from '@core/common';
import { LedgerApprovalDialog } from '@/pages/SignTransaction/components/LedgerApprovalDialog';
import { KeystoneApprovalDialog } from '@/pages/SignTransaction/components/KeystoneApprovalDialog';

import { NetworkSwitcher } from '@/components/common/header/NetworkSwitcher';
import { Overlay } from '@/components/common/Overlay';
import { useScopedToast } from '@/hooks/useScopedToast';

import { AccountListImported } from './components/AccountListImported';
import { AccountListPrimary } from './components/AccountListPrimary';
import { AccountsActionButton } from './components/AccountsActionButton';
import { OverflowingTypography } from './components/OverflowingTypography';
import { useAccountRemoval } from './hooks/useAccountRemoval';

export function Accounts() {
  const { t } = useTranslation();
  const {
    selectAccount,
    addAccount,
    accounts: { imported: importedAccounts, primary: primaryAccounts, active },
  } = useAccountsContext();
  const { isManageMode, toggleManageMode, selectedAccounts } =
    useAccountManager();

  const toast = useScopedToast('account-switcher');

  const [addAccountLoading, setAddAccountLoading] = useState(false);
  const { hasLedgerTransport } = useLedgerContext();
  const isUsingKeystone3 = useIsUsingKeystone3Wallet();
  const { capture } = useAnalyticsContext();
  const theme = useTheme();
  const history = useHistory();
  const { walletDetails } = useWalletContext();
  const { getTotalBalance, fetchBalanceForWallet, getWalletTotalBalance } =
    useBalancesContext();
  const { isLoading, totalBalanceInCurrency: activeWalletTotalBalance } =
    getWalletTotalBalance(
      isPrimaryAccount(active) ? active.walletId : undefined,
    );

  const canCreateAccount = active?.type === AccountType.PRIMARY;

  const activeAccountBalance = useMemo(
    () => (active?.addressC ? getTotalBalance(active.addressC) : null),
    [active?.addressC, getTotalBalance],
  );

  const addAccountAndFocus = async () => {
    setAddAccountLoading(true);

    try {
      const id = await addAccount();
      capture('CreatedANewAccountSuccessfully', {
        walletType: walletDetails?.type,
      });
      await selectAccount(id);

      // Refresh total balance of the wallet after adding an account
      if (walletDetails?.id) {
        fetchBalanceForWallet(walletDetails.id);
      }
    } catch (err) {
      console.error(err);
      toast.error(t('An error occurred, please try again later'));
    }

    setAddAccountLoading(false);
  };

  const hasImportedAccounts = Object.keys(importedAccounts).length > 0;

  const { currencyFormatter } = useSettingsContext();
  const { prompt: promptRemoval, renderDialog: confirmRemovalDialog } =
    useAccountRemoval(selectedAccounts);

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        background: theme.palette.background.paper,
      }}
    >
      {addAccountLoading && hasLedgerTransport && (
        <Overlay>
          <LedgerApprovalDialog header={t('Waiting for Ledger')} />
        </Overlay>
      )}
      {addAccountLoading && isUsingKeystone3 && (
        <Overlay>
          <KeystoneApprovalDialog header={t('Waiting for Keystone')} />
        </Overlay>
      )}
      {confirmRemovalDialog()}
      <Stack
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          pl: 0.25,
          pt: 1,
          pb: 0.5,
          pr: 2,
        }}
      >
        <IconButton
          onClick={() => history.replace('/home')}
          sx={{
            padding: 0.25,
            '> svg': {
              transition: 'color .15s ease-in-out, transform .15s ease-in-out',
            },
            ':hover svg': {
              color: theme.palette.secondary.lighter,
              transform: 'translateX(-2px)',
            },
          }}
          disableRipple
          data-testid="accounts-back-btn"
        >
          <ChevronLeftIcon size={32} />
        </IconButton>
        <NetworkSwitcher />
      </Stack>
      <Stack
        sx={{
          px: 2,
          py: 0.5,
        }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <OverflowingTypography
            variant="caption"
            color="text.secondary"
            data-testid="account-management-active-wallet"
          >
            {t('Currently using {{walletName}}', {
              walletName: isPrimaryAccount(active)
                ? walletDetails?.name
                : t('an imported account'),
            })}
          </OverflowingTypography>
          {isPrimaryAccount(active) && (
            <Typography
              variant="caption"
              fontWeight={500}
              textAlign="end"
              color="text.secondary"
              // Prevents UI from jumping due to LoadingDotsIcon being larger than they appear
              sx={isLoading ? { height: 15, overflow: 'hidden' } : null}
            >
              {isLoading ? (
                <LoadingDotsIcon size={20} orientation="horizontal" />
              ) : typeof activeWalletTotalBalance === 'number' ? (
                currencyFormatter(activeWalletTotalBalance)
              ) : null}
            </Typography>
          )}
        </Stack>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <OverflowingTypography
            variant="h5"
            fontSize={18}
            data-testid="account-management-active-account"
          >
            {active?.name}
          </OverflowingTypography>
          <Typography variant="h5" fontSize={18}>
            {typeof activeAccountBalance?.sum === 'number'
              ? currencyFormatter(activeAccountBalance.sum)
              : ''}
          </Typography>
        </Stack>
      </Stack>
      <Divider sx={{ borderColor: '#fff', opacity: 0.2 }} />
      <Stack
        sx={{
          flexDirection: 'row',
          width: 1,
          py: 0.75,
          pr: 1.5,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="text"
          size="small"
          onClick={toggleManageMode}
          data-testid="manage-accounts-button"
        >
          {isManageMode ? t('Cancel') : t('Manage')}
        </Button>
      </Stack>
      <Divider sx={{ borderColor: theme.palette.grey[800] }} />

      <Scrollbars>
        <AccountListPrimary primaryAccounts={primaryAccounts} />

        {hasImportedAccounts && (
          <AccountListImported accounts={Object.values(importedAccounts)} />
        )}
      </Scrollbars>
      <Stack
        direction="row"
        sx={{ py: 3, px: 2, justifyContent: 'center', alignItems: 'center' }}
      >
        {isManageMode && (
          <Button
            fullWidth
            size="large"
            disabled={selectedAccounts.length === 0}
            data-testid="delete-imported-account-button"
            onClick={() => {
              capture('ImportedAccountDeleteClicked');
              promptRemoval();
            }}
          >
            <TrashIcon size={14} sx={{ mr: 1 }} />
            {selectedAccounts.length <= 1
              ? t('Delete Account')
              : t('Delete Accounts')}
          </Button>
        )}
        {!isManageMode && (
          <AccountsActionButton
            isLoading={addAccountLoading}
            canCreateAccount={canCreateAccount}
            onAddNewAccount={addAccountAndFocus}
          />
        )}
      </Stack>
    </Stack>
  );
}
