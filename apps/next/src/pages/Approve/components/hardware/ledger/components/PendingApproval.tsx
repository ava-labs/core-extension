import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/k2-alpine';

import { PendingLedgerCircles } from '@/components/PendingCircles';

import { StateComponentProps } from '../types';

export const PendingApproval: FC<StateComponentProps> = ({ state }) => {
  const { t } = useTranslation();

  if (state.state !== 'pending') {
    return null;
  }

  return (
    <Stack width="100%" height="100%" gap={2}>
      <Stack px={6} flexGrow={1} alignItems="center" justifyContent="center">
        <PendingLedgerCircles />
        <Stack gap={1} textAlign="center">
          <Typography variant="body3" fontWeight={500}>
            {t('Please review the transaction on your Ledger')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t(
              'Open the {{appName}} app on your Ledger device in order to continue with this transaction',
              { appName: state.requiredApp },
            )}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
