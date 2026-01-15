import {
  Stack,
  Theme,
  TriangleDownIcon,
  TriangleUpIcon,
  Skeleton,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import {
  FungibleTokenBalance,
  getUnconfirmedBalanceInCurrency,
} from '@core/types';
import { useSettingsContext } from '@core/ui';

export type Trend = 'up' | 'down' | 'no-change';

interface ProfitAndLossProps {
  asset: FungibleTokenBalance;
}

const getTrend = (percentage: number | undefined | null): Trend => {
  if (!percentage) {
    return 'no-change';
  }

  return percentage > 0 ? 'up' : 'down';
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
  const { currencyFormatter, privacyMode } = useSettingsContext();
  const theme = useTheme();

  const priceChanges = asset.priceChanges;
  const balanceInCurrency = asset.balanceInCurrency;

  if (balanceInCurrency === undefined) {
    return null;
  }

  const trend = getTrend(priceChanges?.percentage);
  const trendColor = getTrendColor(trend, theme);
  const trendIcon = getTrendIcon(trend);

  const totalBalance =
    balanceInCurrency + (getUnconfirmedBalanceInCurrency(asset) ?? 0);
  const formattedBalance = currencyFormatter(totalBalance);
  const formattedPriceChange = currencyFormatter(priceChanges?.value ?? 0);

  return (
    <Stack alignItems="flex-end" gap={0}>
      <Typography variant="subtitle3" color="text.primary">
        {formattedBalance}
      </Typography>
      {!!priceChanges?.value &&
        !!priceChanges?.percentage &&
        (!privacyMode ? (
          <Stack
            direction="row"
            alignItems="center"
            gap={0.5}
            sx={{ color: trendColor }}
          >
            <Typography variant="subtitle3">{formattedPriceChange}</Typography>
            {trendIcon}
          </Stack>
        ) : (
          <Skeleton height={18} width={40} />
        ))}
    </Stack>
  );
};
