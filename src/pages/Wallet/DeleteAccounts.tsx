import { useTranslation } from 'react-i18next';
import {
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { ActionStatus } from '@src/background/services/actions/models';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { WebsiteDetails } from '../SignTransaction/components/ApprovalTxDetails';
import type { DomainMetadata } from '@src/background/models';
import { truncateAddress } from '@src/utils/truncateAddress';
import type { DeleteAccountsDisplayData } from '@src/background/services/accounts/handlers/avalanche_deleteAccounts';

export function DeleteAccount() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();

  const { action, updateAction, cancelHandler } = useApproveAction<{
    accounts: DeleteAccountsDisplayData;
  }>(requestId);

  if (!action) {
    return (
      <Stack
        sx={{
          width: 1,
          height: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={60} />
      </Stack>
    );
  }

  const primaryAccountsCount = Object.values(
    action.displayData.accounts.primary
  ).flat().length;

  const accountsCount =
    action.displayData.accounts.imported.length + primaryAccountsCount;

  const site: DomainMetadata = action.site ?? {
    domain: '#',
    name: t('Unknown website'),
  };

  return (
    <Stack sx={{ width: 1, px: 2 }}>
      <Stack sx={{ flexGrow: 1, width: 1, gap: 3 }}>
        <Typography variant="h4" sx={{ mt: 1.5, mb: 3.5 }}>
          {accountsCount === 1 ? t('Delete Account?') : t('Delete Accounts?')}
        </Typography>
        <ApprovalSection>
          <ApprovalSectionHeader label={t('Action Details')} />
          <ApprovalSectionBody sx={{ py: 1, px: 2, gap: 1 }}>
            <WebsiteDetails site={site} />
          </ApprovalSectionBody>
        </ApprovalSection>
        <ApprovalSection>
          <ApprovalSectionHeader
            label={
              accountsCount === 1
                ? t('Account to be Deleted')
                : t('Accounts to be Deleted')
            }
          />
          <ApprovalSectionBody sx={{ py: 1, px: 2, gap: 1 }}>
            {Object.keys(action.displayData.accounts.primary) &&
              Object.entries(action.displayData.accounts.primary).map(
                ([walletId, primaryAccounts], i) => (
                  <Stack key={walletId} sx={{ mt: i === 0 ? 0 : 2 }}>
                    <Stack>
                      <Typography sx={{ fontWeight: 600, mb: 1 }}>
                        {action.displayData.accounts.wallet[walletId]}
                      </Typography>
                    </Stack>
                    {primaryAccounts.map((primaryAccount) => (
                      <Stack
                        direction={'row'}
                        sx={{ justifyContent: 'space-between' }}
                        key={primaryAccount.id}
                      >
                        <Typography>{primaryAccount.name}</Typography>
                        <Typography>
                          {truncateAddress(primaryAccount.addressC)}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                )
              )}

            {action.displayData.accounts.imported.length && (
              <Stack sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  {action.displayData.accounts.imported.length === 1
                    ? t('Imported Account')
                    : t('Imported Accounts')}
                </Typography>
                {action.displayData.accounts.imported.map((importedAccount) => (
                  <Stack key={importedAccount.id}>
                    <Stack
                      direction={'row'}
                      sx={{ justifyContent: 'space-between' }}
                      key={importedAccount.id}
                    >
                      <Typography>{importedAccount.name}</Typography>
                      <Typography>
                        {truncateAddress(importedAccount.addressC)}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </ApprovalSectionBody>
        </ApprovalSection>
      </Stack>
      <Stack sx={{ width: 1, justifyContent: 'space-between' }}>
        <Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 2 }}
          >
            {t(
              'Removing the account will delete all local account information stored on this computer. Your assets on chain will remain on chain.'
            )}
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button
            color="secondary"
            size="large"
            data-testid="switch-account-reject-btn"
            onClick={() => {
              cancelHandler();
              window.close();
            }}
            fullWidth
          >
            {t('Reject')}
          </Button>
          <Button
            data-testid="switch-account-approve-btn"
            size="large"
            color="primary"
            sx={{ color: 'error.main' }}
            onClick={() => {
              updateAction({
                status: ActionStatus.SUBMITTING,
                id: requestId,
              });
            }}
            fullWidth
          >
            {t('Delete')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
