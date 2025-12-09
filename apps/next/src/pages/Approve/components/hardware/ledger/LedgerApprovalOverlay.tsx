import { FC, useEffect } from 'react';
import { DisplayData } from '@avalabs/vm-module-types';

import { Action, ActionStatus, NetworkWithCaipId } from '@core/types';

import { HardwareApprovalDrawer } from '../common/ApprovalDrawer';
import { useLedgerApprovalState } from './useLedgerApprovalState';
import {
  Disconnected,
  IncorrectApp,
  IncorrectVersion,
  Loading,
  PendingApproval,
  BtcPolicyNeeded,
} from './components';
import { LedgerApprovalState, StateComponentProps } from './types';

type LedgerApprovalOverlayProps = {
  action: Action<DisplayData>;
  approve: () => Promise<unknown>;
  reject: () => void;
  network: NetworkWithCaipId;
};

const ComponentPerState: Record<
  LedgerApprovalState['state'],
  FC<StateComponentProps>
> = {
  loading: Loading,
  pending: PendingApproval,
  disconnected: Disconnected,
  'incorrect-app': IncorrectApp,
  'incorrect-version': IncorrectVersion,
  'btc-policy-needed': BtcPolicyNeeded,
};

export const LedgerApprovalOverlay: FC<LedgerApprovalOverlayProps> = ({
  network,
  action,
  approve,
  reject,
}) => {
  const state = useLedgerApprovalState(network, action);

  const Component = ComponentPerState[state.state];

  // Send the signing request to the Ledger device
  // once we reach the "pending" state.
  useEffect(() => {
    if (
      state.state === 'pending' &&
      action.status !== ActionStatus.SUBMITTING
    ) {
      approve();
    }
  }, [state.state, approve, action.status]);

  return (
    <HardwareApprovalDrawer reject={reject}>
      <Component state={state} approve={approve} reject={reject} />
    </HardwareApprovalDrawer>
  );
};
