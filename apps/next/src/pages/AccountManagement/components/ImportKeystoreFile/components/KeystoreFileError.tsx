import { AlertCircleIcon } from '@avalabs/core-k2-components';
import { Button, Card, Stack, Typography } from '@avalabs/k2-alpine';
import { useErrorMessage } from '@core/ui';
import { useTranslation } from 'react-i18next';

type KeystoreFileErrorProps = {
  error: unknown;
  onTryAgain: () => void;
};

export const KeystoreFileError = ({
  error,
  onTryAgain,
}: KeystoreFileErrorProps) => {
  const { t } = useTranslation();
  const getTranslatedError = useErrorMessage();

  const { title, hint } = getTranslatedError(error);

  return (
    <Stack sx={{ px: 2, pt: 1, flexGrow: 1, gap: 1 }}>
      <Card
        sx={{
          backgroundColor: 'grey.800',
          px: 4,
          py: 8,
        }}
      >
        <Stack
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: 3,
          }}
        >
          <AlertCircleIcon size={64} />
          <Stack sx={{ gap: 1 }}>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {hint}
            </Typography>
          </Stack>

          <Button
            size="medium"
            fullWidth
            onClick={onTryAgain}
            data-testid="try-again-button"
          >
            {t('Try Again')}
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
};
