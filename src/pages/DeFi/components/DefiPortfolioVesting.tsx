import { useTranslation } from 'react-i18next';
import { Avatar, Stack, Typography } from '@avalabs/core-k2-components';

import { DefiVestingItem } from 'packages/service-worker/src/services/defi/models';

import { useConvertedCurrencyFormatter } from '../hooks/useConvertedCurrencyFormatter';

type Props = {
  items: DefiVestingItem[];
};

export const DefiPortfolioVesting = ({ items }: Props) => {
  const { t } = useTranslation();
  const formatValue = useConvertedCurrencyFormatter();

  return (
    <Stack sx={{ gap: 1.25 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="button">{t('Pool')}</Typography>
        <Typography variant="button">{t('Value')}</Typography>
      </Stack>

      {items.map(({ token, netUsdValue }, index) => (
        <Stack
          key={`defi-vesting-${index}`}
          direction="row"
          sx={{ gap: 1, justifyContent: 'space-between' }}
          data-testid="defi-item"
        >
          <Stack direction="row" sx={{ gap: 1, alignItems: 'flex-start' }}>
            <Avatar
              sx={{ width: 16, height: 16 }}
              src={token.logoUrl}
              alt={token.name}
              data-testid="defi-item-token-avatar"
            />
            <Stack sx={{ gap: 0.5 }}>
              <Typography variant="caption" data-testid="defi-item-token-list">
                {token.symbol}
              </Typography>
            </Stack>
          </Stack>
          <Stack sx={{ gap: 0.5, textAlign: 'end' }}>
            <Typography variant="caption" data-testid="defi-item-value">
              {formatValue(netUsdValue)}
            </Typography>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
