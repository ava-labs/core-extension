import { FC } from 'react';

import { ConnectWalletCardProps } from '../../types';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { FiAlertCircle } from 'react-icons/fi';

export const NetworkNotSupportedWalletCard: FC<ConnectWalletCardProps> = () => {
  const { t } = useTranslation();

  return (
    <Stack direction="row" alignItems="center" color="error.main" gap={1}>
      <FiAlertCircle size={20} />
      <Typography variant="body3">
        {t('This wallet does not support the requested network')}
      </Typography>
    </Stack>
  );
};
