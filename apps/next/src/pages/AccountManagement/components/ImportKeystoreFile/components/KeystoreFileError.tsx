import { Button, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { useErrorMessage } from '@core/ui';
import { noop } from 'lodash';
import { useTranslation } from 'react-i18next';
import { MdErrorOutline } from 'react-icons/md';

type KeystoreFileErrorProps = {
  error: unknown;
  onTryAgain: () => void;
};

export const KeystoreFileError = ({
  error,
  onTryAgain,
}: KeystoreFileErrorProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const getTranslatedError = useErrorMessage();

  const { title, hint } = getTranslatedError(error);

  return (
    <Stack sx={{ flexGrow: 1 }}>
      <Stack
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          mt: '115px',
        }}
      >
        <MdErrorOutline size={40} color={theme.palette.error.main} />
        <Stack sx={{ gap: 1, maxWidth: '180px', mt: '7px', mb: '21px' }}>
          <Typography color="error.main" variant="subtitle3">
            {title}
          </Typography>
          <Typography color="error.main" variant="caption">
            {hint}
          </Typography>
        </Stack>

        <Button
          onClick={onTryAgain}
          sx={{ marginTop: 'auto' }}
          variant="contained"
          color="primary"
          size="small"
        >
          {t('Try again')}
        </Button>
      </Stack>

      <Button
        disabled={true}
        onClick={noop}
        sx={{ marginTop: 'auto' }}
        variant="contained"
        color="primary"
        fullWidth
      >
        {t('Next')}
      </Button>
    </Stack>
  );
};
