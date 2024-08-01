import { ActionStatus } from '@src/background/services/actions/models';
import { SiteAvatar } from '@src/components/common/SiteAvatar';
import { TokenIcon } from '@src/components/common/TokenIcon';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CircularProgress,
  GlobeIcon,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { AddCustomTokenData } from '@src/background/services/settings/models';

export function AddTokenApproval() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();
  const {
    action,
    updateAction: updateMessage,
    cancelHandler,
  } = useApproveAction<AddCustomTokenData>(requestId);

  if (!action || !action.displayData) {
    return (
      <Stack
        sx={{
          width: 1,
          height: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  const { token: customToken } = action.displayData;

  return (
    <>
      <Stack sx={{ flexGrow: 1, width: 1, px: 2, py: 1 }}>
        <Typography
          component="h1"
          sx={{ mt: 1, mb: 3, fontSize: 24, fontWeight: 'bold' }}
        >
          {t('Add New Asset?')}
        </Typography>
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <SiteAvatar sx={{ mb: 2 }}>
            <TokenIcon height="48px" width="48px" src={customToken.logoUri}>
              <GlobeIcon size={48} />
            </TokenIcon>
          </SiteAvatar>

          <Typography variant="h5">{customToken.name}</Typography>
          <Typography
            sx={{
              textAlign: 'center',
              maxWidth: 1,
              wordWrap: 'break-word',
              color: 'text.secondary',
            }}
            variant="caption"
          >
            {action?.site?.domain}
          </Typography>
        </Stack>

        <Card sx={{ flexGrow: 1 }}>
          <Scrollbars>
            <Stack sx={{ p: 2, width: 1 }}>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Name')}
                </Typography>

                <Typography variant="subtitle2">{customToken.name}</Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Symbol')}
                </Typography>

                <Typography variant="subtitle2">
                  {customToken.symbol}
                </Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Address')}
                </Typography>

                <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>
                  {customToken.address}
                </Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Decimals')}
                </Typography>

                <Typography variant="subtitle2">
                  {customToken.decimals}
                </Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Contract Type')}
                </Typography>

                <Typography variant="subtitle2">
                  {customToken.contractType}
                </Typography>
              </Stack>
            </Stack>
          </Scrollbars>
        </Card>
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            width: '100%',
            justifyContent: 'space-between',
            pt: 3,
            gap: 1,
          }}
        >
          <Button
            color="secondary"
            data-testid="transaction-reject-btn"
            size="large"
            fullWidth
            disabled={action.status === ActionStatus.SUBMITTING}
            onClick={() => {
              cancelHandler();
              window.close();
            }}
          >
            {t('Reject')}
          </Button>
          <Button
            data-testid="transaction-approve-btn"
            size="large"
            fullWidth
            disabled={
              action.status === ActionStatus.SUBMITTING || !!action.error
            }
            onClick={() => {
              updateMessage({
                status: ActionStatus.SUBMITTING,
                id: requestId,
              });
            }}
          >
            {t('Approve')}
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
