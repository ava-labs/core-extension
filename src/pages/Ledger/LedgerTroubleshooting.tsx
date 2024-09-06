import { useTranslation } from 'react-i18next';
import { Button, Stack, Typography } from '@avalabs/core-k2-components';

import { Overlay } from '@src/components/common/Overlay';
import { useLedgerContext } from '@src/contexts/LedgerProvider';
import { useState } from 'react';
import { useAppDimensions } from '@src/hooks/useAppDimensions';

export const LedgerTroubleshooting = () => {
  const { t } = useTranslation();
  const { popDeviceSelection } = useLedgerContext();
	const { height, ...dimensions } = useAppDimensions(); // eslint-disable-line

  const [isConnected, setIsConnected] = useState(false);

  return (
    <Overlay isBackgroundFilled>
      <Stack
        sx={{
          ...dimensions,
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
            <Typography variant="h5">{t('Ledger Disconnected')}</Typography>
            <Typography variant="body2">
              {t(
                'Core is no longer connected to your Ledger device. Reconnect your Ledger to continue.'
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
