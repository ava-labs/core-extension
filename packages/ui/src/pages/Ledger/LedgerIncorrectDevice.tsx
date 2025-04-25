import Dialog from '@/components/common/Dialog';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import DangerIcon from '@/components/icons/DangerIcon';
import { Stack, Typography, useTheme } from '@avalabs/core-k2-components';
import useIsIncorrectDevice from './hooks/useIsIncorrectDevice';
import { useLedgerContext } from '@/contexts/LedgerProvider';

const LedgerIncorrectDevice = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { closeCurrentApp } = useLedgerContext();
  const isIncorrectDevice = useIsIncorrectDevice();
  const theme = useTheme();

  useEffect(() => {
    if (isIncorrectDevice) {
      setIsDialogOpen(true);
      closeCurrentApp();
    }
  }, [isIncorrectDevice, closeCurrentApp]);

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      title={t('Incorrect Ledger')}
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
              'This Ledger was not used to create this wallet. Please connect the original Ledger device to continue.',
            )}
          </Typography>
          <Stack sx={{ mt: '48px', mb: '16px' }}>
            <DangerIcon />
          </Stack>
        </>
      }
    />
  );
};

export default LedgerIncorrectDevice;
