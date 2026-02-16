import { DisplayData } from '@avalabs/vm-module-types';

import { ActionStatus } from '@core/types';
import { useApproveAction, useGetRequestId, useNetworkContext } from '@core/ui';

import { ActionDrawer, ErrorScreen, LoadingScreen } from './components';
import { isMessageApproval, isTransactionApproval } from './types';
import { TransactionApprovalScreen } from './TransactionApprovalScreen';
import { MessageApprovalScreen } from './MessageApprovalScreen';

export const GenericApprovalScreen = () => {
  const requestId = useGetRequestId();
  const { getNetwork, networks } = useNetworkContext();

  const { action, updateAction, cancelHandler, error } =
    useApproveAction<DisplayData>(requestId);

  const network = action ? getNetwork(action.scope) : undefined;

  // `!networks.length` prevents a flash of error screen while the networks are loading.
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
      <ErrorScreen message="Unsupported Network">
        <ActionDrawer
          open
          reject={cancelHandler}
          isProcessing={action.status === ActionStatus.SUBMITTING}
        />
      </ErrorScreen>
    );
  }

  if (isTransactionApproval(action)) {
    return (
      <TransactionApprovalScreen
        action={action}
        network={network}
        updateAction={updateAction}
        cancelHandler={cancelHandler}
        error={error}
      />
    );
  }

  if (isMessageApproval(action)) {
    return (
      <MessageApprovalScreen
        action={action}
        network={network}
        updateAction={updateAction}
        cancelHandler={cancelHandler}
        error={error}
      />
    );
  }

  // TODO: Neither transaction nor a message approval. How did we get here? What do we do?
  return null;
};
