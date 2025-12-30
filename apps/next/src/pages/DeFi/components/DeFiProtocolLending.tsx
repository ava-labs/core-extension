import { FC } from 'react';
import { Divider, Stack } from '@avalabs/k2-alpine';

import { DefiLendingItem } from '@core/types';

import { DeFiProtocolCommonSection } from './DeFiProtocolCommonSection';

import { useTranslation } from 'react-i18next';

type DeFiProtocolLendingProps = {
  items: DefiLendingItem[];
};

export const DeFiProtocolLending: FC<DeFiProtocolLendingProps> = ({
  items,
}) => {
  const { t } = useTranslation();

  return (
    <Stack direction="column" gap={0.5}>
      {items.map(
        (
          { supplyTokens, borrowTokens, rewardTokens }: DefiLendingItem,
          index: number,
        ) => {
          const key = `defi-lending-${index}`;
          return (
            <Stack key={key} direction="column" gap={1}>
              {supplyTokens.length > 0 && (
                <>
                  <DeFiProtocolCommonSection
                    title={t('Supplied')}
                    tokens={supplyTokens}
                  />
                  <Divider variant="fullWidth" />
                </>
              )}
              {borrowTokens.length > 0 && (
                <>
                  <DeFiProtocolCommonSection
                    title={t('Borrowed')}
                    tokens={borrowTokens}
                  />
                  <Divider variant="fullWidth" />
                </>
              )}
              {rewardTokens.length > 0 && (
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
