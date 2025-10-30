import { FC, useEffect } from 'react';
import { DisplayData } from '@avalabs/vm-module-types';
import { Action, ActionStatus } from '@core/types';
import { HardwareApprovalDrawer } from '../common/ApprovalDrawer';
import { useKeystoneUsbApprovalState } from './useKeystoneUsbApprovalState';
import { StateComponentMapper } from './types';
import { useKeystoneUsbContext } from '@core/ui';

type KeystoneUSBApprovalOverlayProps = {
  action: Action<DisplayData>;
  reject: () => void;
  approve: () => Promise<unknown>;
};

export const KeystoneUSBApprovalOverlay: FC<
  KeystoneUSBApprovalOverlayProps
> = ({ action, reject, approve }) => {
  const state = useKeystoneUsbApprovalState();
  const { initKeystoneTransport } = useKeystoneUsbContext();

  useEffect(() => {
    // Initialize transport to check availability (required for state detection)
    initKeystoneTransport();
  }, [initKeystoneTransport]);

  useEffect(() => {
    // Only call approve when device is connected and ready, and not already submitting
    // This matches Ledger's behavior to avoid calling approve() multiple times
    if (state === 'pending' && action.status !== ActionStatus.SUBMITTING) {
      approve();
    }
  }, [state, approve, action.status]);

  const Component = StateComponentMapper[state].component;

  console.log({ state });

  return (
    <HardwareApprovalDrawer reject={reject}>
      <Component state={state} approve={approve} reject={reject} />
    </HardwareApprovalDrawer>
  );
};
