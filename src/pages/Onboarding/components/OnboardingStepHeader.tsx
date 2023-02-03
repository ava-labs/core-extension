import {
  Button,
  Stack,
  Typography,
  useTheme,
  XIcon,
} from '@avalabs/k2-components';

interface OnboardingStepHeaderProps {
  testId?: string;
  title?: string;
  onBack?: () => void;
  onClose?: () => void;
}

export function OnboardingStepHeader({
  testId,
  title,
  onClose,
}: OnboardingStepHeaderProps) {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        width: '100%',
        pt: theme.spacing(2),
        pr: theme.spacing(2),
        pb: 0,
        pl: theme.spacing(6),
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      {title && (
        <Typography
          variant="h4"
          sx={{
            flexGrow: 1,
            pt: 3,
          }}
          data-testid={`${testId}-header`}
        >
          {title}
        </Typography>
      )}
      {onClose && (
        <Button
          variant="text"
          data-testid={`${testId}-close-button`}
          onClick={onClose}
          sx={{
            p: 0,
            height: theme.spacing(3),
            width: theme.spacing(3),
            minWidth: theme.spacing(3),
          }}
        >
          <XIcon size={24} sx={{ color: 'primary.main' }} />
        </Button>
      )}
    </Stack>
  );
}
