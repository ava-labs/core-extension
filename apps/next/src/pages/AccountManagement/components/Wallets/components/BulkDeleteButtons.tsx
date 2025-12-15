import { URL_SEARCH_TOKENS } from '@/pages/AccountManagement/utils/searchParams';
import { alpha, Box, Button, Slide, Stack, styled } from '@avalabs/k2-alpine';
import { isPrimaryAccount } from '@core/common';
import { IMPORTED_ACCOUNTS_WALLET_ID } from '@core/types';
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
  const { push } = useHistory();

  return (
    <BulkDeleteButtonsContainer
      sx={{ height: isManageMode ? '122px' : '75px' }}
    >
      {!isManageMode && (
        <Box mx="auto" marginTop="auto">
          <Button
            variant="contained"
            size="xsmall"
            color="secondary"
            sx={{ fontSize: '11px' }}
            onClick={() => {
              toggleManageMode();
              setShowButtons(true);
            }}
          >
            {t('Manage wallets')}
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
                .filter(isPrimaryAccount);
              const hasImportedAccount = selectedAccountsData.some(
                (account) =>
                  'walletId' in account &&
                  account.walletId === IMPORTED_ACCOUNTS_WALLET_ID,
              );
              if (hasImportedAccount) {
                capture('ImportedAccountDeleteClicked');
              }
              const params = new URLSearchParams(
                selectedAccounts.map((id) => [URL_SEARCH_TOKENS.account, id]),
              );
              params.set(URL_SEARCH_TOKENS.bulkMode, 'true');
              push({
                pathname: '/account-management/delete-account',
                search: params.toString(),
              });
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
    </BulkDeleteButtonsContainer>
  );
};

const BulkDeleteButtonsContainer = styled(Stack)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  zIndex: 100,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1.5),
  marginLeft: `-${theme.spacing(1.5)}`,
  paddingInline: theme.spacing(2),
  marginRight: `-${theme.spacing(1.5)}`,
  marginBottom: `-${theme.spacing(1.5)}`,
  background: `linear-gradient(180deg, ${alpha(theme.palette.mode === 'light' ? theme.palette.background.paper : theme.palette.background.default, 0)} 0%, 
	${theme.palette.mode === 'light' ? theme.palette.background.paper : theme.palette.background.default} 32px)`,

  '> div': {
    background: 'unset',
  },
}));
