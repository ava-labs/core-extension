import { MenuItem as K2MenuItem, styled } from '@avalabs/k2-alpine';

export const MenuItem = styled(K2MenuItem)(({ theme }) => ({
  marginInline: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  paddingInline: theme.spacing(0.5),
  minHeight: 'unset',
  width: 'auto',
}));
