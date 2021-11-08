import { VerticalFlex } from '@avalabs/react-components';
import styled from 'styled-components';

export const IllustrationPlaceholder = styled(VerticalFlex)<{
  size?: number;
}>`
  width: ${({ size }) => size || '240'}px;
  height: ${({ size }) => size || '240'}px;
  border-radius: 50%;
  background: ${({ theme }) => theme.palette.grey[800]};
  justify-content: center;
  align-items: center;
`;
