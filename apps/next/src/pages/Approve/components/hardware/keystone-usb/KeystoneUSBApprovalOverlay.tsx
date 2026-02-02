import { FC, useEffect } from 'react';
import { DisplayData } from '@avalabs/vm-module-types';
import { Action } from '@core/types';
import { HardwareApprovalDrawer } from '../common/ApprovalDrawer';
import { useKeystoneUsbApprovalState } from './useKeystoneUsbApprovalState';
import { StateComponentMapper } from './types';
import { useKeystoneUsbContext } from '@core/ui';
import { Loading } from './components/Loading';
import { KEYSTONE_NOT_IN_HOMEPAGE_ERROR } from '~/services/keystone/constants/error';

type KeystoneUSBApprovalOverlayProps = {
  action: Action<DisplayData>;
  reject: () => void;
  approve: () => Promise<unknown>;
  error: string;
};

export const KeystoneUSBApprovalOverlay: FC<
  KeystoneUSBApprovalOverlayProps
> = ({ action, reject, approve, error }) => {
  let state = useKeystoneUsbApprovalState();
  const { initKeystoneTransport } = useKeystoneUsbContext();

  useEffect(() => {
    // Initialize transport to check availability (required for state detection)
    initKeystoneTransport();
  }, [initKeystoneTransport]);

  if (state === 'pending' && error === KEYSTONE_NOT_IN_HOMEPAGE_ERROR) {
    state = 'disconnected';
  }

  const Component = StateComponentMapper[state] || Loading;

  return (
    <HardwareApprovalDrawer reject={reject}>
      <Component
        state={state}
        approve={approve}
        reject={reject}
        action={action}
        error={error}
      />
    </HardwareApprovalDrawer>
  );
};
