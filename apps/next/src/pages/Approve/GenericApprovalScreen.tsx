import { useCallback } from 'react';
import { Stack } from '@avalabs/k2-alpine';
import { DisplayData, TokenType } from '@avalabs/vm-module-types';

import { ActionStatus } from '@core/types';
import {
  useApproveAction,
  useGetRequestId,
  useLiveBalance,
  useNetworkContext,
} from '@core/ui';

import {
  ActionDetails,
  ActionDrawer,
  ApprovalScreenTitle,
  LoadingScreen,
  Styled,
  UnsupportedNetworkScreen,
  MaliciousTxOverlay,
  NoteWarning,
} from './components';
import { hasNoteWarning, hasOverlayWarning } from './lib';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20]; // Approval screen should always have the latest balance

export const GenericApprovalScreen = () => {
  useLiveBalance(POLLED_BALANCES);
  const requestId = useGetRequestId();
  const { getNetwork, networks } = useNetworkContext();
  const { action, updateAction, cancelHandler, error } =
    useApproveAction<DisplayData>(requestId);

  // TODO: handle gasless
  const approve = useCallback(async () => {
    updateAction(
      {
        status: ActionStatus.SUBMITTING,
        id: requestId,
      },
      false, // TODO: handle hardware wallets
    );
  }, [updateAction, requestId]);

  const network = action ? getNetwork(action.scope) : undefined;

  // `!networks.length` prevents a flash of <UnsupportedNetworkScreen /> while the networks are loading.
  if (!action || !networks.length) {
    return <LoadingScreen />;
  }

  // At this point, all networks should be loaded.
  if (!network) {
    // This is very unlikely, but technically possible if, for example,
    // the environment changes from mainnet to testnet (or vice versa)
    // in-between us receiving the approval request and displaying the approval screen.
    // TODO: Should we still allow approvals?
    return (
      <UnsupportedNetworkScreen>
        <ActionDrawer open reject={cancelHandler} action={action} />
      </UnsupportedNetworkScreen>
    );
  }

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
          reject={cancelHandler}
          action={action}
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
