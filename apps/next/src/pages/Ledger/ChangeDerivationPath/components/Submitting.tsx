import { Stack, Typography } from '@avalabs/k2-alpine';

import { CircularProgress } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const Submitting: FC = () => {
  const { t } = useTranslation();
  return (
    <Stack height={1} gap={2} alignItems="center" justifyContent="center">
      <CircularProgress />
      <Typography variant="subtitle1">
        {t('Changing the derivation path...')}
      </Typography>
    </Stack>
  );
};
