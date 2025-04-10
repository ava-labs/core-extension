import { useTranslation } from 'react-i18next';
import {
  Grid,
  GridProps,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';

import { DefiPerpetualItem } from 'packages/service-worker/src/services/defi/models';

import { useConvertedCurrencyFormatter } from '../hooks/useConvertedCurrencyFormatter';
import { DefiTokenAvatarGroup } from './DefiTokenAvatarGroup';

type Props = {
  items: DefiPerpetualItem[];
};

const GridCell = ({ sx, ...props }: GridProps) => (
  <Grid
    item
    sx={[
      { display: 'inline-flex', alignItems: 'center' },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
    {...props}
  />
);

export const DefiPortfolioPerpetual = ({ items }: Props) => {
  const { t } = useTranslation();
  const formatValue = useConvertedCurrencyFormatter();

  return (
    <Stack sx={{ gap: 1.25 }}>
      <Grid container spacing={1}>
        <Grid container item spacing={1}>
          <GridCell xs={5}>
            <Typography variant="button">{t('Token Pair')}</Typography>
          </GridCell>
          <GridCell xs={3}>
            <Typography variant="button">{t('PnL')}</Typography>
          </GridCell>
          <GridCell xs={4} sx={{ justifyContent: 'end' }}>
            <Typography variant="button">{t('Value')}</Typography>
          </GridCell>
        </Grid>

        {items.map(
          (
            { marginToken, positionToken, profitUsdValue, netUsdValue },
            index,
          ) => {
            return (
              <Grid
                container
                item
                spacing={1}
                key={`defi-perpetual-${index}`}
                data-testid="defi-item"
                sx={{ alignItems: 'center' }}
              >
                <GridCell xs={5} sx={{ gap: 0.5 }}>
                  <DefiTokenAvatarGroup
                    tokens={[positionToken, marginToken]}
                    maxTokens={2}
                  />
                  <Typography
                    variant="caption"
                    data-testid="defi-item-token-pair"
                  >
                    {positionToken.symbol}/{marginToken.symbol}
                  </Typography>
                </GridCell>
                <GridCell xs={3}>
                  <Typography variant="caption">
                    {formatValue(profitUsdValue)}
                  </Typography>
                </GridCell>
                <GridCell xs={4} sx={{ justifyContent: 'end' }}>
                  <Typography variant="caption" data-testid="defi-item-value">
                    {formatValue(netUsdValue)}
                  </Typography>
                </GridCell>
              </Grid>
            );
          },
        )}
      </Grid>
    </Stack>
  );
};
