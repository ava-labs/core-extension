import styled from 'styled-components';

export const TokenImg = styled.img<{
  height?: string;
  width?: string;
}>`
  height: ${({ height = 30 }) => `${height}px`};
  width: ${({ width = 30 }) => `${width}px`};
  border-radius: 50%;
`;
