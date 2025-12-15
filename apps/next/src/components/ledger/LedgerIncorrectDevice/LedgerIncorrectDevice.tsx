import { useTranslation } from 'react-i18next';
import { FiAlertCircle } from 'react-icons/fi';
import { FC, useEffect, useState } from 'react';
import { Stack, Typography, useTheme } from '@avalabs/k2-alpine';

import { useIsIncorrectDevice, useLedgerContext } from '@core/ui';

import { Page } from '@/components/Page';
import { SlideUpDialog } from '@/components/Dialog';

export const LedgerIncorrectDevice: FC = () => {
  const { t } = useTranslation();
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
    <SlideUpDialog open={isDialogOpen}>
      <Page
        title={t('Incorrect Ledger')}
        withBackButton={false}
        withViewSwitcher={false}
      >
        <Typography variant="body3">
          {t(
            'This Ledger was not used to create this wallet. Please connect the original Ledger device to continue.',
          )}
        </Typography>
        <Stack sx={{ mt: '48px', mb: '16px' }}>
          <FiAlertCircle color={theme.palette.error.main} />
        </Stack>
      </Page>
    </SlideUpDialog>
  );
};
