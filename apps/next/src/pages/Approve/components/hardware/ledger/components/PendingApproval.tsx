import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/k2-alpine';

import { LedgerAppOutdatedHint } from '@/components/LedgerAppOutdatedHint';
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
        <Typography variant="body3" fontWeight={500} textAlign="center" mt={4}>
          {t('Please review the transaction on your Ledger')}
        </Typography>
        <LedgerAppOutdatedHint
          showIcon={false}
          mt={2}
          justifyContent="center"
          textAlign="center"
        />
      </Stack>
    </Stack>
  );
};
