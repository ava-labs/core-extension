import {
  Stack,
  Theme,
  TriangleDownIcon,
  TriangleUpIcon,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import {
  FungibleTokenBalance,
  getUnconfirmedBalanceInCurrency,
} from '@core/types';
import { useSettingsContext } from '@core/ui';
import { useMemo } from 'react';

export type Trend = 'up' | 'down' | 'no-change';

interface ProfitAndLossProps {
  asset: FungibleTokenBalance;
}

const getTrend = (percentage: number | undefined | null): Trend => {
  if (percentage === undefined || percentage === null) {
    return 'no-change';
  }
  if (percentage > 0) {
    return 'up';
  }
  if (percentage < 0) {
    return 'down';
  }
  return 'no-change';
};

const getTrendColor = (trend: Trend, theme: Theme): string => {
  switch (trend) {
    case 'up':
      return theme.palette.success.main;
    case 'down':
      return theme.palette.error.light;
    default:
      return theme.palette.text.secondary;
  }
};

const getTrendIcon = (trend: Trend) => {
  switch (trend) {
    case 'up':
      return <TriangleUpIcon size={8} />;
    case 'down':
      return <TriangleDownIcon size={8} />;
    default:
      return null;
  }
};

export const ProfitAndLoss = ({ asset }: ProfitAndLossProps) => {
  const { currencyFormatter } = useSettingsContext();
  const theme = useTheme();

  const priceChanges = asset.priceChanges;
  const balanceInCurrency = asset.balanceInCurrency;

  const trend = getTrend(priceChanges?.percentage);
  const trendColor = useMemo(() => getTrendColor(trend, theme), [trend, theme]);
  const trendIcon = getTrendIcon(trend);

  if (
    !priceChanges ||
    priceChanges.percentage === undefined ||
    priceChanges.percentage === null ||
    priceChanges.value === undefined ||
    balanceInCurrency === undefined
  ) {
    return null;
  }

  const totalBalance =
    balanceInCurrency + (getUnconfirmedBalanceInCurrency(asset) ?? 0);
  const formattedBalance = currencyFormatter(totalBalance);
  const formattedPriceChange = currencyFormatter(priceChanges.value);

  return (
    <Stack alignItems="flex-end" gap={0.5}>
      <Typography variant="subtitle3" color="text.primary">
        {formattedBalance}
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        gap={0.5}
        sx={{ color: trendColor }}
      >
        <Typography variant="subtitle3">{formattedPriceChange}</Typography>
        {trendIcon}
      </Stack>
    </Stack>
  );
};
