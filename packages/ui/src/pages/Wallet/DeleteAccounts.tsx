import { useTranslation } from 'react-i18next';
import {
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { useApproveAction } from '@/hooks/useApproveAction';
import { ActionStatus } from '@core/types';
import { useGetRequestId } from '@/hooks/useGetRequestId';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@/components/common/approval/ApprovalSection';
import { WebsiteDetails } from '../SignTransaction/components/ApprovalTxDetails';
import type { DomainMetadata } from '@core/types';
import { truncateAddress } from '@core/utils';
import type { DeleteAccountsDisplayData } from '@core/service-worker';
import { AccountType } from '@core/types';

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
    action.displayData.accounts.primary,
  ).flat().length;

  const accountsCount =
    action.displayData.accounts.imported.length + primaryAccountsCount;

  const site: DomainMetadata = action.site ?? {
    domain: '#',
    name: t('Unknown website'),
  };

  const getImportedAccountType = (
    type:
      | AccountType.IMPORTED
      | AccountType.WALLET_CONNECT
      | AccountType.FIREBLOCKS,
  ) => {
    switch (type) {
      case AccountType.IMPORTED:
        return t('From Private Key');
      case AccountType.WALLET_CONNECT:
        return t('From Wallet Connect');
      default:
        return t('From Fireblocks');
    }
  };

  return (
    <Stack sx={{ width: 1, px: 2 }}>
      <Stack sx={{ flexGrow: 1, width: 1, gap: 3 }}>
        <Typography variant="h4" sx={{ mt: 1.5, mb: 3.5 }}>
          {accountsCount === 1 ? t('Remove Account?') : t('Remove Accounts?')}
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
                ? t('Account to be Removed')
                : t('Accounts to be Removed')
            }
          />
          <ApprovalSectionBody sx={{ py: 1, px: 2, gap: 1 }}>
            {Object.keys(action.displayData.accounts.primary) &&
              Object.entries(action.displayData.accounts.primary).map(
                ([walletId, primaryAccounts], i) => (
                  <Stack key={walletId} sx={{ mt: i === 0 ? 0 : 1 }}>
                    {primaryAccounts.map((primaryAccount) => (
                      <Stack key={primaryAccount.id}>
                        <Stack
                          direction={'row'}
                          sx={{ justifyContent: 'space-between' }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 600 }}
                          >
                            {primaryAccount.name}
                          </Typography>
                          <Typography variant="caption">
                            {truncateAddress(primaryAccount.addressC)}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          {t('From')}{' '}
                          {action.displayData.accounts.wallet[walletId]}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                ),
              )}

            {!!action.displayData.accounts.imported.length && (
              <Stack sx={{ mt: 1 }}>
                {action.displayData.accounts.imported.map((importedAccount) => (
                  <Stack key={importedAccount.id}>
                    <Stack
                      direction={'row'}
                      sx={{ justifyContent: 'space-between' }}
                      key={importedAccount.id}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {importedAccount.name}
                      </Typography>
                      <Typography variant="caption">
                        {truncateAddress(importedAccount.addressC)}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {getImportedAccountType(importedAccount.type)}
                    </Typography>
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
              'Removing the account will delete all local account information stored on this computer. Your assets on chain will remain on chain.',
            )}
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button
            color="secondary"
            size="large"
            data-testid="delete-account-reject-btn"
            onClick={() => {
              cancelHandler();
              window.close();
            }}
            fullWidth
          >
            {t('Reject')}
          </Button>
          <Button
            data-testid="delete-account-approve-btn"
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
            {t('Remove')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
