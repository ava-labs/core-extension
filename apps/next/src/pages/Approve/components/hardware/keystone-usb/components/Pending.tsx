import { FC, useEffect, useRef } from 'react';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { Action, ActionStatus } from '@core/types';
import { DisplayData } from '@avalabs/vm-module-types';
import { StateComponentProps } from '../types';
import { PendingKeystoneCircles } from './PendingKeystoneCircles';
import { useTranslation } from 'react-i18next';
import { useKeystoneUsbContext } from '@core/ui';
import { createKeystoneTransport } from '@keystonehq/hw-transport-webusb';
import { resolve } from '@core/common';
import Avalanche from '@keystonehq/hw-app-avalanche';

type PendingProps = StateComponentProps & {
  action: Action<DisplayData>;
};

export const Pending: FC<PendingProps> = ({ state, approve, action }) => {
  const { t } = useTranslation();
  const { hasKeystoneTransport } = useKeystoneUsbContext();
  const hasApprovedRef = useRef(false);

  useEffect(() => {
    // Reset flag when state is not pending or action is not pending
    if (state !== 'pending' || action.status !== ActionStatus.PENDING) {
      hasApprovedRef.current = false;
      return;
    }

    // Only call approve when device is ready and we haven't called it yet
    if (hasKeystoneTransport && !hasApprovedRef.current) {
      hasApprovedRef.current = true;

      // Verify device is actually ready by testing transport creation
      // This ensures the device can handle signing requests
      const verifyAndApprove = async () => {
        try {
          // Test that we can actually create a transport and communicate with device
          // This is what signTx() will do, so we verify it works first
          const [usbTransport] = await resolve(createKeystoneTransport());
          if (!usbTransport) {
            throw new Error('Transport not available');
          }
          const testApp = new Avalanche(usbTransport);
          await testApp.getAppConfig();
          // Device is ready, now call approve
          await approve();
        } catch (error) {
          console.error('Keystone device not ready for signing:', error);
          hasApprovedRef.current = false;
          // Don't call approve if device isn't ready
        }
      };

      // Small delay to ensure state is stable
      const timeoutId = setTimeout(() => {
        // Check again before calling (device might have disconnected during delay)
        if (
          state === 'pending' &&
          action.status === ActionStatus.PENDING &&
          hasKeystoneTransport
        ) {
          verifyAndApprove();
        } else {
          hasApprovedRef.current = false;
        }
      }, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [state, approve, action.status, hasKeystoneTransport]);

  if (state !== 'pending') {
    return null;
  }

  return (
    <Stack width="100%" height="100%" gap={2}>
      <Stack px={6} flexGrow={1} alignItems="center" justifyContent="center">
        <PendingKeystoneCircles />
        <Stack gap={1} textAlign="center">
          <Typography variant="body3" fontWeight={500}>
            {t('Please review the transaction on your Keystone')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t(
              'Open the Avalanche app on your Keystone device in order to continue with this transaction',
            )}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
