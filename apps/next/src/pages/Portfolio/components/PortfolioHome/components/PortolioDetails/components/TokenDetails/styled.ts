import { styled } from '@avalabs/k2-alpine';
import { Card } from '@/components/Card';

export const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  backgroundImage: 'none',
  marginTop: theme.spacing(2),
}));
