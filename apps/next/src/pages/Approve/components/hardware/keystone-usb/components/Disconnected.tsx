import { FC } from 'react';
import { StateComponentProps } from '../types';
import { Box, Stack, Typography, Button } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { FiAlertCircle } from 'react-icons/fi';
import { useKeystoneUsbContext } from '@core/ui';

export const Disconnected: FC<StateComponentProps> = ({
  state,
  approve: _approve,
  reject,
}) => {
  const { t } = useTranslation();
  const { retryConnection } = useKeystoneUsbContext();

  if (state !== 'disconnected') {
    return null;
  }

  return (
    <Stack width="100%" height="100%" gap={2}>
      <Stack
        gap={1}
        flexGrow={1}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        color="error.main"
        px={5}
      >
        <Box flexShrink={0}>
          <FiAlertCircle size={24} color="red" />
        </Box>
        <Stack gap={0.5}>
          <Typography variant="body3" fontWeight={500}>
            {t('Keystone disconnected')}
          </Typography>
          <Stack>
            <Typography variant="caption">
              {t(
                'Core is no longer connected to your Keystone device. Reconnect to continue.',
              )}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack gap={1} p={2}>
        <Button onClick={retryConnection} fullWidth>
          {t('Reconnect')}
        </Button>
        <Button onClick={reject} fullWidth variant="outlined">
          {t('Dismiss')}
        </Button>
      </Stack>
    </Stack>
  );
};
