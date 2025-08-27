import { Card, styled } from '@avalabs/k2-alpine';

export const NetworkDetailsCard = styled(Card)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.shape.mediumBorderRadius,
  paddingInline: theme.spacing(2),
}));
