import { useCallback } from 'react';
import { Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { ActionStatus } from '@core/types';
import { useApproveAction, useGetRequestId } from '@core/ui';

import {
  ActionDrawer,
  ApprovalScreenTitle,
  LoadingScreen,
  Styled,
} from './components';

export const ExtensionActionApprovalScreen = () => {
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
      <Styled.NoScrollStack>
        <ApprovalScreenTitle
          title={t('🚧 Placeholder - needs implementation 🚧')}
        />
        <Typography variant="body3">
          {t(
            'This is a placeholder screen just to allow us to reject/approve some wallet-specific interactions (i.e. chain switching).',
          )}
        </Typography>
      </Styled.NoScrollStack>
      <ActionDrawer
        open
        approve={approve}
        reject={cancelHandler}
        isProcessing={action.status === ActionStatus.SUBMITTING}
      />
    </Styled.ApprovalScreenPage>
  );
};
