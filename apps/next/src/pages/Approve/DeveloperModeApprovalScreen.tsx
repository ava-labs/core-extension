import { useCallback } from 'react';
import { Stack, Typography, WaterDropIcon } from '@avalabs/k2-alpine';
import { Trans, useTranslation } from 'react-i18next';

import { ActionStatus } from '@core/types';
import { useApproveAction, useGetRequestId } from '@core/ui';

import { NoScrollStack } from '@/components/NoScrollStack';
import { ActionDrawer, LoadingScreen, Styled } from './components';
import { HexagonalIcon } from '@/components/HexagonalIcon';

export const DeveloperModeApprovalScreen = () => {
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
            <HexagonalIcon size={88}>
              <WaterDropIcon size={48} />
            </HexagonalIcon>
            <Typography variant="h2" mx={5} textAlign="center">
              <Trans
                i18nKey="Do you want to <br/> turn testnet {{onOrOff}}?"
                values={{
                  onOrOff: action.displayData.isTestmode ? t('on') : t('off'),
                }}
              />
            </Typography>
            <Typography variant="body3" mx={6} textAlign="center">
              <Trans
                i18nKey="{{domain}} is requesting to turn testnet mode {{onOrOff}}"
                values={{
                  onOrOff: action.displayData.isTestmode ? t('on') : t('off'),
                  domain: action.site?.domain ?? t('Unknown website'),
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
