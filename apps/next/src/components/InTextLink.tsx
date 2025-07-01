import { Link, styled } from '@avalabs/k2-alpine';

export const InTextLink = styled(Link)(({ theme }) => ({
  cursor: 'pointer',
  textDecoration: 'underline',
  color: 'currentColor',
  transition: theme.transitions.create('opacity'),
  '&:hover': {
    opacity: 0.8,
  },
}));
