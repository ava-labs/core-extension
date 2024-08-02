import {
  AlertCircleIcon,
  Button,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { ExportErrorCode } from '@src/hooks/useSeedlessMnemonicExport';
import { useTranslation } from 'react-i18next';

type Props = {
  error?: ExportErrorCode;
  onRetry: () => void;
  onClose: () => void;
};

export const ExportError = ({ error, onRetry, onClose }: Props) => {
  const { t } = useTranslation();

  const isOutdated = error == ExportErrorCode.RequestOutdated;

  return (
    <Stack sx={{ width: 1, height: 1 }}>
      <Stack
        sx={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <AlertCircleIcon size={48} color="error.light" />
        <Typography variant="h5">
          {isOutdated
            ? t('Request Outdated')
            : t('Sorry, an unknown error occurred.')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isOutdated
            ? t('Please try again.')
            : t('Please try again later or contact Core support.')}
        </Typography>
      </Stack>
      <Button
        color="primary"
        size="large"
        onClick={isOutdated ? onRetry : onClose}
        fullWidth
      >
        {isOutdated ? t('Try again') : t('Close')}
      </Button>
    </Stack>
  );
};
