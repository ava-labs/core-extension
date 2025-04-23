import { useTranslation } from 'react-i18next';
import {
  AlertCircleIcon,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { AuthErrorCode } from '@core/service-worker';

type Props = {
  error: AuthErrorCode;
};

export const AuthenticationError = ({ error }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack
      sx={{
        width: 1,
        px: 5,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <AlertCircleIcon size={48} color="error.light" />
      {error === AuthErrorCode.MismatchingEmail ? (
        <>
          <Typography variant="h5">{t('Wrong email address.')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t(
              'Please log in with the email address you used when you created your wallet.',
            )}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h5">
            {t('Sorry, we are having trouble logging you in.')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('Please verify your network connection or try again later.')}
          </Typography>
        </>
      )}
    </Stack>
  );
};
