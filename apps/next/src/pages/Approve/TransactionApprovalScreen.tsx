import { FC, useCallback } from 'react';
import { Stack } from '@avalabs/k2-alpine';
import { TokenType } from '@avalabs/vm-module-types';

import { ActionStatus, GaslessPhase, NetworkWithCaipId } from '@core/types';
import { useLiveBalance } from '@core/ui';

import {
  ActionDetails,
  ActionDrawer,
  ApprovalScreenTitle,
  Styled,
  MaliciousTxOverlay,
  NoteWarning,
} from './components';
import { hasNoteWarning, hasOverlayWarning } from './lib';
import { useGasless } from './hooks';
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
        false, // TODO: handle hardware wallets
      );
    });
  }, [updateAction, action.actionId, tryFunding]);

  const cancel = useCallback(() => {
    // Reset the gasless state
    setGaslessDefaultValues();
    cancelHandler();
  }, [cancelHandler, setGaslessDefaultValues]);

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
          approve={approve}
          reject={cancel}
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
    </Styled.ApprovalScreenPage>
  );
};
