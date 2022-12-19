import { HorizontalFlex } from '@avalabs/react-components';
import styled from 'styled-components';

export const NetworkListItem = styled(HorizontalFlex)<{
  isActive?: boolean;
}>`
  color: ${({ theme }) => theme.colors.text1};
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
  width: 100%;
  :hover {
    background-color: ${({ theme }) => theme.colors.bg2};
  }
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.bg2 : 'inherit'}; ;
`;
