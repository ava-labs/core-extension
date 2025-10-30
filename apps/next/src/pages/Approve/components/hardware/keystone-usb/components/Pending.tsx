import { FC } from 'react';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { StateComponentProps } from '../types';
import { PendingKeystoneCircles } from './PendingKeystoneCircles';
import { useTranslation } from 'react-i18next';

export const Pending: FC<StateComponentProps> = ({ state }) => {
  const { t } = useTranslation();

  if (state !== 'pending') {
    return null;
  }

  return (
    <Stack width="100%" height="100%" gap={2}>
      <Stack px={6} flexGrow={1} alignItems="center" justifyContent="center">
        <PendingKeystoneCircles />
        <Stack gap={1} textAlign="center">
          <Typography variant="body3" fontWeight={500}>
            {t('Please review the transaction on your Keystone')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t(
              'Open the Avalanche app on your Keystone device in order to continue with this transaction',
            )}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
