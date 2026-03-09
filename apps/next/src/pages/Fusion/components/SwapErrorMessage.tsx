import { Collapse, Typography, useTheme } from '@avalabs/k2-alpine';

import { useSwapFormError } from '../hooks';

export const SwapErrorMessage = () => {
  const theme = useTheme();
  const formError = useSwapFormError();

  return (
    <Collapse in={Boolean(formError)} appear unmountOnExit={false}>
      <Typography
        component="p"
        color="error.main"
        textAlign="center"
        variant="caption"
        minHeight={theme.typography.caption.lineHeight}
      >
        {formError}
      </Typography>
    </Collapse>
  );
};
