import { CoreIcon, Stack, Typography } from '@avalabs/core-k2-components';

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
      <CoreIcon size={30} />
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
