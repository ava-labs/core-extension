import { Collapse, Typography } from '@avalabs/k2-alpine';

import { useSwapFormError } from '../hooks';

export const SwapErrorMessage = () => {
  const formError = useSwapFormError();

  return (
    <Collapse in={Boolean(formError)}>
      <Typography
        component="p"
        color="error.main"
        textAlign="center"
        variant="caption"
      >
        {formError}
      </Typography>
    </Collapse>
  );
};
