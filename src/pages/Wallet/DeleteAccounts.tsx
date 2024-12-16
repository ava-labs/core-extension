import { useTranslation } from 'react-i18next';
import {
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';

import type {
  ImportedAccount,
  PrimaryAccount,
} from '@src/background/services/accounts/models';
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

export function DeleteAccount() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();

  const { action, updateAction, cancelHandler } = useApproveAction<{
    accounts: Record<string, ImportedAccount | PrimaryAccount>;
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

  const site: DomainMetadata = action.site ?? {
    domain: '#',
    name: t('Unknown website'),
  };

  return (
    <Stack sx={{ width: 1, px: 2 }}>
      <Stack sx={{ flexGrow: 1, width: 1, gap: 3 }}>
        <Typography variant="h4" sx={{ mt: 1.5, mb: 3.5 }}>
          {Object.keys(action.displayData.accounts).length === 1
            ? t('Delete account?')
            : t('Delete accounts?')}
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
              Object.keys(action.displayData.accounts).length === 1
                ? t('Account to delete')
                : t('Accounts to delete')
            }
          />
          <ApprovalSectionBody sx={{ py: 1, px: 2, gap: 1 }}>
            {Object.values(action.displayData.accounts).map((account, i) => (
              <Stack
                direction={'row'}
                sx={{ justifyContent: 'space-between' }}
                key={account.id}
              >
                <Typography>{account.name}</Typography>
                <Typography>{truncateAddress(account.addressC)}</Typography>
              </Stack>
            ))}
          </ApprovalSectionBody>
        </ApprovalSection>
      </Stack>
      <Stack sx={{ width: 1, justifyContent: 'space-between' }}>
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
            onClick={() => {
              updateAction({
                status: ActionStatus.SUBMITTING,
                id: requestId,
              });
            }}
            fullWidth
          >
            {t('Approve')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
