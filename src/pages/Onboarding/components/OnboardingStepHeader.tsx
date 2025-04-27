import { Stack, Typography } from '@avalabs/core-k2-components';
import { BrandName } from '@src/components/icons/BrandName';

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
      <BrandName width={90} />
      {title && (
        <Typography
          variant="h3"
          sx={{
            pt: 3.5,
          }}
          data-testid={`${testId}-header`}
        >
          {title}
        </Typography>
      )}
    </Stack>
  );
}
