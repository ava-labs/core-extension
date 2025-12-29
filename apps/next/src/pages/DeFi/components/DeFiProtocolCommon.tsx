import { FC } from 'react';
import { Divider, Stack } from '@avalabs/k2-alpine';
import { DefiCommonItem } from '@core/types';

import { DeFiProtocolCommonSection } from './DeFiProtocolCommonSection';

import { useTranslation } from 'react-i18next';

type DeFiProtocolCommonProps = {
  items: DefiCommonItem[];
};

export const DeFiProtocolCommon: FC<DeFiProtocolCommonProps> = ({ items }) => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" gap={0.5}>
      {items.map(
        (
          { supplyTokens = [], rewardTokens = [] }: DefiCommonItem,
          index: number,
        ) => {
          const key = `defi-common-${index}`;
          const hasRewards = rewardTokens.length > 0;

          return (
            <Stack key={key} direction="column" gap={1}>
              <>
                <DeFiProtocolCommonSection
                  title={t('Supplied')}
                  tokens={supplyTokens}
                />
                {hasRewards && <Divider variant="fullWidth" />}
              </>

              {hasRewards && (
                <DeFiProtocolCommonSection
                  title={t('Rewards')}
                  tokens={rewardTokens}
                />
              )}
            </Stack>
          );
        },
      )}
    </Stack>
  );
};
