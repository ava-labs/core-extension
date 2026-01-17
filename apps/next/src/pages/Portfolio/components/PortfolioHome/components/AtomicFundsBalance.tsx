import { Card } from '@/components/Card';
import { CORE_WEB_BASE_URL } from '@/config';
import { Box, Button, Stack, styled, Typography } from '@avalabs/k2-alpine';
import { useBalancesContext } from '@core/ui/src/contexts/BalancesProvider';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FiAlertCircle } from 'react-icons/fi';

type Props = {
  accountId: string | undefined;
};

const StyledCard = styled(Card)(({ theme }) =>
  theme.palette.mode === 'light'
    ? {
        backgroundColor: theme.palette.surface.secondary,
      }
    : {},
);

// TODO: Multiple token support
export const AtomicFundsBalance: FC<Props> = ({ accountId }) => {
  const { t } = useTranslation();
  const { getAtomicBalance } = useBalancesContext();
  const atomicBalance = getAtomicBalance(accountId);

  if (!accountId || !atomicBalance?.balanceDisplayValue) {
    return null;
  }

  return (
    <StyledCard>
      <Stack direction="row" gap={1} alignItems="center" px={1} py={1}>
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
                  amount: atomicBalance.balanceDisplayValue,
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
    </StyledCard>
  );
};
