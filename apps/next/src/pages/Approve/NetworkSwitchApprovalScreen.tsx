import { useCallback } from 'react';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { Trans, useTranslation } from 'react-i18next';

import { ActionStatus } from '@core/types';
import { useApproveAction, useGetRequestId } from '@core/ui';

import { NoScrollStack } from '@/components/NoScrollStack';
import { ActionDrawer, LoadingScreen, Styled } from './components';
import { FiArrowRight } from 'react-icons/fi';
import { NetworkAvatar } from '../Settings/components/NetworkManagement/components/NetworkAvatar/NetworkAvatar';

export const NetworkSwitchApprovalScreen = () => {
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
            <Stack direction="row" alignItems="center" gap={1}>
              <NetworkAvatar
                sx={{ width: 60, height: 60 }}
                network={action.displayData.currentNetwork}
              />
              <FiArrowRight size={40} />
              <NetworkAvatar
                sx={{ width: 60, height: 60 }}
                network={action.displayData.network}
              />
            </Stack>
            <Typography variant="h2" mx={5} mt={1} textAlign="center">
              <Trans
                i18nKey="Do you want to switch to {{chainName}}?"
                values={{ chainName: action.displayData.network.chainName }}
              />
            </Typography>
            <Typography variant="body3" mx={5} textAlign="center">
              <Trans
                i18nKey="{{domain}} is requesting to switch your active network to {{chainName}}"
                values={{
                  domain: action.site?.domain ?? t('Unknown website'),
                  chainName: action.displayData.network.chainName,
                }}
              />
            </Typography>
          </Stack>
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
