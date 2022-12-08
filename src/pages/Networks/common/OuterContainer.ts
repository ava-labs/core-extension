import { VerticalFlex } from '@avalabs/react-components';
import styled from 'styled-components';

export const OuterContainer = styled(VerticalFlex)`
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  left: 0;
  &.item-exit {
    left: 0;
  }
  &.item-exit-active {
    left: 1500px;
    transition: left 500ms ease-in-out;
  }
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey[700]};
  :last-of-type {
    border-bottom: none;
  }
`;
