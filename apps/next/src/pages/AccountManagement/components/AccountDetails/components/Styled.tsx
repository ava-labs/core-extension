import {
  Card as K2Card,
  CardContent as K2CardContent,
  styled,
} from '@avalabs/k2-alpine';

export * from '../../Styled';

export const Card = styled(K2Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.surface.primary
      : theme.palette.background.paper,
}));

export const CardContent = styled(K2CardContent)({
  padding: 0,
  '&:last-child': {
    paddingBottom: 0,
  },
});
