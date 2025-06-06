import { styled, Typography, TypographyProps } from '@avalabs/k2-alpine';

const StyledTitle = styled(Typography)`
  margin: ${({ theme }) => theme.spacing(2, 0)};
`;

export const OnboardingStepTitle = (props: TypographyProps) => (
  <StyledTitle variant="h1" {...props} />
);
