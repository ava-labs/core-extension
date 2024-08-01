import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  CircularProgress,
  CopyIcon,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  WalletIcon,
  toast,
  useTheme,
} from '@avalabs/core-k2-components';

import { Account } from '@src/background/services/accounts/models';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { ActionStatus } from '@src/background/services/actions/models';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { truncateAddress } from '@src/utils/truncateAddress';

export function SwitchAccount() {
  const theme = useTheme();
  const { t } = useTranslation();
  const requestId = useGetRequestId();

  const {
    action,
    updateAction: updateMessage,
    cancelHandler,
  } = useApproveAction<{ selectedAccount: Account }>(requestId);

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

  return (
    <Stack sx={{ width: 1, px: 2 }}>
      <Stack
        sx={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 2,
          maxWidth: 1,
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            backgroundColor: theme.palette.grey[850],
          }}
        >
          <WalletIcon size={48} />
        </Avatar>
        <Typography variant="h4">
          {t('Switch to {{name}}?', {
            name: action.displayData.selectedAccount?.name,
          })}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            maxWidth: 1,
            wordWrap: 'break-word',
            color: 'text.secondary',
          }}
        >
          {t('{{domain}} is requesting to switch your active account.', {
            domain: action.site?.domain || 'This website',
          })}
        </Typography>
        <Stack
          direction="row"
          sx={{
            gap: 1,
            py: 1,
            pl: 2,
            pr: 1,
            alignItems: 'center',
            background: theme.palette.grey[850],
            borderRadius: 1,
            height: 48,
            width: 1,
          }}
        >
          <Stack
            direction="row"
            sx={{
              flex: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
              width: 1,
              gap: 3,
            }}
          >
            <Tooltip
              title={action.displayData.selectedAccount?.name}
              wrapWithSpan={false}
            >
              <Typography
                variant="body1"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {action.displayData.selectedAccount?.name}
              </Typography>
            </Tooltip>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <Tooltip title={action.displayData.selectedAccount?.addressC}>
                <Typography variant="body2">
                  {truncateAddress(
                    action.displayData.selectedAccount?.addressC
                  )}
                </Typography>
              </Tooltip>
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(
                    action.displayData.selectedAccount.addressC
                  );
                  toast.success(t('Copied!'), { duration: 2000 });
                }}
              >
                <CopyIcon size={16} />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
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
              updateMessage({
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
