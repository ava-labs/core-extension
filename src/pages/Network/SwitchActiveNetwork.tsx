import {
  Button,
  CircularProgress,
  GlobeIcon,
  Stack,
  Typography,
  styled,
} from '@avalabs/k2-components';
import { Network } from '@avalabs/chains-sdk';
import { useTranslation } from 'react-i18next';

import { TokenIcon } from '@src/components/common/TokenIcon';
import { ActionStatus } from '@src/background/services/actions/models';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import useWillSwitchToPrimaryAccount from '@src/hooks/useWillSwitchToPrimaryAccount';

import { useApproveAction } from '../../hooks/useApproveAction';

const SiteAvatar = styled(Stack)`
  width: 88px;
  height: 88px;
  background-color: ${({ theme }) => theme.palette.grey[850]};
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

export function SwitchActiveNetwork() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();
  const {
    action: request,
    updateAction: updateMessage,
    cancelHandler,
  } = useApproveAction(requestId);

  const isLoading = !request || !request.displayData;
  const network: Network = request?.displayData?.network;
  const willSwitchToPrimaryAccount = useWillSwitchToPrimaryAccount(
    Boolean(network?.isTestnet)
  );

  return (
    <Stack
      sx={{
        width: 1,
        height: 1,
        px: 2,
        pb: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isLoading && <CircularProgress size={100} />}
      {!isLoading && (
        <>
          <Stack
            sx={{
              px: 2,
              pb: 3,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 3,
            }}
          >
            <SiteAvatar>
              <TokenIcon height="56px" width="56px" src={network?.logoUri}>
                <GlobeIcon size={56} />
              </TokenIcon>
            </SiteAvatar>
            <Typography variant="h4">
              {t('Switch to {{chainName}} Network?', {
                chainName: network?.chainName,
              })}
            </Typography>
            <Typography variant="body1">
              {t(
                '{{domain}} is requesting to switch your active network to {{chainName}}',
                {
                  chainName: network?.chainName,
                  domain: request?.site?.domain || t('This website'),
                }
              )}
            </Typography>
            {willSwitchToPrimaryAccount && (
              <Typography
                variant="caption"
                sx={{ mt: 3, color: 'warning.main' }}
              >
                {t(
                  'Approving will also switch to your primary account, as Fireblocks-imported accounts are not supported in testnet mode at the moment.'
                )}
              </Typography>
            )}
          </Stack>
          <Stack
            direction="row"
            sx={{
              width: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
              alignSelf: 'flex-end',
              gap: 1,
            }}
          >
            <Button
              fullWidth
              color="secondary"
              size="large"
              onClick={() => {
                cancelHandler();
                window.close();
              }}
            >
              {t('Reject')}
            </Button>
            <Button
              fullWidth
              color="primary"
              size="large"
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
        </>
      )}
    </Stack>
  );
}
