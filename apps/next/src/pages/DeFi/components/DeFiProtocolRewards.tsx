import { FC } from 'react';
import { Stack } from '@avalabs/k2-alpine';

import { DefiRewardItem } from '@core/types';

import { DeFiProtocolCommonSection } from './DeFiProtocolCommonSection';

import { useTranslation } from 'react-i18next';

type DeFiProtocolRewardsProps = {
  items: DefiRewardItem[];
};

export const DeFiProtocolRewards: FC<DeFiProtocolRewardsProps> = ({
  items,
}) => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" gap={1}>
      {items.map(({ tokens }: DefiRewardItem, index: number) => {
        const key = `defi-rewards-${index}`;
        return (
          <Stack key={key} direction="column" gap={0.5}>
            <DeFiProtocolCommonSection title={t('Rewards')} tokens={tokens} />
          </Stack>
        );
      })}
    </Stack>
  );
};
