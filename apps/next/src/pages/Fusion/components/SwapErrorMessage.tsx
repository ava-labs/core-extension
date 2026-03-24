import { FC } from 'react';
import { Typography } from '@avalabs/k2-alpine';

type Props = {
  formError: string | React.ReactNode;
};

export const SwapErrorMessage: FC<Props> = ({ formError }) => (
  <Typography
    component="p"
    color="error.main"
    textAlign="center"
    variant="caption"
    minHeight="1lh"
  >
    {formError}
  </Typography>
);
