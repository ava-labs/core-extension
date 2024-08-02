import { useState } from 'react';
import {
  CircularProgress,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import Dialog from '@src/components/common/Dialog';
import { useTranslation } from 'react-i18next';

export const LedgerDisconnectDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      title={t('Ledger Disconnected')}
      content={
        <>
          <Typography
            variant="body2"
            align="left"
            color={theme.palette.grey[500]}
            sx={{
              lineHeight: '20px',
            }}
          >
            {t(
              'Connect your Ledger device and open the Avalanche App to approve this transaction'
            )}
          </Typography>
          <CircularProgress size={48} />
        </>
      }
    />
  );
};
