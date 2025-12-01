import { Divider, Typography } from '@avalabs/k2-alpine';

import { Stack } from '@avalabs/k2-alpine';
import { StyledCard } from '../../styled';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { TokenWithBalancePVM } from '@avalabs/vm-module-types';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdInfoOutline, MdNavigateNext } from 'react-icons/md';
import { CORE_WEB_BASE_URL } from '@/config/constants';

type Props = {
  balances: TokenWithBalancePVM;
};

export const Assets: FC<Props> = ({ balances }) => {
  const { t } = useTranslation();

  const _typeDisplayNames = {
    lockedStaked: t('Locked Staked'),
    lockedStakeable: t('Locked Stakeable'),
    lockedPlatform: t('Locked Platform'),
    atomicMemoryLocked: t('Atomic Memory Locked'),
    atomicMemoryUnlocked: t('Atomic Memory Unlocked'),
    unlockedUnstaked: t('Unlocked Unstaked'),
    unlockedStaked: t('Unlocked Staked'),
    pendingStaked: t('Pending Staked'),
  };
  return (
    <>
      <StyledCard
        onClick={() =>
          window.open(
            `${CORE_WEB_BASE_URL}/portfolio/wallet/p-chain/utxos`,
            '_blank',
          )
        }
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <MdInfoOutline size={20} />
          <Stack>
            <Typography variant="subtitle4">
              {t('UTXOs across multiple addresses')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('View all of your balances and UTXOs')}
            </Typography>
          </Stack>
          <MdNavigateNext size={20} color="text.secondary" />
        </Stack>
      </StyledCard>
      <StyledCard>
        <Stack divider={<Divider />}>
          {Object.entries(balances.balancePerType).map(([type, balance]) => {
            const displayBalance = new TokenUnit(
              balance,
              balances.decimals,
              balances.symbol,
            ).toDisplay();

            const displayBalanceWithSymbol = `${displayBalance} AVAX`;
            return (
              <Stack
                key={type}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                p={1.5}
              >
                <Typography variant="subtitle3">
                  {_typeDisplayNames[type]}
                </Typography>
                <Typography
                  variant="body3"
                  color="text.secondary"
                  textAlign="right"
                >
                  {displayBalanceWithSymbol}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </StyledCard>
    </>
  );
};
