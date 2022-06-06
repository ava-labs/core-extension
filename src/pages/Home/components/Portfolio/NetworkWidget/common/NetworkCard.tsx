import { Card } from '@avalabs/react-components';
import styled from 'styled-components';

export const NetworkCard = styled(Card)`
  padding: 16px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => `${theme.palette.grey[800]}b3`};
  }
`;
