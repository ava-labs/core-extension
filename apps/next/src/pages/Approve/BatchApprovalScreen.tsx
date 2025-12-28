import { FC, useCallback, useState } from 'react';
import { Stack, Typography, Button } from '@avalabs/k2-alpine';
import { DisplayData } from '@avalabs/vm-module-types';

import { ActionStatus, MultiTxAction, NetworkWithCaipId } from '@core/types';
import {
  useApproveAction,
  useGetRequestId,
  useNetworkContext,
  useLiveBalance,
} from '@core/ui';
import { TokenType } from '@avalabs/vm-module-types';
import { useTranslation } from 'react-i18next';
import { hasDefined } from '@core/common';

import { NoScrollStack } from '@/components/NoScrollStack';
import { ValidationWarningCard } from '@/components/ValidationWarningCard';
import { useIsUsingHardwareWallet } from '@/hooks/useIsUsingHardwareWallet';

import {
  ActionDetails,
  ActionDrawer,
  ApprovalScreenTitle,
  HardwareApprovalOverlay,
  LoadingScreen,
  Styled,
  UnsupportedNetworkScreen,
} from './components';
import { useApprovalHelpers } from './hooks';
import { CancelActionFn, UpdateActionFn, ActionError } from './types';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

type BatchAction = MultiTxAction & {
  actionId: string;
  displayData: DisplayData & {
    validationWarning?: string;
  };
};

const isBatchAction = (action: any): action is BatchAction => {
  return Boolean(
    action &&
      action.actionId &&
      action.signingRequests &&
      Array.isArray(action.signingRequests),
  );
};

type BatchApprovalContentProps = {
  action: BatchAction;
  network: NetworkWithCaipId;
  updateAction: UpdateActionFn;
  cancelHandler: CancelActionFn;
  error: ActionError;
};

const BatchApprovalContent: FC<BatchApprovalContentProps> = ({
  action,
  network,
  updateAction,
  cancelHandler,
  error,
}) => {
  const { t } = useTranslation();
  const [currentTxIndex, setCurrentTxIndex] = useState(0);

  useLiveBalance(POLLED_BALANCES);

  const { isUsingHardwareWallet, deviceType } = useIsUsingHardwareWallet();

  const approve = useCallback(async () => {
    updateAction(
      {
        status: ActionStatus.SUBMITTING,
        id: action.actionId,
      },
      isUsingHardwareWallet,
    );
  }, [updateAction, action.actionId, isUsingHardwareWallet]);

  const cancel = useCallback(() => {
    cancelHandler();
  }, [cancelHandler]);

  const { isApprovalOverlayVisible, handleApproval, handleRejection } =
    useApprovalHelpers({
      isUsingHardwareWallet,
      deviceType,
      onApprove: approve,
      onReject: cancel,
    });

  const isProcessing = action.status === ActionStatus.SUBMITTING;
  const txCount = action.signingRequests.length;

  return (
    <Styled.ApprovalScreenPage>
      <NoScrollStack sx={{ mt: 3 }}>
        <ApprovalScreenTitle
          title={t('Approve {{count}} transactions', { count: txCount })}
        />

        {/* Validation Warning */}
        {action.displayData?.validationWarning && (
          <Stack px={2} mt={1.5} mb={1.5}>
            <ValidationWarningCard
              textLines={[
                t('Manual approval required'),
                action.displayData.validationWarning,
              ]}
            />
          </Stack>
        )}

        {/* Transaction Navigation */}
        {txCount > 1 && (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap={1}
            px={2}
            mb={1}
          >
            <Button
              variant="text"
              size="small"
              disabled={currentTxIndex === 0}
              onClick={() => setCurrentTxIndex((i) => Math.max(0, i - 1))}
            >
              {t('Previous')}
            </Button>
            <Typography variant="caption">
              {t('Transaction {{current}} of {{total}}', {
                current: currentTxIndex + 1,
                total: txCount,
              })}
            </Typography>
            <Button
              variant="text"
              size="small"
              disabled={currentTxIndex === txCount - 1}
              onClick={() =>
                setCurrentTxIndex((i) => Math.min(txCount - 1, i + 1))
              }
            >
              {t('Next')}
            </Button>
          </Stack>
        )}

        <Stack flexGrow={1} px={2}>
          <ActionDetails
            network={network}
            action={action as any}
            updateAction={updateAction}
            error={error}
          />
        </Stack>
        <ActionDrawer
          open
          approve={handleApproval}
          reject={handleRejection}
          isProcessing={isProcessing}
        />
      </NoScrollStack>
      {isUsingHardwareWallet && isApprovalOverlayVisible && deviceType && (
        <HardwareApprovalOverlay
          deviceType={deviceType}
          action={action as any}
          network={network}
          approve={approve}
          reject={cancel}
        />
      )}
    </Styled.ApprovalScreenPage>
  );
};

export const BatchApprovalScreen = () => {
  const requestId = useGetRequestId();
  const { getNetwork, networks } = useNetworkContext();

  const { action, updateAction, cancelHandler, error } =
    useApproveAction<DisplayData>(requestId);

  const network = action ? getNetwork(action.scope) : undefined;

  if (!action || !networks.length) {
    return <LoadingScreen />;
  }

  if (!network) {
    return (
      <UnsupportedNetworkScreen>
        <ActionDrawer
          open
          reject={cancelHandler}
          isProcessing={action.status === ActionStatus.SUBMITTING}
        />
      </UnsupportedNetworkScreen>
    );
  }

  if (!isBatchAction(action) || !hasDefined(action, 'actionId')) {
    return <LoadingScreen />;
  }

  return (
    <BatchApprovalContent
      action={action}
      network={network}
      updateAction={updateAction}
      cancelHandler={cancelHandler}
      error={error}
    />
  );
};
