import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { Action, ActionStatus } from '@src/background/services/actions/models';
import { TokenIcon } from '@src/components/common/TokenIcon';
import { Network } from '@avalabs/chains-sdk';
import { useApproveAction } from '../../hooks/useApproveAction';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  CircularProgress,
  GlobeIcon,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import { SiteAvatar } from '@src/components/common/SiteAvatar';
import useWillSwitchToPrimaryAccount from '@src/hooks/useWillSwitchToPrimaryAccount';

export function SetDeveloperMode() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();

  const {
    action,
    updateAction: updateMessage,
    cancelHandler,
  } = useApproveAction(requestId);

  const willSwitchToPrimaryAccount = useWillSwitchToPrimaryAccount(
    action?.displayData.isTestmode
  );

  const request = action as Action;

  if (!request) {
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

  const network: Network = request.displayData;
  return (
    <Stack sx={{ py: 1, px: 2, width: 1, height: 1 }}>
      <Stack
        sx={{
          height: 1,
          width: 1,
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <SiteAvatar sx={{ mb: 3 }}>
          <TokenIcon height="48px" width="48px" src={network?.logoUri}>
            <GlobeIcon size={48} />
          </TokenIcon>
        </SiteAvatar>
        <Typography sx={{ pb: 2 }} variant="h4">
          {request.displayData?.isTestmode ? t('Activate') : t('Deactivate')}{' '}
          {t('Testnet Mode?')}
        </Typography>
        <Typography sx={{ textAlign: 'center' }} variant="body1">
          <Trans
            i18nKey={
              '{{domain}} is requesting to turn <br/>Testnet Mode {{mode}}'
            }
            values={{
              mode: request.displayData?.isTestmode ? t('ON') : t('OFF'),
              domain: request.site?.domain || t('This website'),
            }}
          />
        </Typography>
        {willSwitchToPrimaryAccount && (
          <Typography variant="caption" sx={{ mt: 3, color: 'warning.main' }}>
            {t(
              'Approving will also switch to your primary account, as Fireblocks-imported accounts are not supported in testnet mode at the moment.'
            )}
          </Typography>
        )}
      </Stack>

      <Stack
        sx={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'flex-end',
          flexGrow: 1,
          gap: 1,
        }}
      >
        <Button
          color="secondary"
          data-testid="transaction-reject-btn"
          size="large"
          fullWidth
          disabled={request.status === ActionStatus.SUBMITTING}
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
          disabled={request.status === ActionStatus.SUBMITTING}
          onClick={() => {
            updateMessage({
              status: ActionStatus.SUBMITTING,
              id: requestId,
            });

            window.close();
          }}
          width="168px"
        >
          {t('Approve')}
        </Button>
      </Stack>
    </Stack>
  );
}
