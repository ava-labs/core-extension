import { FC, useEffect } from 'react';
import { DisplayData } from '@avalabs/vm-module-types';
import { Action } from '@core/types';
import { HardwareApprovalDrawer } from '../common/ApprovalDrawer';
import { useKeystoneUsbApprovalState } from './useKeystoneUsbApprovalState';
import { StateComponentMapper } from './types';
import { useKeystoneUsbContext } from '@core/ui';
import { Loading } from './components/Loading';

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

  const Component = StateComponentMapper[state] || Loading;

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
