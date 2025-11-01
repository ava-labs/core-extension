import {
  Stack,
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

export enum Trend {
  Up = 'up',
  Down = 'down',
  NoChange = 'no-change',
}

interface ProfitAndLossProps {
  // value?: number;
  // percentage?: number;
  // showPercentage?: boolean;
  // size?: 'big';
  asset: FungibleTokenBalance;
}

export const ProfitAndLoss = ({
  // value,
  // percentage,
  // size,
  // showPercentage,
  // balanceInCurrency,
  asset,
}: ProfitAndLossProps) => {
  const { currencyFormatter } = useSettingsContext();
  const theme = useTheme();

  const trend =
    asset.priceChanges?.percentage && asset.priceChanges?.percentage > 0
      ? Trend.Up
      : Trend.Down;

  const color = useMemo(() => {
    if (trend === Trend.Up) {
      return theme.palette.success.main;
    }
    if (trend === Trend.Down) {
      return theme.palette.error.light;
    }
    return theme.palette.text.secondary;
  }, [
    theme.palette.error.light,
    theme.palette.success.main,
    theme.palette.text.secondary,
    trend,
  ]);

  const Icon = () => {
    if (trend === Trend.Up) {
      return <TriangleUpIcon size={8} />;
    }
    if (trend === Trend.Down) {
      return <TriangleDownIcon size={8} />;
    }
  };

  if (
    !asset.priceChanges?.percentage ||
    !asset.priceChanges?.value ||
    !asset.balanceInCurrency
  ) {
    return <></>;
  }

  return (
    <Stack>
      {/* <ProfitAndLoss
        value={currencyFormatter(value)}
        percentage={
          showPercentage
            ? `${percentage.toFixed(DEFAULT_DECIMALS)}%`
            : undefined
        }
        trend={trend}
        size={size}
      /> */}
      <Stack sx={{ gap: 0.5 }}>
        <>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            {/* {`${percentage.toFixed(DEFAULT_DECIMALS)}%`} */}
            {currencyFormatter(
              asset.balanceInCurrency +
                (getUnconfirmedBalanceInCurrency(asset) ?? 0),
            )}
          </Typography>
        </>

        <Stack
          sx={{ flexDirection: 'row', color, alignItems: 'center', gap: 0.5 }}
        >
          <Typography>{currencyFormatter(asset.priceChanges.value)}</Typography>
          <Icon />
        </Stack>
      </Stack>
    </Stack>
  );
};
