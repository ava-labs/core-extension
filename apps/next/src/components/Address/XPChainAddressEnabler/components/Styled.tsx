import { FC } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Stack, Typography } from '@avalabs/k2-alpine';

import { PendingKeystoneCircles } from '@/components/PendingCircles';

export const ConnectYourKeystone = () => {
  const { t } = useTranslation();

  return (
    <Stack gap={4} alignItems="center" justifyContent="center">
      <PendingKeystoneCircles startImmediately />
      <Typography variant="body3" color="text.secondary">
        {t(
          'Please connect your Keystone device and click the button below to continue.',
        )}
      </Typography>
    </Stack>
  );
};

export const ImportingProgress = () => <CircularProgress size={50} />;

const ErrorMessage: FC<{ error: string }> = ({ error }) => (
  <Stack gap={2}>
    <Box flexShrink={0} color="error.main">
      <FiAlertCircle size={24} />
    </Box>
    <Typography variant="body3" color="error">
      {error}
    </Typography>
  </Stack>
);

export const ConnectionError = () => {
  const { t } = useTranslation();

  return <ErrorMessage error={t('We failed to connect to Keystone device')} />;
};

export const ImportError = () => {
  const { t } = useTranslation();

  return (
    <ErrorMessage
      error={t('We failed to import missing public keys from Keystone')}
    />
  );
};

export const IncorrectDeviceError = () => {
  const { t } = useTranslation();

  return (
    <ErrorMessage
      error={t(
        'The current wallet was not imported using this Keystone device. Please connect the original Keystone device to continue.',
      )}
    />
  );
};
