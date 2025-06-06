import { Stack, styled } from '@avalabs/k2-alpine';

export const OnboardingStepContent = styled(Stack)`
  padding-top: ${({ theme }) => theme.spacing(4)};
  flex-grow: 1;
  height: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;
