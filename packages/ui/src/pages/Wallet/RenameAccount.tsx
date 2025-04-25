import { useTranslation } from 'react-i18next';
import {
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';

import { Account } from '@core/service-worker';
import { useApproveAction } from '@/hooks/useApproveAction';
import { ActionStatus } from '@core/service-worker';
import { useGetRequestId } from '@/hooks/useGetRequestId';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@/components/common/approval/ApprovalSection';
import { TxDetailsRow } from '@/components/common/approval/TxDetailsRow';
import {
  AccountDetails,
  WebsiteDetails,
} from '../SignTransaction/components/ApprovalTxDetails';
import { DomainMetadata } from '@core/service-worker';

export function RenameAccount() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();

  const { action, updateAction, cancelHandler } = useApproveAction<{
    account: Account;
    newName: string;
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
          {t('Rename account?')}
        </Typography>
        <ApprovalSection>
          <ApprovalSectionHeader label={t('Action Details')} />
          <ApprovalSectionBody sx={{ py: 1, px: 2, gap: 1 }}>
            <WebsiteDetails site={site} />
          </ApprovalSectionBody>
        </ApprovalSection>
        <ApprovalSection>
          <ApprovalSectionHeader label={t('Account Details')} />
          <ApprovalSectionBody sx={{ py: 1, px: 2, gap: 1 }}>
            <AccountDetails
              address={action.displayData.account.addressC}
              label={t('Account to rename')}
            />
            <TxDetailsRow label={t('New name')}>
              <Typography variant="caption">
                {action.displayData.newName}
              </Typography>
            </TxDetailsRow>
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
