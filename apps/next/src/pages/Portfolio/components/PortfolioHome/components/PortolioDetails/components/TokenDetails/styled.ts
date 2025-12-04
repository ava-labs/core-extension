import { Box, Stack, styled } from '@avalabs/k2-alpine';
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

export const StyledTokenDetails = styled(Stack)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

export const StyledTokenScrollContainer = styled(Box)(() => ({
  flex: '1 1 auto',
  minHeight: 0,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
}));

export const StyledTokenSummary = styled(Stack)(({ theme }) => ({
  flex: '0 0 auto',
  marginBottom: theme.spacing(1.75),
  paddingTop: theme.spacing(2),
  paddingRight: theme.spacing(1.5),
  paddingLeft: theme.spacing(1.5),
}));

export const StyledTokenDetailsContent = styled(Box)(({ theme }) => ({
  flex: '1 1 auto',
  paddingRight: theme.spacing(1.5),
  paddingLeft: theme.spacing(1.5),
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(1.75),
}));
