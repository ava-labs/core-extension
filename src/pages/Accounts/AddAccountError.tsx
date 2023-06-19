import { Stack, Typography, useTheme } from '@avalabs/k2-components';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { LedgerAppType } from '@src/contexts/LedgerProvider';
import { useLedgerDisconnectedDialog } from '@src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog';

export function AddAccountError() {
  const history = useHistory();
  const theme = useTheme();
  const { t } = useTranslation();

  useLedgerDisconnectedDialog(history.goBack, LedgerAppType.AVALANCHE);

  return (
    <Stack sx={{ px: 2, py: 1 }}>
      <Typography variant="caption" color={theme.palette.error.main}>
        {t('An error occurred, please try again later')}
      </Typography>
    </Stack>
  );
}
