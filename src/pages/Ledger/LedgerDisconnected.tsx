import {
  Typography,
  Box,
  Stack,
  CircularProgress,
} from '@avalabs/core-k2-components';
import { Trans } from 'react-i18next';

export const LedgerDisconnected = () => {
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
    </>
  );
};
