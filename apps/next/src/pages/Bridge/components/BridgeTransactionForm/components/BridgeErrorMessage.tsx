import { Collapse, Typography } from '@avalabs/k2-alpine';

type Props = {
  formError: string;
};

export const BridgeErrorMessage = ({ formError }: Props) => (
  <Collapse in={Boolean(formError)}>
    <Typography
      component="p"
      color="error.main"
      textAlign="center"
      variant="caption"
    >
      {formError ? formError : ' '}
    </Typography>
  </Collapse>
);
