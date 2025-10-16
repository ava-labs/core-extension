import { FC, useCallback } from 'react';
import { Stack } from '@avalabs/k2-alpine';
import { TokenType } from '@avalabs/vm-module-types';

import { ActionStatus, GaslessPhase, NetworkWithCaipId } from '@core/types';
import { useLiveBalance } from '@core/ui';

import { useIsUsingHardwareWallet } from '@/hooks/useIsUsingHardwareWallet';

import {
  ActionDetails,
  ActionDrawer,
  ApprovalScreenTitle,
  Styled,
  MaliciousTxOverlay,
  NoteWarning,
  HardwareApprovalOverlay,
} from './components';
import { hasNoteWarning, hasOverlayWarning } from './lib';
import { useGasless, useApprovalHelpers } from './hooks';
import {
  ActionError,
  CancelActionFn,
  TransactionSigningRequest,
  UpdateActionFn,
} from './types';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20]; // Approval screen should always have the latest balance

type TransactionApprovalScreenProps = {
  action: TransactionSigningRequest;
  network: NetworkWithCaipId;
  updateAction: UpdateActionFn;
  cancelHandler: CancelActionFn;
  error: ActionError;
};

export const TransactionApprovalScreen: FC<TransactionApprovalScreenProps> = ({
  action,
  network,
  updateAction,
  cancelHandler,
  error,
}) => {
  useLiveBalance(POLLED_BALANCES);

  const { isUsingHardwareWallet, deviceType } = useIsUsingHardwareWallet();

  const { tryFunding, setGaslessDefaultValues, gaslessPhase } = useGasless({
    action,
  });

  const approve = useCallback(async () => {
    tryFunding(() => {
      updateAction(
        {
          status: ActionStatus.SUBMITTING,
          id: action.actionId,
        },
        isUsingHardwareWallet,
      );
    });
  }, [updateAction, action.actionId, tryFunding, isUsingHardwareWallet]);

  const cancel = useCallback(() => {
    // Reset the gasless state
    setGaslessDefaultValues();
    cancelHandler();
  }, [cancelHandler, setGaslessDefaultValues]);

  const { isApprovalOverlayVisible, handleApproval, handleRejection } =
    useApprovalHelpers({
      isUsingHardwareWallet,
      deviceType,
      onApprove: approve,
      onReject: cancel,
    });

  const isProcessing =
    action.status === ActionStatus.SUBMITTING ||
    gaslessPhase === GaslessPhase.FUNDING_IN_PROGRESS;

  return (
    <Styled.ApprovalScreenPage>
      <Styled.NoScrollStack>
        <ApprovalScreenTitle title={action.displayData.title} />
        {hasNoteWarning(action) && (
          <NoteWarning alert={action.displayData.alert} />
        )}
        <Stack flexGrow={1} px={2}>
          <ActionDetails
            network={network}
            action={action}
            updateAction={updateAction}
            error={error}
          />
        </Stack>
        <ActionDrawer
          open
          approve={handleApproval}
          reject={handleRejection}
          isProcessing={isProcessing}
          withConfirmationSwitch={hasOverlayWarning(action)}
        />
      </Styled.NoScrollStack>
      {hasOverlayWarning(action) && (
        <MaliciousTxOverlay
          open={hasOverlayWarning(action)}
          cancelHandler={cancelHandler}
          alert={action.displayData.alert}
        />
      )}
      {isUsingHardwareWallet && isApprovalOverlayVisible && deviceType && (
        <HardwareApprovalOverlay
          deviceType={deviceType}
          action={action}
          network={network}
          approve={approve}
          reject={cancel}
        />
      )}
    </Styled.ApprovalScreenPage>
  );
};
