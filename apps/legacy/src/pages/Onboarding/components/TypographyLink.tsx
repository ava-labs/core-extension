import { styled, Typography } from '@avalabs/core-k2-components';

export const TypographyLink = styled(Typography)`
  cursor: pointer;
  color: ${({ theme }) => theme.palette.secondary.main};
  font-weight: 600;
  text-decoration: none;
`;
