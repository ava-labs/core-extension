import { Stack, styled } from '@avalabs/k2-alpine';

export const ApprovalScreenPage = styled(Stack)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  backgroundColor: theme.palette.alphaMatch.backdropSolid,
  overflow: 'hidden',
}));
