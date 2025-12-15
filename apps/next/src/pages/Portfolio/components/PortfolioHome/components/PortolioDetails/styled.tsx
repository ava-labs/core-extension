import { Button, ButtonProps, styled } from '@avalabs/k2-alpine';

export const StyledButton = styled((buttonProps: ButtonProps) => (
  <Button
    variant="contained"
    color="secondary"
    size="xsmall"
    {...buttonProps}
  />
))(({ theme }) => ({
  paddingInline: theme.spacing(1.5),
  '& .MuiButton-endIcon': {
    marginLeft: 0,
  },
}));
