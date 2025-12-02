import { styled } from '@avalabs/k2-alpine';
import { Card } from '@/components/Card';

export const StyledCardNoPaddingY = styled(Card)(({ theme }) => ({
  paddingRight: theme.spacing(1.5),
  paddingLeft: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  backgroundImage: 'none',
}));

export const StyledCard = styled(StyledCardNoPaddingY)(({ theme }) => ({
  padding: theme.spacing(1.5),
}));
