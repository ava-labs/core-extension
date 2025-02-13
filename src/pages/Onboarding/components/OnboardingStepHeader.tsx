import { Stack, Typography } from '@avalabs/core-k2-components';

interface OnboardingStepHeaderProps {
  testId?: string;
  title?: string;
  onBack?: () => void;
}

export function OnboardingStepHeader({
  testId,
  title,
}: OnboardingStepHeaderProps) {
  return (
    <Stack
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <img src="/images/logo-transparent.svg" height={15} />
      {title && (
        <Typography
          variant="h3"
          sx={{
            pt: 3,
          }}
          data-testid={`${testId}-header`}
        >
          {title}
        </Typography>
      )}
    </Stack>
  );
}
