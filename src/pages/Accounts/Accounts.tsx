import { useState } from 'react';
import {
  HorizontalFlex,
  Overlay,
  useDialog,
  VerticalFlex,
} from '@avalabs/react-components';
import { toast } from '@avalabs/k2-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { AddAccountError } from './AddAccountError';
import { useLedgerContext } from '@src/contexts/LedgerProvider';
import { LedgerApprovalDialog } from '@src/pages/SignTransaction/LedgerApprovalDialog';
import { t } from 'i18next';
import { PageTitle } from '@src/components/common/PageTitle';
import { CreateAccountButton } from './CreateAccountButton';
import { MainList } from './MainList';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { Tabs } from '@src/components/common/Tabs';
import { ImportedList } from './ImportedList';
import { ActionButton, StyledTrashIcon } from './components/Buttons';
import { useTheme } from 'styled-components';

export enum AccountsTabs {
  MAIN = 'MAIN',
  IMPORTED = 'IMPORTED',
}

export interface AccountListProps {
  isEditing: boolean;
  onAccountClicked: (id: string) => Promise<void>;
  setIsEditing: (isEditing: boolean) => void;
}

export function Accounts() {
  const { selectAccount, addAccount, deleteAccounts } = useAccountsContext();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasError, setHasError] = useState(false);
  const [addAccountLoading, setAddAccountLoading] = useState<boolean>(false);
  const { hasLedgerTransport } = useLedgerContext();
  const { capture } = useAnalyticsContext();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const theme = useTheme();
  const [deleteIdList, setDeleteIdList] = useState<string[]>([]);
  const { showDialog, clearDialog } = useDialog();

  const addAccountAndFocus = async () => {
    setAddAccountLoading(true);
    try {
      setHasError(false);
      const id = await addAccount();
      await selectAccount(id);
      setIsEditing(true);
    } catch (e) {
      setHasError(true);
    }
    setAddAccountLoading(false);
  };

  const onAccountClicked = async (id: string) => {
    await selectAccount(id);
  };

  const onAccountDeleteSuccess = () => {
    capture('ImportedAccountDeleteSucceeded');
    toast.success(t('Account(s) Deleted!'), { duration: 2000 });
    setIsDeleteMode(false);
  };

  const onAccountDelete = () => {
    showDialog({
      title: t('Are You Sure?'),
      body: t(
        'Clicking “delete” will permanently remove this account from Core. To re-add this account you will need to enter the private key.'
      ),
      confirmText: t('Delete'),
      width: '343px',
      onConfirm: () => {
        clearDialog();
        deleteAccounts(deleteIdList).then(() => {
          onAccountDeleteSuccess();
        });
      },
      cancelText: t('Cancel'),
      onCancel: () => {
        clearDialog();
      },
    });
  };

  return (
    <VerticalFlex width="100%">
      {addAccountLoading && hasLedgerTransport && (
        <Overlay>
          <LedgerApprovalDialog />
        </Overlay>
      )}
      <PageTitle margin={'24px 0 0 0'}>{t('Accounts')}</PageTitle>

      {hasError && <AddAccountError />}
      <Tabs
        margin="14px 0 0"
        tabs={[
          {
            title: t('Main'),
            id: AccountsTabs.MAIN,
            component: (
              <MainList
                isEditing={isEditing}
                onAccountClicked={onAccountClicked}
                setIsEditing={setIsEditing}
              />
            ),
            onClick: () => {
              setIsDeleteMode(false);
              setIsEditing(false);
              capture('MainAccountPageClicked');
            },
          },
          {
            title: t('Imported'),
            id: AccountsTabs.IMPORTED,
            component: (
              <ImportedList
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
            ),
            onClick: () => {
              setIsEditing(false);
              capture('ImportedAccountPageClicked');
            },
          },
        ]}
      />
      <HorizontalFlex
        background={`${theme.colors.bg2}99`}
        justify="center"
        padding="12px 16px 24px"
        width="100%"
      >
        {isDeleteMode ? (
          <ActionButton
            onClick={() => {
              onAccountDelete();
              capture('ImportedAccountDeleteClicked');
            }}
            disabled={!deleteIdList.length}
            data-testid="delete-imported-account-button"
          >
            <StyledTrashIcon height="14px" />
            {t('Delete account(s)')}
          </ActionButton>
        ) : (
          <CreateAccountButton
            isLoading={addAccountLoading}
            addAccountAndFocus={addAccountAndFocus}
          />
        )}
      </HorizontalFlex>
    </VerticalFlex>
  );
}
