import { styled } from '@avalabs/core-k2-components';
import { List } from 'react-virtualized';

const VirtualizedList = styled(List)`
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.palette.divider};
    border-radius: 3px;
  }
`;
export default VirtualizedList;
