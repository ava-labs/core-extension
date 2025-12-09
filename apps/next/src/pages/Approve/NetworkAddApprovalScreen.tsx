import { useCallback } from 'react';
import { Card, Stack, Typography } from '@avalabs/k2-alpine';
import { Trans, useTranslation } from 'react-i18next';

import { ActionStatus } from '@core/types';
import { useApproveAction, useGetRequestId } from '@core/ui';

import { NoScrollStack } from '@/components/NoScrollStack';
import { ActionDrawer, LoadingScreen, Styled } from './components';
import { SizedAvatar } from '@/components/SizedAvatar';
import { sanitizeDappUrl } from './ApproveDappConnection/lib';
import { TxDetailsRow } from './components/ActionDetails/generic/DetailsItem/items/DetailRow';

const rowStyles = {
  borderBottom: '1px solid',
  borderColor: 'divider',
  px: 0,
};

export const NetworkAddApprovalScreen = () => {
  const { t } = useTranslation();

  const requestId = useGetRequestId();
  const { action, updateAction, cancelHandler } = useApproveAction(requestId);

  const approve = useCallback(async () => {
    updateAction({
      status: ActionStatus.SUBMITTING,
      id: requestId,
    });
  }, [updateAction, requestId]);

  if (!action) {
    return <LoadingScreen />;
  }

  const customNetwork = action.displayData.network;
  return (
    <Styled.ApprovalScreenPage>
      <NoScrollStack>
        <Stack px={2} flexGrow={1}>
          <Stack
            sx={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <SizedAvatar size={80} src={action.site?.icon} />
            <Typography variant="h2" mx={5} textAlign="center">
              <Trans i18nKey="Do you want to <br /> add a new network?" />
            </Typography>
            <Typography variant="body3">
              {action.site?.url ? sanitizeDappUrl(action.site.url) : ''}
            </Typography>
          </Stack>
          <Card sx={{ px: 2 }}>
            <TxDetailsRow label={t('Chain ID')} sx={rowStyles}>
              <Typography variant="body3">{customNetwork.chainId}</Typography>
            </TxDetailsRow>
            <TxDetailsRow label={t('Chain Name')} sx={rowStyles}>
              <Typography variant="body3">{customNetwork.chainName}</Typography>
            </TxDetailsRow>
            <TxDetailsRow label={t('RPC URL')} sx={rowStyles}>
              <Typography variant="body3">{customNetwork.rpcUrl}</Typography>
            </TxDetailsRow>
            <TxDetailsRow label={t('Explorer URL')} sx={rowStyles}>
              <Typography variant="body3">
                {customNetwork.explorerUrl}
              </Typography>
            </TxDetailsRow>
            <TxDetailsRow label={t('Network Symbol')} sx={rowStyles}>
              <Typography variant="body3">
                {customNetwork.networkToken.symbol}
              </Typography>
            </TxDetailsRow>
            <TxDetailsRow label={t('Token Name')} sx={rowStyles}>
              <Typography variant="body3">
                {customNetwork.networkToken.name}
              </Typography>
            </TxDetailsRow>
            <TxDetailsRow label={t('Token Decimals')} px={0}>
              <Typography variant="body3">
                {customNetwork.networkToken.decimals}
              </Typography>
            </TxDetailsRow>
          </Card>
        </Stack>
      </NoScrollStack>
      <ActionDrawer
        open
        approve={approve}
        reject={cancelHandler}
        isProcessing={action.status === ActionStatus.SUBMITTING}
      />
    </Styled.ApprovalScreenPage>
  );
};
