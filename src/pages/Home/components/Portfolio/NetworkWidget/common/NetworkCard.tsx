import { Card, styled } from '@avalabs/core-k2-components';

export const NetworkCard = styled(Card)`
  padding: 16px;
  cursor: pointer;
  line-height: 1;
  &:hover {
    background-color: ${({ theme }) => `${theme.palette.grey[800]}b3`};
  }
`;
