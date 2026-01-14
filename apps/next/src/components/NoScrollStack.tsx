import { Stack, styled } from '@avalabs/k2-alpine';

// TODO: remove this once we have a proper scrollable component
export const NoScrollStack = styled(Stack)`
  &::-webkit-scrollbar {
    display: none;
  }
`;
