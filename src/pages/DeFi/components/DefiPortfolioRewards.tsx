import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/k2-components';

import { DefiRewardItem } from '@src/background/services/defi/models';

import { DefiTokenAvatarGroup } from './DefiTokenAvatarGroup';
import { useConvertedCurrencyFormatter } from '../hooks/useConvertedCurrencyFormatter';

type Props = {
  items: DefiRewardItem[];
};

export const DefiPortfolioRewards = ({ items }: Props) => {
  const { t } = useTranslation();
  const formatValue = useConvertedCurrencyFormatter();

  const mostTokensInAnItem = useMemo(
    () =>
      items.reduce((max, item) => {
        return Math.max(max, item.tokens.length ?? 0);
      }, 0),
    [items]
  );

  return (
    <Stack sx={{ gap: 1.25 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="button">{t('Pool')}</Typography>
        <Typography variant="button">{t('Value')}</Typography>
      </Stack>

      {items.map(({ tokens, netUsdValue }, index) => {
        const symbols = tokens.map(({ symbol }) => symbol).join(' + ');

        return (
          <Stack
            key={`defi-rewards-${index}`}
            direction="row"
            sx={{ gap: 1, justifyContent: 'space-between' }}
            data-testid="defi-item"
          >
            <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
              <DefiTokenAvatarGroup
                maxTokens={mostTokensInAnItem}
                tokens={tokens}
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
                    {formatValue(netUsdValue)}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
};
