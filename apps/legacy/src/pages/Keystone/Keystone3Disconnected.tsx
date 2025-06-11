import {
  Typography,
  Box,
  Stack,
  CircularProgress,
  Button,
} from '@avalabs/core-k2-components';
import { Trans, useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { tabs } from 'webextension-polyfill';

export const Keystone3Disconnected = () => {
  const { t } = useTranslation();
  const openTroubleshootingPopup = useCallback(() => {
    // Open in a full screen tab to avoid popup hell
    tabs.create({
      url: '/fullscreen.html#/keystone3/troubleshooting',
    });
  }, []);

  return (
    <>
      <Typography
        variant="body2"
        align="left"
        sx={{
          lineHeight: '20px',
          color: 'text.secondary',
        }}
      >
        <Trans
          i18nKey="To continue, connect your Keystone device, make sure it's unlocked, and on the homepage."
          components={{
            bold: <Box component="span" sx={{ fontWeight: 600 }} />,
          }}
        />
      </Typography>
      <Stack sx={{ mt: '48px', mb: '16px', alignItems: 'center' }}>
        <CircularProgress size={48} />
      </Stack>
      <Button
        variant="text"
        color="primary"
        onClick={openTroubleshootingPopup}
        sx={{ mt: 2 }}
      >
        {t('Unable to connect?')}
      </Button>
    </>
  );
};
