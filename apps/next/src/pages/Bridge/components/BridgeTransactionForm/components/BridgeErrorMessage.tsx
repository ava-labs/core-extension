import { Collapse, Typography, useTheme } from '@avalabs/k2-alpine';

export const BridgeErrorMessage = ({ error }: { error: string }) => {
  const theme = useTheme();

  return (
    <Collapse in={Boolean(error)}>
      <Typography
        component="p"
        color="error.main"
        textAlign="center"
        variant="caption"
        height={theme.typography.caption.lineHeight}
      >
        {error ?? ' '}
      </Typography>
    </Collapse>
  );
};
