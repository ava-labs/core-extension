import { Stack, Typography } from '@avalabs/k2-alpine';
import { TokenType } from '@avalabs/vm-module-types';
import { FC, useCallback, useEffect, useRef } from 'react';

import { ActionStatus, GaslessPhase, NetworkWithCaipId } from '@core/types';
import { useIsUsingKeystoneWallet, useLiveBalance } from '@core/ui';
import { useTranslation } from 'react-i18next';

import { NoScrollStack } from '@/components/NoScrollStack';
import { SimulationAlertBox } from '@/components/SimulationAlertBox';
import { useIsUsingHardwareWallet } from '@/hooks/useIsUsingHardwareWallet';

import {
  ActionDetails,
  ActionDrawer,
  ApprovalScreenTitle,
  HardwareApprovalOverlay,
  MaliciousTxOverlay,
  NoteWarning,
  Styled,
} from './components';
import { useApprovalHelpers, useGasless } from './hooks';
import { hasNoteWarning, hasOverlayWarning } from './lib';
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
  const { t } = useTranslation();
  const gaslessUnavailable = useRef<boolean>(false);

  useLiveBalance(POLLED_BALANCES);

  const { isUsingHardwareWallet, deviceType } = useIsUsingHardwareWallet();

  const { tryFunding, setGaslessDefaultValues, gaslessPhase } = useGasless({
    action,
  });

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

  useEffect(() => {
    if (gaslessPhase === GaslessPhase.ERROR) {
      gaslessUnavailable.current = true;
    }
  }, [gaslessPhase]);

  const isProcessing =
    action.status === ActionStatus.SUBMITTING ||
    gaslessPhase === GaslessPhase.FUNDING_IN_PROGRESS;
  const showGaslessErrorMessage =
    gaslessPhase === GaslessPhase.ERROR || gaslessUnavailable.current;

  const isUsingKeystoneWallet = useIsUsingKeystoneWallet();

  return (
    <Styled.ApprovalScreenPage>
      <NoScrollStack stackProps={{ sx: { mt: 3 } }}>
        <ApprovalScreenTitle title={action.displayData.title} />
        {hasNoteWarning(action) && (
          <NoteWarning alert={action.displayData.alert} />
        )}
        {showGaslessErrorMessage && (
          <Stack px={2} mt={1.5} mb={1.5}>
            <SimulationAlertBox
              textLines={[
                t(
                  'Core was unable to fund the gas. You will need to pay the fee for this transaction.',
                ),
              ]}
            />
          </Stack>
        )}
        <Stack flexGrow={1} px={2}>
          <ActionDetails
            network={network}
            action={action}
            updateAction={updateAction}
            error={error}
          />
          {isUsingKeystoneWallet && (
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                mb: 1,
                mx: 0,
              }}
            >
              <strong>{t('Note: ')}</strong>
              {t('Ensure your Keystone 3 Pro is on the homepage')}
            </Typography>
          )}
        </Stack>
        <ActionDrawer
          open
          approve={() => tryFunding(handleApproval)}
          reject={handleRejection}
          isProcessing={isProcessing}
          withConfirmationSwitch={hasOverlayWarning(action)}
        />
      </NoScrollStack>
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
          error={error}
        />
      )}
    </Styled.ApprovalScreenPage>
  );
};
