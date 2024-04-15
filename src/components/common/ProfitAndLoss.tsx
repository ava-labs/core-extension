import { Stack, Trend, ProfitAndLoss } from '@avalabs/k2-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

interface PandLProps {
  value?: number;
  percentage?: number;
  showPercentage?: boolean;
  size?: 'big';
}

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

  let decimals = 2;
  const percentageString = percentage.toString();

  const maxDecimals = 10;
  for (let i = 0; i <= percentageString.length && i <= maxDecimals; i++) {
    if (
      percentageString[i] !== '0' &&
      percentageString[i] !== '.' &&
      percentageString[i] !== '-'
    ) {
      break;
    }
    decimals = i;
    if (i === maxDecimals && percentageString[i] !== '0') {
      decimals = 2;
    }
  }
  return (
    <Stack>
      <ProfitAndLoss
        value={currencyFormatter(value)}
        percentage={
          showPercentage ? `${percentage.toFixed(decimals)}%` : undefined
        }
        trend={trend}
        size={size}
      />
    </Stack>
  );
};
