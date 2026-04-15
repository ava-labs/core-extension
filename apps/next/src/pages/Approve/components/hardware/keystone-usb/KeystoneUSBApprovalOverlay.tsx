import { FC, useEffect } from 'react';
import { DisplayData } from '@avalabs/vm-module-types';
import { Action, NetworkWithCaipId } from '@core/types';
import { HardwareApprovalDrawer } from '@/components/HardwareApprovalDrawer';
import { useKeystoneUsbApprovalState } from './useKeystoneUsbApprovalState';
import { StateComponentMapper } from './types';
import { useKeystoneUsbContext } from '@core/ui';
import { Loading } from './components/Loading';

type KeystoneUSBApprovalOverlayProps = {
  action: Action<DisplayData>;
  reject: () => void;
  approve: () => Promise<unknown>;
  network: NetworkWithCaipId;
};

export const KeystoneUSBApprovalOverlay: FC<
  KeystoneUSBApprovalOverlayProps
> = ({ action, reject, approve, network }) => {
  const state = useKeystoneUsbApprovalState(network);
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
