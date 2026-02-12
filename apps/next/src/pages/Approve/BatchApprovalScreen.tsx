import { FC, useCallback, useState } from 'react';
import { Stack, Typography, Button } from '@avalabs/k2-alpine';

import { ActionStatus, MultiTxAction, NetworkWithCaipId } from '@core/types';
import {
  useApproveAction,
  useGetRequestId,
  useNetworkContext,
  useLiveBalance,
} from '@core/ui';
import { DisplayData, TokenType } from '@avalabs/vm-module-types';
import { useTranslation } from 'react-i18next';
import { hasDefined } from '@core/common';

import { NoScrollStack } from '@/components/NoScrollStack';
import { useIsUsingHardwareWallet } from '@/hooks/useIsUsingHardwareWallet';

import {
  ActionDetails,
  ActionDrawer,
  ApprovalScreenTitle,
  ErrorScreen,
  HardwareApprovalOverlay,
  LoadingScreen,
  MaliciousTxOverlay,
  NoteWarning,
  Styled,
} from './components';
import { useApprovalHelpers } from './hooks';
import { hasNoteWarning, hasOverlayWarning } from './lib';
import { CancelActionFn, UpdateActionFn, ActionError } from './types';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

type BatchAction = MultiTxAction & {
  actionId: string;
  displayData: DisplayData;
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
  const currentSigningRequest = action.signingRequests[currentTxIndex];

  return (
    <Styled.ApprovalScreenPage>
      <NoScrollStack stackProps={{ sx: { mt: 3 } }}>
        <ApprovalScreenTitle
          title={t('Approve {{count}} transactions', { count: txCount })}
        />

        {hasNoteWarning(action) && (
          <NoteWarning alert={action.displayData.alert} />
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
          {currentSigningRequest && (
            <ActionDetails
              network={network}
              action={
                {
                  ...action,
                  signingData: currentSigningRequest.signingData,
                  displayData: currentSigningRequest.displayData,
                } as any
              }
              updateAction={updateAction}
              error={error}
            />
          )}
        </Stack>
        <ActionDrawer
          open
          approve={handleApproval}
          reject={handleRejection}
          isProcessing={isProcessing}
          withConfirmationSwitch={hasOverlayWarning(action)}
        />
      </NoScrollStack>
      {hasOverlayWarning(action) && (
        <MaliciousTxOverlay
          open
          cancelHandler={cancelHandler}
          alert={action.displayData.alert}
        />
      )}
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
      <ErrorScreen message="Unsupported Network">
        <ActionDrawer
          open
          reject={cancelHandler}
          isProcessing={action.status === ActionStatus.SUBMITTING}
        />
      </ErrorScreen>
    );
  }

  if (!isBatchAction(action) || !hasDefined(action, 'actionId')) {
    return (
      <ErrorScreen message="Invalid batch action">
        <ActionDrawer
          open
          reject={cancelHandler}
          isProcessing={action.status === ActionStatus.SUBMITTING}
        />
      </ErrorScreen>
    );
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
