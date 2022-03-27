import { PrimaryIconButton } from '@avalabs/react-components';
import styled from 'styled-components';

export const SwitchIconContainer = styled(PrimaryIconButton)<{
  isSwapped: boolean;
}>`
  background-color: ${({ theme }) => theme.swapCard.swapIconBg};
  &[disabled] {
    background-color: ${({ theme }) => theme.swapCard.swapIconBg};
  }
  transition: all 0.2s;
  transform: ${({ isSwapped }) =>
    isSwapped ? 'rotate(0deg)' : 'rotate(180deg)'};
`;
