import { useEffect, useRef, useState } from 'react';
import {
  ComponentSize,
  HorizontalFlex,
  HorizontalSeparator,
  LoadingSpinnerIcon,
  Overlay,
  PrimaryButton,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { AccountItem } from './AccountItem';
import {
  Scrollbars,
  ScrollbarsRef,
} from '@src/components/common/scrollbars/Scrollbars';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { AddAccountError } from './AddAccountError';
import { useLedgerContext } from '@src/contexts/LedgerProvider';
import { LedgerApprovalDialog } from '@src/pages/SignTransaction/LedgerApprovalDialog';
import { t } from 'i18next';
import { PageTitle } from '@src/components/common/PageTitle';

export function Accounts() {
  const { accounts, activeAccount, selectAccount, addAccount } =
    useAccountsContext();

  const theme = useTheme();
  const scrollbarsRef = useRef<ScrollbarsRef>(null);

  const [editing, isEditing] = useState<boolean>(false);
  const [hasError, setHasError] = useState(false);
  const [accountIndexLoading, setAccountIndexLoading] = useState<number | null>(
    null
  );
  const [addAccountLoading, setAddAccountLoading] = useState<boolean>(false);
  const { capture } = useAnalyticsContext();
  const { hasLedgerTransport } = useLedgerContext();

  const addAccountAndFocus = async () => {
    setAddAccountLoading(true);
    try {
      setHasError(false);
      await addAccount();
      const nextIndex = accounts.length;
      await selectAccount(nextIndex);
      isEditing(true);
      scrollbarsRef.current?.scrollToBottom();
    } catch (e) {
      setHasError(true);
    }
    setAddAccountLoading(false);
  };

  useEffect(() => {
    if (activeAccount) {
      scrollbarsRef.current?.scrollTop(50 * activeAccount.index);
    }
    // only scroll to the selected account on the first open
    // new selects will always be in the view since the user had to click them
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAccountClicked = async (index: number) => {
    setAccountIndexLoading(index);
    await selectAccount(index);
    setAccountIndexLoading(null);
  };

  return (
    <VerticalFlex width="100%">
      {addAccountLoading && hasLedgerTransport && (
        <Overlay>
          <LedgerApprovalDialog />
        </Overlay>
      )}
      <Scrollbars
        style={{
          flexGrow: 1,
          maxHeight: 'unset',
          height: '100%',
          width: '100%',
        }}
        autoHide={false}
        ref={scrollbarsRef}
      >
        <VerticalFlex padding="0 0 16px 0">
          {hasError && <AddAccountError />}
          <PageTitle margin={'24px 0'}>{t('Accounts')}</PageTitle>
          {accounts.map((account, i) => {
            return (
              <VerticalFlex
                data-testid={`account-${i}`}
                key={account.addressC}
                onClick={() => !editing && onAccountClicked(account.index)}
                width="100%"
              >
                <AccountItem
                  account={account}
                  editing={editing}
                  onEdit={() => isEditing(true)}
                  onSave={() => isEditing(false)}
                  isLoadingIndex={accountIndexLoading}
                />
                {i < accounts.length - 1 && (
                  <HorizontalSeparator
                    color={`${theme.colors.bg3}80`}
                    margin="0 16px"
                    width="auto"
                  />
                )}
              </VerticalFlex>
            );
          })}
        </VerticalFlex>
      </Scrollbars>
      <HorizontalFlex
        background={`${theme.colors.bg2}99`}
        justify="center"
        padding="12px 16px 24px"
        width="100%"
      >
        <PrimaryButton
          data-testid="add-account-button"
          size={ComponentSize.LARGE}
          disabled={addAccountLoading}
          width="100%"
          onClick={() => {
            capture('AccountSelectorAddAccount', {
              accountNumber: accounts.length + 1,
            });
            addAccountAndFocus();
          }}
        >
          {addAccountLoading ? (
            <LoadingSpinnerIcon color={theme.colors.icon1} height="24px" />
          ) : (
            t('Add Account')
          )}
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
