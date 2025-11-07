import { FC, useEffect, useRef } from 'react';
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
  const { initKeystoneTransport, hasKeystoneTransport } =
    useKeystoneUsbContext();
  const hasApprovedRef = useRef(false);
  const previousStateRef = useRef<typeof state>('loading');
  const previousStateForDelayRef = useRef<typeof state>('loading');

  useEffect(() => {
    // Initialize transport to check availability (required for state detection)
    initKeystoneTransport();
  }, [initKeystoneTransport]);

  useEffect(() => {
    // Store previous state for delay calculation before updating
    previousStateForDelayRef.current = previousStateRef.current;

    // Reset approval flag when state changes from pending to something else
    // Also reset when transitioning from disconnected to pending (device unlocked/reconnected)
    if (
      (previousStateRef.current === 'pending' && state !== 'pending') ||
      (previousStateRef.current === 'disconnected' && state === 'pending')
    ) {
      hasApprovedRef.current = false;
    }
    previousStateRef.current = state;
  }, [state]);

  useEffect(() => {
    // Only call approve when:
    // 1. State is 'pending' (device is connected and ready)
    // 2. Action is not already submitting
    // 3. We haven't already called approve() for this pending state
    // 4. Device transport is confirmed available (hasKeystoneTransport is true)
    if (
      state === 'pending' &&
      action.status !== ActionStatus.SUBMITTING &&
      !hasApprovedRef.current &&
      hasKeystoneTransport
    ) {
      hasApprovedRef.current = true;
      // Use the previous state captured before state effect updated it
      // Longer delay when transitioning from disconnected (device was reconnected/unregistered)
      // Shorter delay for normal unlock (device was just locked)
      const wasDisconnected =
        previousStateForDelayRef.current === 'disconnected';
      const delay = wasDisconnected ? 1500 : 500;
      setTimeout(() => {
        approve().catch((error) => {
          // If approve fails, reset the flag so we can retry
          hasApprovedRef.current = false;
          // If approve fails (e.g., device disconnected), the state should update
          // via the provider's error handling, but we log it here for debugging
          console.error('Keystone approval failed:', error);
        });
      }, delay);
    }
  }, [state, approve, action.status, hasKeystoneTransport]);

  const Component = StateComponentMapper[state].component;

  return (
    <HardwareApprovalDrawer reject={reject}>
      <Component state={state} approve={approve} reject={reject} />
    </HardwareApprovalDrawer>
  );
};
