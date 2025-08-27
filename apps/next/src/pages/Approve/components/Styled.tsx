import { Stack, styled } from '@avalabs/k2-alpine';

export const ApprovalScreenPage = styled(Stack)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  backgroundColor: theme.palette.alphaMatch.backdropSolid,
  overflow: 'hidden',
}));

// TODO: remove this once we have a proper scrollable component
export const NoScrollStack = styled(Stack)`
  overflow: auto;
  flex-grow: 1;
  &::-webkit-scrollbar {
    display: none;
  }
`;
