import { Stack } from '@avalabs/k2-components';
import styled from 'styled-components';

export const SwitchIconContainer = styled(Stack)<{
  isSwapped: boolean;
}>`
  transition: all 0.2s;
  transform: ${({ isSwapped }) =>
    isSwapped ? 'rotate(0deg)' : 'rotate(180deg)'};
`;
