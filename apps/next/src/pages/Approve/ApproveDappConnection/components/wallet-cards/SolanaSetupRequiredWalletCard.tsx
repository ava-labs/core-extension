import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Stack, Typography } from '@avalabs/k2-alpine';

import { ConnectWalletCardProps } from '../../types';
import { FiAlertCircle } from 'react-icons/fi';

export const SolanaSetupRequiredWalletCard: FC<ConnectWalletCardProps> = () => {
  const { t } = useTranslation();

  return (
    <Stack direction="row" gap={1.5} alignItems="center">
      <Stack direction="row" alignItems="center" color="error.main" gap={1}>
        <Box flexShrink={0} lineHeight={1}>
          <FiAlertCircle size={24} />
        </Box>
        <Typography variant="body3" lineHeight={1.2}>
          {t('Add Solana accounts first to use the Solana network')}
        </Typography>
      </Stack>
      <Button
        size="xsmall"
        color="secondary"
        variant="contained"
        onClick={() => alert('TODO: Implement')}
      >
        {t('Set up')}
      </Button>
    </Stack>
  );
};
