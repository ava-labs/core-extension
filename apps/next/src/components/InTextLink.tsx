import { Link, styled } from '@avalabs/k2-alpine';

export const InTextLink = styled(Link)({
  cursor: 'pointer',
  textDecoration: 'underline',
  color: 'currentColor',
  transition: 'opacity 0.15s ease-in-out',
  '&:hover': {
    opacity: 0.8,
  },
});
