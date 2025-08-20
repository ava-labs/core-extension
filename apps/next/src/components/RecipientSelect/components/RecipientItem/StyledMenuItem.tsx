import { MenuItem, styled } from '@avalabs/k2-alpine';

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  marginInline: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  paddingInline: theme.spacing(1.5),
  minHeight: 'unset',
  width: 'auto',
}));
