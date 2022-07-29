import { HorizontalFlex } from '@avalabs/react-components';
import styled from 'styled-components';

export const NetworkListItem = styled(HorizontalFlex)<{ animated?: boolean }>`
  color: ${({ theme }) => theme.colors.text1};
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.colors.bg2};
  }
`;
