import { useState, useMemo } from 'react';
import {
  Button,
  ChevronLeftIcon,
  Divider,
  IconButton,
  Scrollbars,
  Stack,
  TrashIcon,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { t } from 'i18next';
import { useHistory } from 'react-router-dom';
import { TokenType } from '@avalabs/vm-module-types';

import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useLedgerContext } from '@src/contexts/LedgerProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { LedgerApprovalDialog } from '@src/pages/SignTransaction/components/LedgerApprovalDialog';

import { AccountType } from '@src/background/services/accounts/models';
import { useLiveBalance } from '@src/hooks/useLiveBalance';
import { useScopedToast } from '@src/hooks/useScopedToast';
import { NetworkSwitcher } from '@src/components/common/header/NetworkSwitcher';
import { Overlay } from '@src/components/common/Overlay';
import { isPrimaryAccount } from '@src/background/services/accounts/utils/typeGuards';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

import { useAccountManager } from './providers/AccountManagerProvider';
import { useAccountRemoval } from './hooks/useAccountRemoval';
import { AccountListPrimary } from './components/AccountListPrimary';
import { AccountListImported } from './components/AccountListImported';
import { AccountsActionButton } from './components/AccountsActionButton';
import { OverflowingTypography } from './components/OverflowingTypography';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

export function Accounts() {
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
  const { capture } = useAnalyticsContext();
  const theme = useTheme();
  const history = useHistory();
  const { walletDetails } = useWalletContext();

  const canCreateAccount = active?.type === AccountType.PRIMARY;
  const { getTotalBalance } = useBalancesContext();

  const activeAccountBalance = useMemo(
    () => (active?.addressC ? getTotalBalance(active.addressC) : null),
    [active?.addressC, getTotalBalance]
  );

  useLiveBalance(POLLED_BALANCES);

  const addAccountAndFocus = async () => {
    setAddAccountLoading(true);

    try {
      const id = await addAccount();
      capture('CreatedANewAccountSuccessfully', {
        walletType: walletDetails?.type,
      });
      await selectAccount(id);
    } catch (e) {
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
          <OverflowingTypography variant="caption" color="text.secondary">
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
              fontSize={13}
              textAlign="end"
              color="text.secondary"
            >
              {/* TODO: total balance of the active wallet */}
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
          <OverflowingTypography variant="h5" fontSize={18}>
            {active?.name}
          </OverflowingTypography>
          <Typography variant="h5" fontSize={18}>
            {activeAccountBalance?.sum
              ? currencyFormatter(activeAccountBalance.sum)
              : '...'}
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
        <AccountListPrimary primaryAccount={primaryAccounts} />

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
            createAccountTooltip={
              canCreateAccount ? '' : t('Please select a wallet')
            }
            onAddNewAccount={addAccountAndFocus}
          />
        )}
      </Stack>
    </Stack>
  );
}
