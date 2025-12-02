import { Divider } from '@avalabs/k2-alpine';

import { Stack } from '@avalabs/k2-alpine';
import { StyledCardNoPaddingY } from '../../styled';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import { TokenWithBalancePVM } from '@avalabs/vm-module-types';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { UtxoBanner } from '../XPChains/UtxoBanner';
import { BalanceLineItem } from '../XPChains/BalanceLineItem';

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
    <Stack rowGap={1}>
      <UtxoBanner network="p-chain" />
      <StyledCardNoPaddingY>
        <Stack divider={<Divider />}>
          {Object.entries(balances.balancePerType).map(([type, balance]) => {
            const displayBalance = new TokenUnit(
              balance,
              balances.decimals,
              balances.symbol,
            ).toDisplay();

            const displayBalanceWithSymbol = `${displayBalance} AVAX`;
            return (
              <BalanceLineItem
                key={type}
                title={_typeDisplayNames[type]}
                displayBalanceWithSymbol={displayBalanceWithSymbol}
              />
            );
          })}
        </Stack>
      </StyledCardNoPaddingY>
    </Stack>
  );
};
