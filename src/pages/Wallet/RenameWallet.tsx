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
import { TxDetailsRow } from '@src/components/common/approval/TxDetailsRow';
import {
  AccountDetails,
  WebsiteDetails,
} from '../SignTransaction/components/ApprovalTxDetails';
import { DomainMetadata } from '@src/background/models';

export function RenameWallet() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();

  const { action, updateAction, cancelHandler } =
    useApproveAction<{ walletId: string; newName: string }>(requestId);

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
          {t('Rename Wallet?')}
        </Typography>
        <ApprovalSection>
          <ApprovalSectionHeader label={t('Wallet Details')} />
          <ApprovalSectionBody sx={{ py: 1, px: 2, gap: 1 }}>
            <WebsiteDetails site={site} />
          </ApprovalSectionBody>
        </ApprovalSection>
        <ApprovalSection>
          <ApprovalSectionHeader label={t('Wallet Details')} />
          <ApprovalSectionBody sx={{ py: 1, px: 2, gap: 1 }}>
            <AccountDetails
              address={action.displayData.walletId}
              label={t('Wallet ID to rename')}
            />
            <TxDetailsRow label={t('New Wallet Name')}>
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
            data-testid="rename-wallet-reject-btn"
            onClick={() => {
              cancelHandler();
              window.close();
            }}
            fullWidth
          >
            {t('Reject')}
          </Button>
          <Button
            data-testid="rename-wallet-approve-btn"
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
