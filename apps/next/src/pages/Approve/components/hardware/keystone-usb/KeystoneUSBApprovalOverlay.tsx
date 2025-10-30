import { FC, useEffect } from 'react';
import { HardwareApprovalDrawer } from '../common/ApprovalDrawer';
import { useKeystoneUsbApprovalState } from './useKeystoneUsbApprovalState';
import { StateComponentMapper } from './types';
import { useKeystoneUsbContext } from '@core/ui';

type KeystoneUSBApprovalOverlayProps = {
  reject: () => void;
  approve: () => Promise<unknown>;
};

export const KeystoneUSBApprovalOverlay: FC<
  KeystoneUSBApprovalOverlayProps
> = ({ reject, approve }) => {
  const state = useKeystoneUsbApprovalState();
  const { initKeystoneTransport } = useKeystoneUsbContext();

  useEffect(() => {
    // Initialize the Keystone transport when component mounts
    initKeystoneTransport();
  }, [initKeystoneTransport]);

  useEffect(() => {
    // Only call approve when device is connected and ready
    if (state === 'pending') {
      approve();
    }
  }, [state, approve]);

  const Component = StateComponentMapper[state].component;

  console.log({ state });

  return (
    <HardwareApprovalDrawer reject={reject}>
      <Component state={state} approve={approve} reject={reject} />
    </HardwareApprovalDrawer>
  );
};
