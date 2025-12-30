import { FC } from 'react';
import { Stack } from '@avalabs/k2-alpine';

import { DefiVestingItem } from '@core/types';

import { DeFiProtocolCommonSection } from './DeFiProtocolCommonSection';

import { useTranslation } from 'react-i18next';

type DeFiProtocolVestingProps = {
  items: DefiVestingItem[];
};

export const DeFiProtocolVesting: FC<DeFiProtocolVestingProps> = ({
  items,
}) => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" gap={1}>
      {items.map(({ token }: DefiVestingItem, index: number) => {
        const key = `defi-vesting-${index}`;
        return (
          <Stack key={key} direction="column" gap={0.5}>
            <DeFiProtocolCommonSection title={t('Vesting')} tokens={[token]} />
          </Stack>
        );
      })}
    </Stack>
  );
};
