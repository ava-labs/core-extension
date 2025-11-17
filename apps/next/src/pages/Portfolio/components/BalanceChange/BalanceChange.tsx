import {
  Box,
  Stack,
  TriangleDownIcon,
  TriangleUpIcon,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { useSettingsContext } from '@core/ui';
import { FC } from 'react';

interface BalanceChangeProps {
  balanceChange?: number;
  percentageChange?: number;
}
export const BalanceChange: FC<BalanceChangeProps> = ({
  balanceChange,
  percentageChange,
}) => {
  const theme = useTheme();
  const { currencyFormatter } = useSettingsContext();

  if (!balanceChange) return null;

  const isLoss = balanceChange < 0;
  const PnLIcon = isLoss ? TriangleDownIcon : TriangleUpIcon;
  const pnlColor = isLoss
    ? theme.palette.error.main
    : theme.palette.success.main;
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" useFlexGap>
      <Typography variant="caption" color={pnlColor} fontWeight={600}>
        {isLoss ? '' : '+'}
        {currencyFormatter(balanceChange)}
      </Typography>
      <Box color={pnlColor}>
        <PnLIcon size={12} />
      </Box>
      <Typography variant="caption" fontWeight={600}>
        {`${(percentageChange ?? 0).toFixed(1)}%`}
      </Typography>
    </Stack>
  );
};
