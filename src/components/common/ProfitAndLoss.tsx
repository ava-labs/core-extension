import { Stack, Trend, ProfitAndLoss } from '@avalabs/k2-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

interface PandLProps {
  value?: number;
  percentage?: number;
  showPercentage?: boolean;
  size?: 'big';
}

const DEFAULT_DECIMALS = 2;

export const PAndL = ({
  value,
  percentage,
  size,
  showPercentage,
}: PandLProps) => {
  const { currencyFormatter } = useSettingsContext();
  if (!percentage || !value) {
    return <></>;
  }
  const trend = percentage > 0 ? Trend.Up : Trend.Down;

  return (
    <Stack>
      <ProfitAndLoss
        value={currencyFormatter(value)}
        percentage={
          showPercentage
            ? `${percentage.toFixed(DEFAULT_DECIMALS)}%`
            : undefined
        }
        trend={trend}
        size={size}
      />
    </Stack>
  );
};
