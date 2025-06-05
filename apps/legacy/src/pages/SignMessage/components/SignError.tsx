import { useTranslation } from 'react-i18next';

export function SignError() {
  const { t } = useTranslation();
  return <>{t('Error, malformed request data')}</>;
}
