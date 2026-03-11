import { Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { PendingKeystoneCircles } from '@/components/PendingCircles';

export const KeystoneApproveDeviceConnection = () => {
  const { t } = useTranslation();

  return (
    <Stack
      width="100%"
      gap={6}
      textAlign="center"
      flexGrow={1}
      justifyContent="center"
      alignItems="center"
      maxWidth="340px"
    >
      <PendingKeystoneCircles startImmediately />

      <Typography variant="body2">
        {t(
          'Please approve the connection request displayed on your Keystone device.',
        )}
      </Typography>
    </Stack>
  );
};
