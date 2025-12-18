import { TokenUnit } from '@avalabs/core-utils-sdk';
import { TokenWithBalanceAVM } from '@avalabs/vm-module-types';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AssetsLayout } from '../XPChains/AssetsLayout';
import { BalanceLineItem } from '../XPChains/BalanceLineItem';

type Props = {
  balances: TokenWithBalanceAVM;
};

export const Assets: FC<Props> = ({
  balances: { balancePerType, decimals, symbol },
}) => {
  const { t } = useTranslation();

  const formatter = (balance: bigint | undefined) => {
    return `${new TokenUnit(balance || 0n, decimals, symbol).toDisplay()} AVAX`;
  };

  return (
    <AssetsLayout network="x-chain">
      <BalanceLineItem
        title={t('Locked')}
        balance={formatter(balancePerType.locked)}
      />
      <BalanceLineItem
        title={t('Unlocked')}
        balance={formatter(balancePerType.unlocked)}
      />
      <BalanceLineItem
        title={t('Atomic memory locked')}
        balance={formatter(balancePerType.atomicMemoryLocked)}
      />
      <BalanceLineItem
        title={t('Atomic memory unlocked')}
        balance={formatter(balancePerType.atomicMemoryUnlocked)}
      />
    </AssetsLayout>
  );
};
