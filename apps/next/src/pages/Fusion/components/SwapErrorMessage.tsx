import { Collapse, Typography, useTheme } from '@avalabs/k2-alpine';
import { useSwapState } from '../contexts/SwapStateContext';

export const SwapErrorMessage = () => {
  const theme = useTheme();
  const { swapError } = useSwapState();

  return (
    <Collapse in={Boolean(swapError?.message)}>
      <Typography
        component="p"
        color="error.main"
        textAlign="center"
        variant="caption"
        height={theme.typography.caption.lineHeight}
      >
        {swapError?.message ?? ' '}
      </Typography>
    </Collapse>
  );
};
