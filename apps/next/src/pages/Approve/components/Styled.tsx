import { Stack, StackProps, styled, Typography } from '@avalabs/k2-alpine';

export const ApprovalScreenPage = styled(Stack)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  bgcolor: 'alphaMatch.backdropSolid',
  overflow: 'hidden',
  paddingTop: theme.spacing(3),
}));

// TODO: remove this once we have a proper scrollable component
export const NoScrollStack = styled(Stack)`
  overflow: auto;
  flex-grow: 1;
  margin-top: ${({ theme }) => theme.spacing(2)};
  &::-webkit-scrollbar {
    display: none;
  }
`;

type ApprovalScreenTitleProps = StackProps & {
  title: string;
};
export const ApprovalScreenTitle = ({
  title,
  ...props
}: ApprovalScreenTitleProps) => (
  <Stack px={2} {...props}>
    <Typography variant="h2">{title}</Typography>
  </Stack>
);
