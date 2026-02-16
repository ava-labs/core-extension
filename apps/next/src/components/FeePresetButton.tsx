import { Button, ButtonProps, styled } from '@avalabs/k2-alpine';

export const FeePresetButton = styled((props: ButtonProps) => (
  <Button {...props} variant="contained" fullWidth />
))(({ theme }) => ({
  paddingBlock: theme.spacing(2.75),
  paddingInline: theme.spacing(1),
  borderRadius: '8px',
  minWidth: 'auto',
  textTransform: 'none',
  fontSize: '12px',
  fontWeight: 500,
}));
