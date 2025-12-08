import { Collapse, Typography, useTheme } from '@avalabs/k2-alpine';

type Props = {
  formError: string;
  transactionError: string;
};

export const BridgeErrorMessage = ({ formError, transactionError }: Props) => {
  const theme = useTheme();

  return (
    <Collapse in={Boolean(formError || transactionError)}>
      <Typography
        component="p"
        color="error.main"
        textAlign="center"
        variant="caption"
        height={theme.typography.caption.lineHeight}
      >
        {formError ? formError : transactionError ? transactionError : ' '}
      </Typography>
    </Collapse>
  );
};
