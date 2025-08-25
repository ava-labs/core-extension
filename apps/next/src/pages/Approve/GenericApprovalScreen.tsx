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
  LoadingScreen,
  Styled,
  UnsupportedNetworkScreen,
} from './components';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20]; // Approval screen should always have the latest balance

export const GenericApprovalScreen = () => {
  useLiveBalance(POLLED_BALANCES);

  const requestId = useGetRequestId();
  const { getNetwork } = useNetworkContext();
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

  if (!action) {
    return <LoadingScreen />;
  }

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
      <Styled.ApprovalScreenTitle title={action.displayData.title} />

      <Styled.NoScrollStack>
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
    </Styled.ApprovalScreenPage>
  );
};
