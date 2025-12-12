import { Collapse, Typography, useTheme } from '@avalabs/k2-alpine';

type Props = {
  formError: string;
};

export const BridgeErrorMessage = ({ formError }: Props) => {
  const theme = useTheme();

  return (
    <Collapse in={Boolean(formError)}>
      <Typography
        component="p"
        color="error.main"
        textAlign="center"
        variant="caption"
        height={theme.typography.caption.lineHeight}
      >
        {formError ? formError : ' '}
      </Typography>
    </Collapse>
  );
};
