import { Stack, styled } from '@avalabs/k2-alpine';

export const OnboardingStepActions = styled(Stack)`
  padding-top: ${({ theme }) => theme.spacing(3.5)};
  padding-bottom: ${({ theme }) => theme.spacing(4)};
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;
