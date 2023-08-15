import { ActionStatus } from '@src/background/services/actions/models';
import { SiteAvatar } from '@src/components/common/SiteAvatar';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useCallback } from 'react';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { WalletExtensionButton } from '../Wallet/components/WalletExtensionButton';
import { Trans } from 'react-i18next';
import { Stack, Typography, WalletIcon } from '@avalabs/k2-components';

export function SelectWallet() {
  const requestId = useGetRequestId();
  const { action: request, updateAction } = useApproveAction(requestId);

  const selectWallet = useCallback(
    (index: number | string) => {
      updateAction({
        status: ActionStatus.SUBMITTING,
        id: requestId,
        result: index,
      });

      window.close();
    },
    [requestId, updateAction]
  );

  if (!request) {
    return <LoadingOverlay />;
  }
  return (
    <Stack>
      <Stack
        sx={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          px: 1,
        }}
      >
        <SiteAvatar>
          <WalletIcon size={48} />
        </SiteAvatar>
        <Typography variant="h4" sx={{ textAlign: 'center', mt: 3, mb: 2 }}>
          <Trans i18nKey="Which wallet would <br /> you like to use?" />
        </Typography>
        <Typography sx={{ textAlign: 'center' }} variant="body1">
          <Trans i18nKey="It looks like multiple wallets are installed. <br /> Select which one you would like to connect." />
        </Typography>
      </Stack>
      <Stack>
        {request.displayData.options.map((option, i) => (
          <WalletExtensionButton
            key={i}
            onClick={() => {
              selectWallet(i);
            }}
            type={option}
          />
        ))}
      </Stack>
    </Stack>
  );
}
