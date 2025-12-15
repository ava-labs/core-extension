import { FC } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { Box, Button, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/Card';
import { CORE_WEB_BASE_URL } from '@/config';

type Props = {
  atomicBalance: number;
};

// TODO: Multiple token support
export const AtomicFundsBalance: FC<Props> = ({ atomicBalance }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  if (!atomicBalance) {
    return <></>;
  }

  return (
    <Card>
      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        sx={{
          px: theme.spacing(1.5),
          py: theme.spacing(1),
        }}
      >
        <Box flexShrink={0} lineHeight={1} color="error.main">
          <FiAlertCircle size={24} />
        </Box>
        <Stack direction="row" alignItems="center" gap={1}>
          <Stack gap={0.5}>
            <Typography variant="body3" color="text.primary">
              {t('Core has detected stuck funds')}
            </Typography>
            <Typography variant="body3" color="text.secondary">
              {t(
                'You have {{amount}} AVAX stuck in atomic memory from incomplete cross-chain transfers',
                {
                  amount: atomicBalance,
                },
              )}
            </Typography>
          </Stack>
          <Button
            size="xsmall"
            variant="contained"
            color="primary"
            onClick={() => {
              window.open(
                `${CORE_WEB_BASE_URL}/portfolio`,
                '_blank',
                'noreferrer',
              );
            }}
          >
            {t('Recover')}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};
