import styled from 'styled-components';

export const TokenImg = styled.img<{
  height?: string;
  width?: string;
}>`
  height: ${({ height = 32 }) => `${height}px`};
  width: ${({ width = 32 }) => `${width}px`};
  border-radius: 50%;
`;
