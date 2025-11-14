import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { MdOutlineCheckCircle } from 'react-icons/md';
import { Box, Button, Stack, Typography, useTheme } from '@avalabs/k2-alpine';

import { useKeystoneUsbContext } from '@core/ui';

import {
  FullscreenModal,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { FullscreenAnimatedBackground } from '@/components/FullscreenAnimatedBackground';

export const KeystoneUsbReconnect = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { popDeviceSelection } = useKeystoneUsbContext();

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const onReconnect = useCallback(async () => {
    try {
      setIsConnecting(true);
      await popDeviceSelection();
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [popDeviceSelection]);

  return (
    <>
      <FullscreenAnimatedBackground />
      <FullscreenModal open>
        <FullscreenModalTitle>
          {t('Reconnect your Keystone')}
        </FullscreenModalTitle>
        <FullscreenModalDescription>
          {t(
            'It seems that Core no longer has access to your Keystone device. Please click the button below to reconnect it.',
          )}
        </FullscreenModalDescription>
        <FullscreenModalContent>
          <Stack flexGrow={1} justifyContent="center" alignItems="center">
            {!isConnected ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={onReconnect}
                disabled={isConnecting}
                loading={isConnecting}
              >
                {t('Reconnect')}
              </Button>
            ) : (
              <Stack gap={4}>
                <Stack alignItems="center">
                  <Box flexShrink={0} color={theme.palette.success.main}>
                    <MdOutlineCheckCircle size={40} />
                  </Box>
                  <Typography variant="h6" mt={2}>
                    {t('Your device is now connected to Core!')}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {t(
                      'You can now close this window and continue using Core.',
                    )}
                  </Typography>
                </Stack>
                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  onClick={window.close}
                >
                  {t('Close')}
                </Button>
              </Stack>
            )}
          </Stack>
        </FullscreenModalContent>
      </FullscreenModal>
    </>
  );
};
