import { FC, useEffect, useRef } from 'react';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { Action, ActionStatus } from '@core/types';
import { DisplayData } from '@avalabs/vm-module-types';
import { StateComponentProps } from '../types';
import { PendingKeystoneCircles } from './PendingKeystoneCircles';
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
    // Only call approve when:
    // 1. State is 'pending' (device is connected and ready)
    // 2. Action status is PENDING (waiting for approval, not already submitted/completed)
    // 3. We haven't already called approve() for this pending state
    // 4. Device transport is confirmed available (hasKeystoneTransport is true)
    if (
      state === 'pending' &&
      action.status === ActionStatus.PENDING &&
      !hasApprovedRef.current &&
      hasKeystoneTransport
    ) {
      hasApprovedRef.current = true;
      const delay = 1500;
      setTimeout(() => {
        approve()
          .catch((error) => {
            // If approve fails (e.g., device disconnected), the state should update
            // via the provider's error handling, but we log it here for debugging
            console.error('Keystone approval failed:', error);
          })
          .finally(() => {
            hasApprovedRef.current = false;
          });
      }, delay);
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
