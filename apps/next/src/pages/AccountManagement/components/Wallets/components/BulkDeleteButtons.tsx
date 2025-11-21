import { AccountManagementRouteState } from '@/pages/AccountManagement/types';
import { URL_SEARCH_TOKENS } from '@/pages/AccountManagement/utils/searchParams';
import { Box, Button, Slide, Stack } from '@avalabs/k2-alpine';
import { Account, IMPORTED_ACCOUNTS_WALLET_ID } from '@core/types';
import {
  useAccountManager,
  useAccountsContext,
  useAnalyticsContext,
} from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

export const BulkDeleteButtons: FC = () => {
  const { t } = useTranslation();
  const { isManageMode, toggleManageMode, exitManageMode, selectedAccounts } =
    useAccountManager();
  const { allAccounts } = useAccountsContext();
  const { capture } = useAnalyticsContext();
  const [showButtons, setShowButtons] = useState(isManageMode);
  const { push } = useHistory<AccountManagementRouteState>();

  return (
    <>
      {!isManageMode && (
        <Box mx="auto">
          <Button
            variant="contained"
            size="xsmall"
            color="secondary"
            onClick={() => {
              toggleManageMode();
              setShowButtons(true);
            }}
          >
            {t('Manage')}
          </Button>
        </Box>
      )}
      <Slide
        direction="up"
        in={isManageMode && showButtons}
        mountOnEnter
        unmountOnExit
        onExited={() => exitManageMode()}
      >
        <Stack direction="column" gap={1} marginTop="auto">
          <Button
            variant="contained"
            color="primary"
            size="extension"
            fullWidth
            disabled={selectedAccounts.length === 0}
            onClick={() => {
              const selectedAccountsData = selectedAccounts
                .map((id) => allAccounts.find((acc) => acc.id === id))
                .filter((account): account is Account & { walletId?: string } =>
                  Boolean(account),
                );
              const hasImportedAccount = selectedAccountsData.some(
                (account) =>
                  'walletId' in account &&
                  account.walletId === IMPORTED_ACCOUNTS_WALLET_ID,
              );
              if (hasImportedAccount) {
                capture('ImportedAccountDeleteClicked');
              }
              push(
                {
                  pathname: '/account-management/delete-account',
                  search: new URLSearchParams(
                    selectedAccounts.map((id) => [
                      URL_SEARCH_TOKENS.account,
                      id,
                    ]),
                  ).toString(),
                },
                { bulkMode: true },
              );
            }}
          >
            {t('Delete selected')}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="extension"
            fullWidth
            onClick={() => setShowButtons(false)}
          >
            {t('Cancel')}
          </Button>
        </Stack>
      </Slide>
    </>
  );
};
