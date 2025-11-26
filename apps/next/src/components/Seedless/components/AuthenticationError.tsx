import { Typography } from '@avalabs/k2-alpine';
import { AuthErrorCode } from '@core/types';
import { useTranslation } from 'react-i18next';
import { StyledStackAuthError } from '../styled';

type Props = {
  error?: AuthErrorCode;
};

export const AuthenticationError = ({ error }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledStackAuthError>
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
    </StyledStackAuthError>
  );
};
