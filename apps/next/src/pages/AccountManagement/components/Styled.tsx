import {
  Divider as K2Divider,
  Card as K2Card,
  CardContent as K2CardContent,
  dividerClasses,
  menuItemClasses,
  styled,
} from '@avalabs/k2-alpine';

export * from './Styled';

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

export const Divider = styled(K2Divider)({
  [`.${menuItemClasses.root}+&.${dividerClasses.root}`]: {
    marginBlock: 0,
  },

  [`&.${dividerClasses.inset}`]: {
    marginInlineStart: 52,
  },

  ['&:last-child']: {
    display: 'none',
  },
}) as typeof K2Divider;
