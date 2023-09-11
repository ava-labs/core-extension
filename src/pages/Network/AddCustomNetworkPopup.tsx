import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { ActionStatus } from '@src/background/services/actions/models';
import { TokenIcon } from '@src/components/common/TokenIcon';
import { useEffect } from 'react';
import { useApproveAction } from '../../hooks/useApproveAction';
import { Network } from '@avalabs/chains-sdk';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CircularProgress,
  GlobeIcon,
  Stack,
  Typography,
} from '@avalabs/k2-components';
import { SiteAvatar } from '@src/components/common/SiteAvatar';

export function AddCustomNetworkPopup() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();
  const {
    action: request,
    updateAction: updateMessage,
    cancelHandler,
  } = useApproveAction(requestId);

  useEffect(() => {
    window.addEventListener('unload', cancelHandler);

    return () => {
      window.removeEventListener('unload', cancelHandler);
    };
  }, [cancelHandler]);

  if (!request || !request.displayData) {
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

  const customNetwork: Network = request.displayData;
  return (
    <>
      <Stack sx={{ flexGrow: 1, width: 1, px: 2, py: 1 }}>
        <Typography
          component="h1"
          sx={{ mt: 1, mb: 3, fontSize: 24, fontWeight: 'bold' }}
        >
          {t('Add New Network?')}
        </Typography>
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <SiteAvatar sx={{ mb: 2 }}>
            <TokenIcon height="48px" width="48px" src={customNetwork?.logoUri}>
              <GlobeIcon size={48} />
            </TokenIcon>
          </SiteAvatar>

          <Typography variant="h5">{customNetwork.chainName}</Typography>
          <Typography
            sx={{ textAlign: 'center', color: 'text.secondary' }}
            variant="caption"
          >
            {request?.site?.domain}
          </Typography>
        </Stack>

        <Card sx={{ flexGrow: 1 }}>
          <Scrollbars>
            <Stack sx={{ p: 2 }}>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Chain ID')}
                </Typography>

                <Typography variant="subtitle2">
                  {customNetwork.chainId}
                </Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Chain Name')}
                </Typography>

                <Typography variant="subtitle2">
                  {customNetwork.chainName}
                </Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('RPC URL')}
                </Typography>

                <Typography variant="subtitle2">
                  {customNetwork.rpcUrl}
                </Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Explorer URL')}
                </Typography>

                <Typography variant="subtitle2">
                  {customNetwork.explorerUrl}
                </Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Network Symbol')}
                </Typography>

                <Typography variant="subtitle2">
                  {customNetwork.networkToken.symbol}
                </Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Token Name')}
                </Typography>

                <Typography variant="subtitle2">
                  {customNetwork.networkToken.name}
                </Typography>
              </Stack>
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('Token Decimals')}
                </Typography>

                <Typography variant="subtitle2">
                  {customNetwork.networkToken.decimals}
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
            disabled={
              request.status === ActionStatus.SUBMITTING || !!request.error
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
