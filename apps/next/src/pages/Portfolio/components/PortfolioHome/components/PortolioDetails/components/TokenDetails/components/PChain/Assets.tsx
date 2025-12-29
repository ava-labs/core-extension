import { TokenUnit } from '@avalabs/core-utils-sdk';
import { TokenWithBalancePVM } from '@avalabs/vm-module-types';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AssetsLayout } from '../XPChains/AssetsLayout';
import { BalanceLineItem } from '../XPChains/BalanceLineItem';

type Props = {
  balances: TokenWithBalancePVM;
};

export const Assets: FC<Props> = ({ balances }) => {
  const { t } = useTranslation();

  const { balancePerType, decimals, symbol } = balances;

  const formatter = (balance: bigint | undefined) => {
    return `${new TokenUnit(balance || 0n, decimals, symbol).toDisplay()} AVAX`;
  };

  return (
    <AssetsLayout network="p-chain">
      <BalanceLineItem
        title={t('Locked staked')}
        balance={formatter(balancePerType.lockedStaked)}
      />
      <BalanceLineItem
        title={t('Locked stakeable')}
        balance={formatter(balancePerType.lockedStakeable)}
      />
      <BalanceLineItem
        title={t('Locked platform')}
        balance={formatter(balancePerType.lockedPlatform)}
      />
      <BalanceLineItem
        title={t('Atomic memory locked')}
        balance={formatter(balancePerType.atomicMemoryLocked)}
      />
      <BalanceLineItem
        title={t('Atomic memory unlocked')}
        balance={formatter(balancePerType.atomicMemoryUnlocked)}
      />
      <BalanceLineItem
        title={t('Unlocked unstaked')}
        balance={formatter(balancePerType.unlockedUnstaked)}
      />
      <BalanceLineItem
        title={t('Unlocked staked')}
        balance={formatter(balancePerType.unlockedStaked)}
      />
    </AssetsLayout>
  );
};
