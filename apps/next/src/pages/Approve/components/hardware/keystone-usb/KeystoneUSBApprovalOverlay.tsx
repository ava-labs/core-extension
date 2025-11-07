import { FC, useEffect, useRef } from 'react';
import { DisplayData } from '@avalabs/vm-module-types';
import { Action } from '@core/types';
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
  const previousStateRef = useRef<typeof state>('loading');

  useEffect(() => {
    // Initialize transport to check availability (required for state detection)
    initKeystoneTransport();
  }, [initKeystoneTransport]);

  useEffect(() => {
    // Store previous state before updating (for delay calculation in Pending)
    previousStateRef.current = state;
  }, [state]);

  const Component = StateComponentMapper[state].component;

  return (
    <HardwareApprovalDrawer reject={reject}>
      <Component
        state={state}
        approve={approve}
        reject={reject}
        action={action}
      />
    </HardwareApprovalDrawer>
  );
};
