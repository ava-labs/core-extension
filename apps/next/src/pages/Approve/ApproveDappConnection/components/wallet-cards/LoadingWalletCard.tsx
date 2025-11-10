import { FC } from 'react';

import { ConnectWalletCardProps } from '../../types';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Stack, Typography } from '@avalabs/k2-alpine';

export const LoadingWalletCard: FC<ConnectWalletCardProps> = () => {
  const { t } = useTranslation();

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <CircularProgress size={16} />
      <Typography variant="body3" color="text.secondary" fontStyle="italic">
        {t('Creating Solana addresses...')}
      </Typography>
    </Stack>
  );
};
