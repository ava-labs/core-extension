import { ActionStatus } from '@core/types';
import { SiteAvatar } from '@/components/common/SiteAvatar';
import { useApproveAction } from '@core/ui';
import { useGetRequestId } from '@core/ui';
import { useCallback } from 'react';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import {
  WalletExtensionButton,
  CoreExtensionButton,
} from '../Wallet/components/WalletExtensionButton';
import { Trans } from 'react-i18next';
import { Stack, Typography, WalletIcon } from '@avalabs/core-k2-components';

export function SelectWallet() {
  const requestId = useGetRequestId();
  const { action: request, updateAction } = useApproveAction(requestId);

  const selectWallet = useCallback(
    async (index: number | string) =>
      updateAction({
        status: ActionStatus.SUBMITTING,
        id: requestId,
        result: index,
      }),
    [requestId, updateAction],
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
        {request.displayData.info.map((info, index) => {
          if (info.rdns === 'app.core.extension') {
            return (
              <CoreExtensionButton
                key={index}
                onClick={() => {
                  selectWallet(index);
                }}
                info={info}
              />
            );
          }
          return;
        })}
        {request.displayData.info.length > 1 && (
          <WalletExtensionButton
            onClick={(index) => {
              selectWallet(index);
            }}
            wallets={request.displayData.info}
          />
        )}
      </Stack>
    </Stack>
  );
}
