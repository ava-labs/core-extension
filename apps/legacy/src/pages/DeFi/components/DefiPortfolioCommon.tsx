import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/core-k2-components';

import { sumByProperty } from '@core/common';
import { DefiCommonItem } from '@core/types';

import { useConvertedCurrencyFormatter } from '@core/ui';
import { DefiTokenAvatarGroup } from './DefiTokenAvatarGroup';
import { useMemo } from 'react';

type Props = {
  items: DefiCommonItem[];
  header: string;
};

export const DefiPortfolioCommon = ({ items, header }: Props) => {
  const { t } = useTranslation();
  const formatValue = useConvertedCurrencyFormatter();

  const mostTokensInAnItem = useMemo(
    () => Math.max(...items.map((item) => item.supplyTokens?.length ?? 0)),
    [items],
  );

  return (
    <Stack sx={{ gap: 1.25 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="button">{header}</Typography>
        <Typography variant="button">{t('Value')}</Typography>
      </Stack>

      <Stack sx={{ gap: 2 }}>
        {items.map(({ supplyTokens = [], rewardTokens = [] }, index) => {
          const hasRewards = rewardTokens.length > 0;
          const suppliedValue = formatValue(
            sumByProperty(supplyTokens, 'usdValue'),
          );
          const rewardedValue = formatValue(
            sumByProperty(rewardTokens, 'usdValue'),
          );
          const symbols = supplyTokens.map(({ symbol }) => symbol).join(' + ');

          return (
            <Stack
              key={`defi-common-${index}`}
              direction="row"
              sx={{ gap: 1, justifyContent: 'space-between' }}
              data-testid="defi-item"
            >
              <Stack
                direction="row"
                sx={{ gap: 1, width: 1, alignItems: 'flex-start' }}
              >
                <DefiTokenAvatarGroup
                  tokens={supplyTokens}
                  maxTokens={mostTokensInAnItem}
                />
                <Stack
                  sx={{
                    gap: 0.5,
                    flexGrow: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{ justifyContent: 'space-between', gap: 1 }}
                  >
                    <Typography
                      title={symbols}
                      variant="caption"
                      noWrap
                      data-testid="defi-item-token-list"
                    >
                      {symbols}
                    </Typography>
                    <Typography variant="caption" data-testid="defi-item-value">
                      {suppliedValue}
                    </Typography>
                  </Stack>

                  {hasRewards && (
                    <Stack
                      direction="row"
                      sx={{ justifyContent: 'space-between', gap: 1 }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {t('Rewards')}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        data-testid="defi-item-rewards-value"
                      >
                        {rewardedValue}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};
