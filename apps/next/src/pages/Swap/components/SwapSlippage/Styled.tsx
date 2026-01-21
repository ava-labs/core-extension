import { Button, styled, type ButtonProps } from '@avalabs/k2-alpine';

export const SlippagePresetButton = styled((props: ButtonProps) => (
  <Button {...props} variant="contained" fullWidth />
))(({ theme }) => ({
  flex: 1,
  flexBasis: 0,
  paddingBlock: theme.spacing(2.75),
  paddingInline: theme.spacing(1),
  borderRadius: theme.shape.mediumBorderRadius,
  minWidth: 'auto',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 500,
}));
