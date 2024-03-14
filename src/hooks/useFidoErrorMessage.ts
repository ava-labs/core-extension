import { useTranslation } from 'react-i18next';

import { AuthErrorCode } from '@src/background/services/seedless/models';

export const useFidoErrorMessage = (code?: AuthErrorCode): string => {
  const { t } = useTranslation();

  if (code === AuthErrorCode.FidoChallengeNotApproved) {
    return t('Action was not approved. Please try again.');
  }

  if (code === AuthErrorCode.FidoChallengeFailed) {
    return t(
      'The operation either timed out or was not allowed. Please try again.'
    );
  }

  if (code === AuthErrorCode.UnknownError) {
    return t('An unexpected error occurred. Please try again.');
  }

  return '';
};
