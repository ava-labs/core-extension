import { LoadingSpinnerIcon } from '@avalabs/react-components';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useTabFromParams } from '@src/hooks/useTabFromParams';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { AccountsTabs } from './Accounts';
import {
  ActionButton,
  StyledKeyIcon,
  StyledPlusIcon,
} from './components/Buttons';

export interface CreateAccountButtonProps {
  isLoading: boolean;
  addAccountAndFocus: () => Promise<void>;
}

export function CreateAccountButton({
  isLoading,
  addAccountAndFocus,
}: CreateAccountButtonProps) {
  const theme = useTheme();
  const history = useHistory();
  const { capture } = useAnalyticsContext();
  const { t } = useTranslation();
  const {
    accounts: { primary: primaryAccounts },
  } = useAccountsContext();
  const { activeTab } = useTabFromParams();
  return (
    <>
      {(!activeTab || activeTab === AccountsTabs.MAIN) && (
        <ActionButton
          onClick={() => {
            capture('AccountSelectorAddAccount', {
              accountNumber: primaryAccounts.length + 1,
            });
            addAccountAndFocus();
          }}
          disabled={isLoading}
          data-testid="add-primary-account-button"
        >
          {isLoading ? (
            <LoadingSpinnerIcon color={theme.colors.text1} height="24px" />
          ) : (
            <>
              <StyledPlusIcon height="14px" />
              {t('Create Account')}
            </>
          )}
        </ActionButton>
      )}
      {activeTab === AccountsTabs.IMPORTED && (
        <ActionButton
          onClick={() => history.replace('/import-private-key')}
          data-testid="add-imported-account-button"
        >
          <>
            <StyledKeyIcon height="14px" />
            {t('Import Private Key')}
          </>
        </ActionButton>
      )}
    </>
  );
}
