import styled from 'styled-components';
import { List } from 'react-virtualized';

const VirtualizedList = styled(List)`
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.stroke1};
    borderradius: 9999;
  }
`;
export default VirtualizedList;
