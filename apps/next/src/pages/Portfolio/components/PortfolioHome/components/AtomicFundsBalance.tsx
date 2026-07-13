import { Card } from '@/components/Card';
import { CORE_WEB_BASE_URL } from '@/config';
import { ServiceType, Transfer } from '@avalabs/fusion-sdk';
import { Box, Button, Stack, styled, Typography } from '@avalabs/k2-alpine';
import { stripAddressPrefix } from '@core/common';
import {
  Account,
  isCompletedTransfer,
  isTransferInProgress,
} from '@core/types';
import {
  useAccountsContext,
  useBalancesContext,
  useTransferTrackingContext,
} from '@core/ui';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiAlertCircle } from 'react-icons/fi';

type Props = {
  accountId: string | undefined;
};

const RECENT_AVALANCHE_CCT_COMPLETION_GRACE_PERIOD_MS = 15_000;

const StyledCard = styled(Card)(({ theme }) =>
  theme.palette.mode === 'light'
    ? {
        backgroundColor: theme.palette.surface.secondary,
      }
    : {},
);

const normalizeAddress = (address: string | undefined) =>
  address ? stripAddressPrefix(address).toLowerCase() : undefined;

const isTransferForAccount = (transfer: Transfer, account: Account) => {
  const accountAddresses = new Set(
    [
      account.addressC,
      account.addressCoreEth,
      account.addressAVM,
      account.addressPVM,
    ]
      .map(normalizeAddress)
      .filter(Boolean),
  );

  return (
    accountAddresses.has(normalizeAddress(transfer.fromAddress)) ||
    accountAddresses.has(normalizeAddress(transfer.toAddress))
  );
};

// TODO: Multiple token support
export const AtomicFundsBalance: FC<Props> = ({ accountId }) => {
  const { t } = useTranslation();
  const {
    accounts: { active },
  } = useAccountsContext();
  const { getAtomicBalance } = useBalancesContext();
  const { transfers } = useTransferTrackingContext();
  const [now, setNow] = useState(() => Date.now());
  const atomicBalance = getAtomicBalance(accountId);

  const suppressRecoveryBannerUntil = useMemo(() => {
    if (!active) {
      return 0;
    }

    return transfers.reduce((suppressUntil, { transfer }) => {
      if (
        transfer.type !== ServiceType.AVALANCHE_CCT ||
        !isTransferForAccount(transfer, active)
      ) {
        return suppressUntil;
      }

      if (isTransferInProgress(transfer)) {
        return Number.POSITIVE_INFINITY;
      }

      if (isCompletedTransfer(transfer)) {
        return Math.max(
          suppressUntil,
          transfer.completedAtMs +
            RECENT_AVALANCHE_CCT_COMPLETION_GRACE_PERIOD_MS,
        );
      }

      return suppressUntil;
    }, 0);
  }, [active, transfers]);

  useEffect(() => {
    if (
      suppressRecoveryBannerUntil === 0 ||
      suppressRecoveryBannerUntil === Number.POSITIVE_INFINITY ||
      suppressRecoveryBannerUntil <= now
    ) {
      return;
    }

    const timeout = setTimeout(
      () => setNow(Date.now()),
      suppressRecoveryBannerUntil - now,
    );

    return () => clearTimeout(timeout);
  }, [now, suppressRecoveryBannerUntil]);

  if (
    !accountId ||
    !atomicBalance?.balanceDisplayValue ||
    suppressRecoveryBannerUntil > now
  ) {
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
