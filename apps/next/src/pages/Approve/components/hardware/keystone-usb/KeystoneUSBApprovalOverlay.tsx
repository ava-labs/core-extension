import { FC, useEffect, useMemo } from 'react';
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
  const hookState = useKeystoneUsbApprovalState();
  const { initKeystoneTransport } = useKeystoneUsbContext();

  useEffect(() => {
    // Initialize transport to check availability (required for state detection)
    initKeystoneTransport();
  }, [initKeystoneTransport]);

  const state = useMemo(
    () =>
      hookState === 'pending' && error === KEYSTONE_NOT_IN_HOMEPAGE_ERROR
        ? 'disconnected'
        : hookState,
    [hookState, error],
  );

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
