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

export const LedgerDisconnected = () => {
  const { t } = useTranslation();
  const openTroubleshootingPopup = useCallback(() => {
    // Open in a full screen tab to avoid popup hell
    tabs.create({
      url: '/fullscreen.html#/ledger/troubleshooting',
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
          i18nKey="Connect your Ledger device and open the <bold>Avalanche App</bold> to approve this transaction"
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
