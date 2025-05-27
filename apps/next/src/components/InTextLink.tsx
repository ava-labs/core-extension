import { Link, styled } from '@avalabs/k2-alpine';

export const InTextLink = styled(Link)(({ theme }) => ({
  cursor: 'pointer',
  textDecoration: 'underline',
  transition: 'color 0.15s ease-in-out',
  '&:hover': {
    color: theme.palette.text.secondary,
  },
}));
