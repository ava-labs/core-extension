import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Tab,
  TabPanel,
  Tabs,
  TrashIcon,
  toast,
  useTheme,
} from '@avalabs/k2-components';
import { t } from 'i18next';
import { useHistory } from 'react-router-dom';

import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useLedgerContext } from '@src/contexts/LedgerProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { LedgerApprovalDialog } from '@src/pages/SignTransaction/LedgerApprovalDialog';
import { PageTitle } from '@src/components/common/PageTitle';
import { Overlay } from '@src/components/common/Overlay';
import { useTabFromParams } from '@src/hooks/useTabFromParams';
import { Account } from '@src/background/services/accounts/models';

import { AccountsActionButton } from './components/AccountsActionButton';
import { AddAccountError } from './AddAccountError';
import { AccountList } from './AccountList';
import { ConfirmAccountRemovalDialog } from './components/ConfirmAccountRemovalDialog';

export enum AccountsTab {
  Primary = 'primary',
  Imported = 'imported',
}

const isKnownTab = (tab: string): tab is AccountsTab =>
  Object.values<string>(AccountsTab).includes(tab);

export function Accounts() {
  const {
    selectAccount,
    addAccount,
    deleteAccounts,
    accounts: {
      imported: importedAccounts,
      primary: regularAccounts,
      active: activeAccount,
    },
  } = useAccountsContext();

  const { activeTab: tabFromUrl } = useTabFromParams();
  const activeTab = isKnownTab(tabFromUrl) ? tabFromUrl : AccountsTab.Primary;
  const [isEditing, setIsEditing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [addAccountLoading, setAddAccountLoading] = useState(false);
  const { hasLedgerTransport } = useLedgerContext();
  const { capture } = useAnalyticsContext();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const theme = useTheme();
  const [deleteIdList, setDeleteIdList] = useState<string[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const history = useHistory();

  const setActiveTab = useCallback(
    (tab: AccountsTab) => {
      // Avoid unnecessary re-renders
      if (tab === tabFromUrl) {
        return;
      }

      history.replace(
        `/accounts?activeTab=${isKnownTab(tab) ? tab : AccountsTab.Primary}`
      );
    },
    [history, tabFromUrl]
  );

  const addAccountAndFocus = async () => {
    setAddAccountLoading(true);

    try {
      setHasError(false);
      const id = await addAccount();
      await selectAccount(id);

      // Make sure we land on the Primary accounts list, since the account
      // creation can be triggered from Imported accounts list as well.
      //
      // IMPORTANT:
      // The switch needs to happen AFTER the account was created.
      // Otherwise it will trigger the useIsIncorrectDevice() hook
      // which will then block the transport for addAccount() call and
      // cause account creation to break for Ledger wallets.
      setActiveTab(AccountsTab.Primary);
      setIsEditing(true);
    } catch (e) {
      setHasError(true);
    }

    setAddAccountLoading(false);
  };

  const onAccountClicked = async (account: Account) => {
    await selectAccount(account.id);
    await capture('AccountSelectorAccountSwitched', { type: account.type });
  };

  const onAccountDeleteSuccess = () => {
    capture('ImportedAccountDeleteSucceeded');
    toast.success(t('Account(s) Deleted!'), { duration: 2000 });
    setIsDeleteMode(false);
    setIsConfirmDialogOpen(false);
  };

  const onAccountDelete = () => {
    deleteAccounts(deleteIdList).then(() => {
      onAccountDeleteSuccess();
    });
  };

  const hasAnyAccounts = regularAccounts.length > 0;
  const hasImportedAccounts = Object.keys(importedAccounts).length > 0;

  useEffect(() => {
    if (hasAnyAccounts && !hasImportedAccounts) {
      setActiveTab(AccountsTab.Primary);
    }
  }, [hasAnyAccounts, hasImportedAccounts, setActiveTab]);

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
      <ConfirmAccountRemovalDialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={onAccountDelete}
        isMultiple={deleteIdList.length > 1}
      />
      <PageTitle margin={'22px 0 4px 0'}>{t('Accounts')}</PageTitle>

      {hasError && <AddAccountError />}

      {hasImportedAccounts && (
        <Tabs
          size="medium"
          label={t('Main')}
          variant="fullWidth"
          indicatorColor="secondary"
          value={activeTab}
          onChange={(_, tab) => {
            capture(
              tab === AccountsTab.Primary
                ? 'MainAccountPageClicked'
                : 'ImportedAccountPageClicked'
            );
            setIsDeleteMode(false);
            setIsEditing(false);
            setActiveTab(tab);
          }}
        >
          <Tab
            label={t('Main')}
            value={AccountsTab.Primary}
            size="medium"
            data-testid="main-tab-button"
          />
          <Tab
            label={t('Imported')}
            value={AccountsTab.Imported}
            size="medium"
            data-testid="imported-tab-button"
          />
        </Tabs>
      )}
      <Box
        sx={{
          width: '100%',
          borderTop: hasImportedAccounts ? 1 : 0,
          borderColor: 'divider',
          mt: -0.25,
          pt: hasImportedAccounts ? 0.75 : 2,
          flexGrow: 1,
          overflow: 'hidden',
        }}
      >
        <TabPanel
          value={activeTab}
          index={AccountsTab.Primary}
          sx={{
            display: 'flex',
            height: activeTab === AccountsTab.Primary ? '100%' : 0,
          }}
        >
          <AccountList
            allowDeleting={false}
            accounts={regularAccounts}
            activeAccount={activeAccount}
            isEditing={isEditing}
            onAccountClicked={onAccountClicked}
            setIsEditing={setIsEditing}
            isDeleteMode={isDeleteMode}
            setIsDeleteMode={(status) => {
              setDeleteIdList([]);
              setIsDeleteMode(status);
            }}
            deleteIdList={deleteIdList}
            setDeleteIdList={setDeleteIdList}
          />
        </TabPanel>
        <TabPanel
          value={activeTab}
          index={AccountsTab.Imported}
          sx={{
            display: 'flex',
            height: activeTab === AccountsTab.Imported ? '100%' : 0,
          }}
        >
          <AccountList
            allowDeleting
            accounts={Object.values(importedAccounts)}
            activeAccount={activeAccount}
            isEditing={isEditing}
            onAccountClicked={onAccountClicked}
            setIsEditing={setIsEditing}
            isDeleteMode={isDeleteMode}
            setIsDeleteMode={(status) => {
              setDeleteIdList([]);
              setIsDeleteMode(status);
            }}
            deleteIdList={deleteIdList}
            setDeleteIdList={setDeleteIdList}
          />
        </TabPanel>
      </Box>
      <Stack
        direction="row"
        sx={{ py: 3, px: 2, justifyContent: 'center', alignItems: 'center' }}
      >
        {isDeleteMode ? (
          <Button
            fullWidth
            size="large"
            disabled={deleteIdList.length === 0}
            data-testid="delete-imported-account-button"
            onClick={() => {
              capture('ImportedAccountDeleteClicked');
              setIsConfirmDialogOpen(true);
            }}
          >
            <TrashIcon size={14} sx={{ mr: 1 }} />
            {deleteIdList.length <= 1
              ? t('Delete Account')
              : t('Delete Accounts')}
          </Button>
        ) : (
          <AccountsActionButton
            disabled={addAccountLoading}
            onAddNewAccount={addAccountAndFocus}
            mode={activeTab}
          />
        )}
      </Stack>
    </Stack>
  );
}
