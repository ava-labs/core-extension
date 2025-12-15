import { FC, useEffect, useRef } from 'react';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { Action, ActionStatus } from '@core/types';
import { DisplayData } from '@avalabs/vm-module-types';
import { StateComponentProps } from '../types';
import { PendingKeystoneCircles } from '@/components/PendingCircles';
import { useTranslation } from 'react-i18next';
import { useKeystoneUsbContext } from '@core/ui';

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
      // Verify device is actually ready by testing transport creation
      // This ensures the device can handle signing requests
      const verifyAndApprove = async () => {
        try {
          // Device is ready, now call approve
          hasApprovedRef.current = true;
          await approve();
        } catch (error) {
          console.error('Approval error:', error);
          hasApprovedRef.current = false;
        }
      };

      if (
        state === 'pending' &&
        action.status === ActionStatus.PENDING &&
        hasKeystoneTransport &&
        !hasApprovedRef.current
      ) {
        verifyAndApprove();
      } else {
        hasApprovedRef.current = false;
      }
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
