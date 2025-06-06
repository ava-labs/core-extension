import { styled, Typography, TypographyProps } from '@avalabs/k2-alpine';

const StyledTitle = styled(Typography)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

export const OnboardingStepTitle = (props: TypographyProps) => (
  <StyledTitle variant="h1" {...props} />
);
