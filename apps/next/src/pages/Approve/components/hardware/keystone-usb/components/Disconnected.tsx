import { FC, useCallback, useEffect } from 'react';
import { StateComponentProps } from '../types';
import { Box, Stack, Typography, Button } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useKeystoneUsbContext, isSpecificContextContainer } from '@core/ui';
import { tabs } from 'webextension-polyfill';
import { ContextContainer } from '@core/types';
import { FiAlertCircle } from 'react-icons/fi';

export const Disconnected: FC<StateComponentProps> = ({ state }) => {
  const { t } = useTranslation();
  const {
    popDeviceSelection,
    initKeystoneTransport,
    retryConnection,
    wasTransportAttempted,
  } = useKeystoneUsbContext();

  // Auto-retry connection when in disconnected state (device might be locked)
  useEffect(() => {
    if (state === 'disconnected' && wasTransportAttempted) {
      const interval = setInterval(() => {
        retryConnection();
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [state, wasTransportAttempted, retryConnection]);

  const onReconnect = useCallback(async () => {
    if (isSpecificContextContainer(ContextContainer.CONFIRM)) {
      await popDeviceSelection();
    } else {
      // Open in a full screen tab, the extension window does not support the device selection popup.
      const tab = await tabs.create({
        url: '/fullscreen.html#/keystone-usb/reconnect',
      });

      const initTransport = (tabId) => {
        if (tabId === tab.id) {
          initKeystoneTransport();
        }

        tabs.onRemoved.removeListener(initTransport);
      };

      tabs.onRemoved.addListener(initTransport);
    }
  }, [popDeviceSelection, initKeystoneTransport]);

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
          <Stack gap={1.5}>
            <Typography variant="caption">
              {t(
                'Core is no longer connected to your Keystone device. Reconnect to continue.',
              )}
            </Typography>
            <Button
              onClick={onReconnect}
              fullWidth
              variant="contained"
              color="primary"
              size="extension"
            >
              {t('Unable to connect?')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
