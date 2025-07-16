import { Stack, StackProps, styled } from '@avalabs/k2-alpine';
import { ModalPageControlProvider } from './ModalPageControlProvider';

const StyledRoot = styled(Stack)`
  padding: ${({ theme }) => theme.spacing(0, 4)};
  height: 100%;
  width: 100%;
`;

export const FullscreenModalContentRoot = ({
  children,
  ...props
}: StackProps) => (
  <StyledRoot {...props}>
    <ModalPageControlProvider>{children}</ModalPageControlProvider>
  </StyledRoot>
);
