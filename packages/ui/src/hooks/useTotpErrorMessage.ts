import { AuthErrorCode } from '@core/types';
import { useTranslation } from 'react-i18next';

export const useTotpErrorMessage = (code?: AuthErrorCode): string => {
  const { t } = useTranslation();

  if (code === AuthErrorCode.InvalidTotpCode) {
    return t('The code you entered is incorrect. Please try again');
  }

  if (code === AuthErrorCode.TotpVerificationError) {
    return t('We were not able to verify this code. Please try again.');
  }

  return '';
};
