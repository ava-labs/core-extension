import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography } from '@avalabs/core-k2-components';

import { Overlay } from '@/components/common/Overlay';
import { useKeystoneUsbContext } from '@core/ui';
import { useState } from 'react';

export const Keystone3Troubleshooting = () => {
  const { t } = useTranslation();
  const { popDeviceSelection } = useKeystoneUsbContext();

  const [isConnected, setIsConnected] = useState(false);

  return (
    <Overlay isBackgroundFilled>
      <Stack
        sx={{
          width: 375,
          p: 3,
          gap: 2,
          alignSelf: 'center',
          backgroundColor: 'grey.900',
          borderRadius: 1,
          textAlign: 'center',
        }}
      >
        {isConnected && (
          <>
            <Typography variant="h5">
              {t('Successfully reconnected!')}
            </Typography>
            <Button
              color="primary"
              size="large"
              sx={{ mt: 3 }}
              onClick={window.close}
            >
              {t('Close')}
            </Button>
          </>
        )}
        {!isConnected && (
          <>
            <Typography variant="h5">{t('Keystone Disconnected')}</Typography>
            <Typography variant="body2">
              {t(
                'Core is no longer connected to your Keystone device. Reconnect your Keystone to continue.',
              )}
            </Typography>
            <Button
              color="primary"
              size="large"
              onClick={async () => {
                try {
                  await popDeviceSelection();
                  setIsConnected(true);
                } catch {
                  setIsConnected(false);
                }
              }}
              sx={{ mt: 3 }}
            >
              {t('Reconnect')}
            </Button>
          </>
        )}
      </Stack>
    </Overlay>
  );
};
